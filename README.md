# Counter-Strike 1.6 Web Server

This repository provides a **plug-and-play Docker image** for running a fully functional **Counter-Strike 1.6** client and dedicated server via the web. Powered by **Xash3D FWGS**, **WebRTC**, and modern web tooling, this setup allows for in-browser gameplay and remote multiplayer support.

## 🏆 Features

- ✅ Web-based CS 1.6 client (HTML + TypeScript + Vite)
- ✅ Dedicated CS 1.6 server (Go + CGO + Xash3D FWGS)
- ✅ WebRTC support for browser-to-server networking
- ✅ AMX Mod X & Metamod-R compatible
- ✅ Dockerized & easy to deploy
- ✅ i386 (32-bit) architecture support

## 🙏 Acknowledgements

Special thanks to **[yohimik](https://github.com/yohimik)** for his outstanding work on the [Xash3D-FWGS Emscripten Web Port](https://github.com/yohimik/webxash3d-fwgs) and the [Xash3D-FWGS CGO Wrapper](https://github.com/yohimik/goxash3d-fwgs), which made this possible!

## 🚀 Getting Started

### docker compose (recommended)

```yaml
---
services:
  cs16-web-server:
    image: ghcr.io/balintsoos/cs16-web-server:latest
    container_name: cs16-web-server
    command: ["+map de_dust2", "+maxplayers 14"]
    restart: always
    platform: linux/386
    environment:
      IP: 127.0.0.1
      PORT: 27018
    ports:
      - "27016:27016"
      - "27018:27018/tcp"
      - "27018:27018/udp"
```

### docker cli

```shell
docker run -d \
  -name=cs16-web-server \
  -e IP=127.0.0.1 \
  -e PORT=27018 \
  -p 27016:27016 \
  -p 27018:27018/tcp \
  -p 27018:27018/udp \
  --platform linux/386
  --restart always \
  ghcr.io/balintsoos/cs16-web-server:latest \
  +map de_dust2 +maxplayers 14
```

Then open `http://127.0.0.1:27016` in your browser!

## 🌍 Environment Variables

| Variable               | Description                                            | Example             |
| ---------------------- | ------------------------------------------------------ | ------------------- |
| `IP`                   | Server IP address for WebRTC connection                | `123.45.67.89`      |
| `PORT`                 | UDP port for CS server (must be open)                  | `27018`             |
| `DISABLE_X_POWERED_BY` | Set to `true` to remove the `X-Powered-By` HTTP header | `true`              |
| `X_POWERED_BY_VALUE`   | Custom value for `X-Powered-By` header if not disabled | `CS 1.6 Web Server` |

## ⚙️ Customization

Client UI/UX:

- Modify files in src/client

Custom plugins:

- Mount a volume to /xashds inside the container
- Or copy plugin files into the Docker build context

## 🛠️ Development

### Build Docker image:

```shell
docker build --platform=linux/386 -t cs16-web-server .
```

### Install client dependencies, build and serve client:

```shell
nvm install
npm install
npm run build
npm run serve
```

### Install server dependencies:

```shell
goenv install
go mod download
```

## 📜 License

This project is licensed under the MIT License.
See the [LICENSE](./LICENSE) file for more information.

Counter-Strike and all related trademarks, logos, and intellectual property are the property of Valve Corporation. This project is not affiliated with or endorsed by Valve Corporation.
