# Counter-Strike 1.6 Web Server

This repository provides a **plug-and-play Docker image** for running a fully functional **Counter-Strike 1.6** client and dedicated server via the web. Powered by **Xash3D FWGS**, **WebRTC**, and modern web tooling, this setup allows for in-browser gameplay and remote multiplayer support.

## 🧱 Features

- ✅ Web-based CS 1.6 client (HTML + TypeScript + Vite)
- ✅ Dedicated CS 1.6 server (Go + CGO + Xash3D FWGS)
- ✅ WebRTC support for browser-to-server networking
- ✅ AMX Mod X & Metamod-R compatible
- ✅ Dockerized & easy to deploy
- ✅ i386 (32-bit) architecture support

## 🙏 Acknowledgements

Special thanks to [yohimik](https://github.com/yohimik) for his outstanding work on [Xash3D-FWGS Emscripten Web Port](https://github.com/yohimik/webxash3d-fwgs) and related projects, which made this possible!

## 📁 Repository Structure

```plaintext
.
├── Dockerfile            # Unified Dockerfile for client + server
├── src/
│   ├── client/           # HTML + TypeScript + Vite web client
│   └── server/           # Golang + CGO dedicated server
└── README.md             # You're here
```

## 🔧 Technologies

### 🖥️ Client (src/client)

- Framework: Vite (with HTML + TypeScript)
- NPM packages:
  - xash3d-fwgs
  - cs16-client
- Uses WebRTC to connect to the dedicated server

### 🎮 Server (src/server)

- Language: Go (Golang) + CGO
- Embedded: Xash3D FWGS (dedicated server)
- Network: Pion WebRTC library
- Serves static files for the client frontend

## 🚀 Getting Started

### 🎮 Game Content (Required)

To run the game, you must provide original **Counter-Strike 1.6 game files** from Steam. These must be packaged in a `valve.zip` file and mounted into the Docker container.

### 📦 `valve.zip` Structure

The `valve.zip` file must contain the following two directories from your Steam installation:

```plaintext
valve.zip
├── valve/
└── cstrike/
```

### ✅ Prerequisites

- Docker installed
- A public IP address (if hosting outside LAN)
- An open UDP port (e.g. 27018)

You must mount the file to the container path `/xashds/public/valve.zip`:

```shell
docker build --platform=linux/386 -t cs16-web-server .
docker run -d \
  -p 27016:27016 \
  -p <your-port>:<your-port>/udp \
  -e IP=<your-public-ip> \
  -e PORT=<your-port> \
  -v $(pwd)/valve.zip:/xashds/public/valve.zip \
  cs16-web-server \
  +map de_dust2 +maxplayers 14
```

Replace the placeholders:

- `<your-public-ip>` — your server's external IP
- `<your-port>` — open UDP port (e.g. 27018)

Then open `http://<your-server-ip>:27016` in your browser!

## 🌍 Environment Variables

| Variable               | Description                                            | Example             |
| ---------------------- | ------------------------------------------------------ | ------------------- |
| `IP`                   | Public IP address for WebRTC connection                | `123.45.67.89`      |
| `PORT`                 | UDP port for CS server (must be open)                  | `27018`             |
| `DISABLE_X_POWERED_BY` | Set to `true` to remove the `X-Powered-By` HTTP header | `true`              |
| `X_POWERED_BY_VALUE`   | Custom value for `X-Powered-By` header if not disabled | `CS 1.6 Web Server` |

## 🛠️ Customization

Client UI/UX:

- Modify files in src/client

Custom plugins:

- Mount a volume to /xashds inside the container
- Or copy plugin files into the Docker build context

## 📜 License

This project is licensed under the MIT License.
See the [LICENSE](./LICENSE) file for more information.
