//
//  ContentView.swift
//  NotWallet Watch App
//
//  Created by Seto Elkahfi on 2025-07-14.
//

import Combine
import SwiftUI
import WalletKitV3

struct ContentView: View {

    internal init(viewModel: ContentView.ViewModel) {
        self.viewModel = viewModel
    }

    var body: some View {
        switch viewModel.state {
        case .idle:
            // Render a clear color and start the loading process
            // when the view first appears, which should make the
            // view model transition into its loading state:
            Color.clear.onAppear(perform: {
                Task {
                    try await viewModel.initialize()
                }
            })
        case .loading:
            ProgressView("Checking wallet").frame(alignment: .center)
        case .failed(let error):
            Text(error.localizedDescription).frame(alignment: .center)
        case .loaded(let state):
            switch state {
            case .new:
                OnboardingView(
                    viewModel: .init(),
                    onCreateWalletDone: {
                        Task {
                            try await viewModel.onResetWallet()
                        }
                    }
                )
            case .done(let activeKeyPair):
                WalletView(
                    viewModel: .init(activeKeyPair: activeKeyPair),
                    onResetWallet: {
                        Task {
                            try await viewModel.onResetWallet()
                        }
                    }
                )
            }

        }
    }

    // MARK: - Private

    @ObservedObject private var viewModel: ViewModel
}

extension ContentView {
    final class ViewModel: ObservableObject {
        internal init(state: ContentView.ViewModel.ViewState = ViewState.idle) {
            self.state = state
        }

        enum ViewState {
            case idle
            case loading
            case failed(Error)
            case loaded(OnboardingState)
        }

        enum OnboardingState {
            case done(Wallet), new
        }

        @Published private(set) var state = ViewState.idle

        @Published var showImport = false
        @Published var showCreate = false

        @MainActor
        func initialize() async throws {
            state = .loading
            let dict = UserDefaults.standard.dictionaryRepresentation()
            for key in dict.keys {
                if let value = dict[key] {
                    print("\(key) = \(value)")
                }
            }

            try await Task.sleep(nanoseconds: 2_000_000_000)

            print("Checking for stored keyPairs with key: \(storage(key: .keyPairs))")
            if let data = userDefault.object(forKey: storage(key: .keyPairs)) as? Data {
                print("Found keyPairs data: \(data.count) bytes")
                do {
                    var activeKeyPair: Wallet!
                    let keyPairs = try JSONDecoder().decode([Wallet].self, from: data)
                    print("Successfully decoded keypairs: \(keyPairs.count)")

                    // Have wallet
                    print("Checking for active keyPair with key: \(storage(key: .activeKeyPair))")
                    if let activeData = userDefault.object(forKey: storage(key: .activeKeyPair))
                        as? Data
                    {
                        print("Found active keyPair data: \(activeData.count) bytes")
                        do {
                            let _activeKeyPair = try JSONDecoder().decode(
                                Wallet.self, from: activeData)
                            activeKeyPair = _activeKeyPair
                            print("Successfully decoded active keypair: \(_activeKeyPair)")
                        } catch {
                            print("Failed to decode active keyPair: \(error)")
                        }
                    } else {
                        print("No active keyPair found, selecting first one")
                        // Select the first one
                        if let keyPair = keyPairs.first {
                            activeKeyPair = keyPair
                            do {
                                let encoded = try JSONEncoder().encode(keyPair)
                                print("Encoded first keyPair: \(encoded.count) bytes")
                                userDefault.set(encoded, forKey: storage(key: .activeKeyPair))
                                userDefault.synchronize()
                                print("Set first keyPair as active")
                            } catch {
                                print("Failed to encode first keyPair: \(error)")
                            }
                        } else {
                            print("No keyPairs available to set as active")
                        }
                    }
                    state = .loaded(.done(activeKeyPair))
                } catch {
                    print("Failed to decode keyPairs from UserDefaults: \(error)")
                    state = .loaded(.new)
                }
            } else {
                print("No keyPairs data found in UserDefaults")
                state = .loaded(.new)
            }
        }
        
        @MainActor
        func onResetWallet() async throws {
            try await initialize()
        }

        // MARK: - Private

        private let userDefault = UserDefaults.standard
    }
}

#Preview {
    ContentView(viewModel: .init())
}
