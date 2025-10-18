//
//  WalletSeedPhraseView.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-15.
//

import Combine
import SwiftUI
import WalletKitV3

struct WalletSeedPhraseView: View {

    init(viewModel: ViewModel) {
        self.viewModel = viewModel
    }

    var body: some View {
        switch viewModel.state {
        case .loading:
            ProgressView("Loading...")
                .toolbar(content: {
                    /// Remove the (x) on watchOS 10
                    ToolbarItem(placement: .cancellationAction) {
                        Button("", action: {}).opacity(0.0).disabled(true)
                    }
                })
                .frame(alignment: .center)
        case .idle:
            Color.clear.onAppear(perform: {
                try? viewModel.initialize()
            })
        case .failed(let error):
            Text(error.localizedDescription).frame(alignment: .center)
        case .loaded(let seed):
            ScrollView {
                VStack(spacing: 8) {
                    Text("Seed Phrase")
                        .font(.system(size: 24, weight: .bold, design: .rounded))
                        .foregroundColor(.purple)
                    if viewModel.isAcceptedToc {
                        Text(seed.phrase)
                            .font(.system(size: 18, weight: .regular, design: .rounded))
                            .padding(.horizontal, 8)
                            .foregroundColor(.primary)
                            .multilineTextAlignment(.center)
                    } else {
                        Text("Please accept the term.")
                            .font(.system(size: 18, weight: .regular, design: .rounded))
                            .foregroundColor(.primary)
                    }

                    Divider()

                    Text(
                        "I am fully responsible of the secrecy of the seed phrase and thus my funds."
                    )
                    .font(.system(size: 16, weight: .regular, design: .rounded))
                    .foregroundColor(.red)
                    .multilineTextAlignment(.center)

                    Toggle("I understand", isOn: $viewModel.isAcceptedToc)
                        .font(.system(size: 16, weight: .regular, design: .rounded))
                        .onChange(of: viewModel.isAcceptedToc) { newValue in
                            // Your action here
                            print("Toggle changed to \(newValue)")
                            // You can call a function or trigger logic here
                            viewModel.isAcceptedToc = newValue
                        }
                }
                .toggleStyle(.automatic)
            }
        }
    }

    // MARK: - Private
    @ObservedObject private var viewModel: ViewModel
}

extension WalletSeedPhraseView {
    final class ViewModel: ObservableObject {

        internal init(
            state: ViewModel.ViewState = ViewState.idle,
            isAcceptedToc: Bool = false,
            activeKeyPair: Wallet
        ) {
            self.state = state
            self.isAcceptedToc = isAcceptedToc
            self.activeKeyPair = activeKeyPair
        }

        enum ViewState {
            case idle
            case loading
            case failed(Error)
            case loaded(Seed)
        }

        @Published var isAcceptedToc: Bool

        func initialize() throws {
            state = .loading
            let seed = try WalletManagement(
                activeWallet: activeKeyPair
            ).activeSeed()
            state = .loaded(seed)
        }

        // MARK: - Private
        @Published private(set) var state = ViewState.idle
        private(set) var activeKeyPair: Wallet
    }
}

#Preview("Loading") {

    WalletSeedPhraseView(
        viewModel: .init(
            activeKeyPair: .init(
                id: "",
                username: "",
                name: "",
                account: 1,
                pubkey: "",
                privkey: "",
                seedId: ""
            )
        )
    )

}

#Preview("Loaded") {
    WalletSeedPhraseView(
        viewModel: .init(
            state: .loaded(
                .init(
                    id: "uuid",
                    phrase: "Seed phrase",
                    seedType: .created(timestamp: "timestamp")
                )
            ),
            activeKeyPair: .init(
                id: "",
                username: "",
                name: "",
                account: 1,
                pubkey: "",
                privkey: "",
                seedId: ""
            )
        )
    )
}
