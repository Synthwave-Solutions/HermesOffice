FROM rust:1-bookworm AS rust
FROM node:22-bookworm AS build
COPY --from=rust /usr/local/cargo /usr/local/cargo
COPY --from=rust /usr/local/rustup /usr/local/rustup
ENV RUSTUP_HOME=/usr/local/rustup CARGO_HOME=/usr/local/cargo PATH=/usr/local/cargo/bin:$PATH CARGO_BUILD_JOBS=3
WORKDIR /opt/office
COPY . ./
RUN npm ci --no-audit --no-fund
RUN npm run build:all
RUN node packaging/pi/patch-native.cjs && ln -s /data/workspace-identity.json apps/shell/out/renderer/workspace-identity.json
FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends tigervnc-standalone-server xdotool openbox novnc websockify x11-utils libgtk-3-0 libnss3 libasound2 libgbm1 libdrm2 libxshmfence1 libx11-xcb1 libxss1 libxtst6 libatspi2.0-0 libsecret-1-0 libnotify4 fonts-dejavu fonts-liberation fonts-noto-core dbus-x11 ca-certificates tini && rm -rf /var/lib/apt/lists/*
COPY --from=build /opt/office /opt/office
COPY packaging/pi/start.sh packaging/pi/bootstrap.cjs packaging/pi/read-current.cjs /opt/runtime/
RUN chmod 755 /opt/runtime/start.sh && mkdir -p /data /documents && chown node:node /data /documents
USER node
WORKDIR /opt/office
ENV DISPLAY=:1 AI_OFFICE_USER_DATA=/data HERMESOFFICE_USER_DATA=/data HERMESOFFICE_LANG=en XLSX_SIDECAR_PATH=/opt/office/apps/sheets/native/xlsx-engine/target/release/xlsx-sidecar
ENTRYPOINT ["/usr/bin/tini","--","/opt/runtime/start.sh"]
