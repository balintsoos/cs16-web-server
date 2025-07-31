import {Net, Packet, Xash3D, Xash3DOptions} from "xash3d-fwgs";

export class Xash3DWebRTC extends Xash3D {
    private channel?: RTCDataChannel
    private resolve?: (value?: unknown) => void
    private ws?: WebSocket
    private peer?: RTCPeerConnection
    private candidates: RTCIceCandidateInit[] = []
    private wasRemote = false
    private timeout?: ReturnType<typeof setTimeout>

    constructor(opts?: Xash3DOptions) {
        super(opts);
        this.net = new Net(this)
    }

    async init() {
        await Promise.all([
            super.init(),
            this.connect()
        ]);
    }

    initConnection(stream?: MediaStream) {
        if (this.peer) return

        this.peer = new RTCPeerConnection()
        this.peer.onicecandidate = e => {
            if (!e.candidate) {
                return
            }
            this.wsSend('candidate', e.candidate.toJSON())
        }
        this.peer.ontrack = (e) => {
            const el = document.createElement(e.track.kind) as HTMLAudioElement
            el.srcObject = e.streams[0]
            el.autoplay = true
            el.controls = true
            document.body.appendChild(el)

            e.track.onmute = () => {
                el.play()
            }

            e.streams[0].onremovetrack = () => {
                if (el.parentNode) {
                    el.parentNode.removeChild(el)
                }
            }
        }
        stream?.getTracks()?.forEach(t => {
            this.peer!.addTrack(t, stream)
        })
        let channelsCount = 0
        this.peer.ondatachannel = (e) => {
            if (e.channel.label === 'write') {
                e.channel.onmessage = (ee) => {
                    const packet: Packet = {
                        ip: [127, 0, 0, 1],
                        port: 8080,
                        data: ee.data
                    }
                    if (ee.data.arrayBuffer) {
                        ee.data.arrayBuffer().then((data: Int8Array) => {
                            packet.data = data
                            this.net!.incoming.enqueue(packet)
                        })
                    } else {
                        this.net!.incoming.enqueue(packet)
                    }
                }
            }
            e.channel.onopen = () => {
                channelsCount += 1
                if (e.channel.label === 'read') {
                    this.channel = e.channel
                }
                if (channelsCount === 2) {
                    if (this.resolve) {
                        const r = this.resolve
                        this.resolve = undefined
                        if (this.timeout) {
                            clearTimeout(this.timeout)
                            this.timeout = undefined
                        }
                        document.getElementById('warning')!.style.opacity = '0'
                        r()
                    }
                }
            }
        }
    }

    private async getUserMedia() {
        try {
            return await navigator.mediaDevices.getUserMedia({audio: true})
        } catch (e) {
            return undefined
        }
    }

    private wsSend(event: string, data: unknown) {
        this.ws?.send(JSON.stringify({
            event,
            data
        }))
    }

    async connect() {
        const stream = await this.getUserMedia()
        return new Promise(resolve => {
            this.resolve = resolve;
            const protocol = window.location.protocol === "https:" ? "wss" : "ws";
            const host = window.location.host;
            this.ws = new WebSocket(`${protocol}://${host}/websocket`);
            const handler = async (e: MessageEvent) => {
                const parsed = JSON.parse(e.data)
                switch (parsed.event) {
                    case 'offer':
                        await this.peer!.setRemoteDescription(parsed.data)
                        const answer = await this.peer!.createAnswer()
                        await this.peer!.setLocalDescription(answer)
                        this.wsSend('answer', answer)
                        if (!this.wasRemote) {
                            this.wasRemote = true
                            this.candidates.forEach(c => this.peer!.addIceCandidate(c))
                            this.candidates = []
                        }
                        break
                    case 'candidate':
                        if (this.wasRemote) {
                            await this.peer!.addIceCandidate(parsed.data)
                        } else {
                            this.candidates.push(parsed.data)
                        }
                        break
                }
            }
            this.ws!.onopen = () => {
                this.initConnection(stream)
                if (!stream) {
                    this.timeout = setTimeout(() => {
                        this.timeout = undefined
                        document.getElementById('warning')!.style.opacity = '1'
                    }, 10000)
                }
            }
            this.ws.addEventListener('message', handler)
        })
    }

    sendto(packet: Packet) {
        if (!this.channel) return
        this.channel.send(packet.data)
    }
}