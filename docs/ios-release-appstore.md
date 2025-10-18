# iOS App Store Release Guide

This guide covers the steps to release the [NotWallet Crypto Solana non-custodial crypto wallet](https://apps.apple.com/se/app/notwallet-crypto/id6749607570?l=en-GB) iOS app to the App Store.

## Init iOS project

Tauri uses Xcode to build iOS apps. Follow [Tauri guide for iOS app development](https://v2.tauri.app/start/prerequisites/#ios), [iOS app code signing](https://v2.tauri.app/distribute/sign/ios/), and [AppStore distribution guide](https://v2.tauri.app/distribute/app-store/#ios).

We have two Tauri config files for debug and production apps. First step is to add your Apple developer account team ID in the main `tauri.conf.json` file.

```json
"bundle": {
  "iOS": {
    "minimumSystemVersion": "13.0",
    "developmentTeam": "your_team_id"
  }
}
```

Then generate the Xcode project.

```bash
$ rm -rf src-tauri/gen/apple
$ cargo tauri ios init -c src-tauri/tauri.prod-ios-appstore.conf.json
```

Then move the files in the `src-tauri/gen-override/apple` folder to the `src-tauri/gen/apple` folder, if any.

## Generate App Icons

Icon for iOS AppStore app should not have alpha channel. If you have an existing icon, right click and choose **Get Info** to see if you have an alpha channel. If you do, convert it to a PNG without an alpha channel. The easiest way is to use the Preview app, choose File -> Export, and uncheck the Alpha channel option.

Below are the instructions.

<details>

<summary>iOS App Icons Requirements</summary>

![iOS App Icon Alpha Channel](assets/screenshots/alpha-channel.png)
![iOS App Icon Alpha Channel check](assets/screenshots/alpha-channel-check.png)
![iOS App Icon Alpha Channel get info](assets/screenshots/get-info.png)

</details>

Generate the icons using the `cargo tauri icon` command from the script.

```bash
$ pnpm gim
```

## Production Keys and Credentials

There are several keys and credentials that you need for the app to be fully functional in the AppStore. Follow the [release keys and credentials for NotWallet Crypto guide](docs/release-keys-and-credentials.md).

## Build

Build the project for iOS AppStore.

```bash
$ cargo tauri ios build --export-method app-store-connect -c src-tauri/tauri.prod-ios-appstore.conf.json
```

## Upload

Upload the .ipa file using the following command:

```bash
$ xcrun altool --upload-app --type ios --file src-tauri/gen/apple/build/arm64/NotWallet.ipa --apiKey your_api_key --apiIssuer your_api_issuer
```
