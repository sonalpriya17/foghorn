#! /usr/bin/env bash
bun build --compile --target=bun-linux-x64-v1.1.4 --outfile ./target/foghorn-linux-x64 ./index.js
bun build --compile --target=bun-linux-arm64-v1.1.4 --outfile ./target/foghorn-linux-arm64 ./index.js
bun build --compile --target=bun-windows-x64-v1.1.4 --outfile ./target/foghorn-windows-x64 ./index.js
bun build --compile --target=bun-mac-arm64-v1.1.4 --outfile ./target/foghorn-mac-arm64 ./index.js
bun build --compile --target=bun-mac-x64-v1.1.4 --outfile ./target/foghorn-mac-x64 ./index.js