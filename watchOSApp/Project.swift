import ProjectDescription

let project = Project(
    name: "NotWallet",
    settings: .settings(
      configurations: [
        .debug(
          name: "Debug", 
          xcconfig: "./xcconfigs/NotWallet-Project.xcconfig"
        ),
        .release(
          name: "Release", 
          xcconfig: "./xcconfigs/NotWallet-Project.xcconfig"
        ),
      ]
    ),
    targets: [
        .target(
            name: "NotWalletWatchApp",
            destinations: .watchOS,
            product: .watch2App,
            bundleId: "xyz.notwallet.NotWalletWatch.watchkitapp",
            sources: "NotWallet Watch App/*",
            dependencies: [],
            settings: .settings(configurations: [
                .debug(name: "Debug", xcconfig: "./xcconfigs/NotWalletWatchApp.xcconfig"),
                .debug(name: "Release", xcconfig: "./xcconfigs/NotWalletWatchApp.xcconfig"),
            ])
        )
    ]
)
