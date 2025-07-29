#!/usr/bin/env bash

# Universal app (Intel and Apple chip)
#
cargo tauri build --bundles app --target universal-apple-darwin --config src-tauri/tauri.appstore.conf.json

# Apple chip only app
# Intel chip build system
# Add the target: `rustup target add aarch64-apple-darwin`
#
# rustup target add aarch64-apple-darwin
# tauri build --bundles app --target aarch64-apple-darwin --config src-tauri/tauri.appstore.conf.json

# Sign, Apple chip build system
#
xcrun productbuild --sign "<certificate signing identity>" --component "src-tauri/target/universal-apple-darwin/release/bundle/macos/$APPNAME.app" /Applications "$APPNAME.pkg"

# Sign, Intel chip build system
#
xcrun productbuild --sign "<certificate signing identity>" --component "src-tauri/target/aarch64-apple-darwin/release/bundle/macos/$APPNAME.app" /Applications "$APPNAME.pkg"

# Upload to App Store Connect
#
xcrun altool --upload-app --type macos --file "$APPNAME.pkg" --apiKey $APPLE_API_KEY_ID --apiIssuer $APPLE_API_ISSUER
