#!/bin/bash
set -euo pipefail
# This container exclusively owns its display and editor profile.
rm -f /tmp/.X1-lock /tmp/.X11-unix/X1 /data/SingletonLock /data/SingletonSocket /data/SingletonCookie
Xtigervnc :1 -geometry 1600x1000 -depth 24 -SecurityTypes None -localhost -AlwaysShared -rfbport 5900 -nolisten tcp >/tmp/vnc.log 2>&1 &
for i in {1..50}; do xdpyinfo -display :1 >/dev/null 2>&1 && break; sleep .1; done
openbox >/tmp/openbox.log 2>&1 &
websockify --web=/usr/share/novnc 6080 localhost:5900 >/tmp/websockify.log 2>&1 &
export HERMESOFFICE_VPS=1
exec dbus-run-session -- /opt/office/node_modules/.bin/electron /opt/runtime/bootstrap.cjs --no-sandbox --disable-dev-shm-usage --remote-debugging-address=127.0.0.1 --remote-debugging-port=9222
