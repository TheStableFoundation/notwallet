# Publish to Mac App Store

1. The Tauri config is `tauri.prod-macos-appstore.conf.json`
2. Every new update must have different version string. On iOS, it's enough to use different version code and Tauri handles that. But not for macOS, where you need to update the version string in the `Info.plist` file.
