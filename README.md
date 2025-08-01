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

Special thanks to [yohimik](https://github.com/yohimik) for his outstanding work on the [Xash3D-FWGS Emscripten Web Port](https://github.com/yohimik/webxash3d-fwgs) and the [Xash3D-FWGS CGO Wrapper](https://github.com/yohimik/goxash3d-fwgs), which made this possible!

## 🚀 Getting Started

### 🎮 Game Files (Required)

To run the game, you must provide the original **Counter-Strike 1.6 game files** from Steam. These must be packaged and mounted into the Docker container.

There are multiple ways to aquire the game files, but one of the easiest is to use `steamcmd`.

```shell
docker run --rm -it \
  -v $(pwd)/gamefiles:/gamefiles \
  cm2network/steamcmd \
  ./steamcmd.sh +force_install_dir /gamefiles +login anonymous +app_update 90 +quit
```

After the download finished, you need to package the files into a `valve.zip` file, that must contain the following two directories:

```plaintext
valve.zip
├── valve/
└── cstrike/
```

To create the `valve.zip` file, run the following command in your `gamefiles` directory:

```shell
zip -r valve.zip valve cstrike
```

### 🐳 Run the container

#### docker compose (recommended)

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
    volumes:
      - "./valve.zip:/xashds/public/valve.zip"
    ports:
      - "27016:27016"
      - "27018:27018/tcp"
      - "27018:27018/udp"
```

#### docker cli

```shell
docker run -d \
  -name=cs16-web-server \
  -e IP=127.0.0.1 \
  -e PORT=27018 \
  -p 27016:27016 \
  -p 27018:27018/tcp \
  -p 27018:27018/udp \
  -v $(pwd)/valve.zip:/xashds/public/valve.zip \
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
