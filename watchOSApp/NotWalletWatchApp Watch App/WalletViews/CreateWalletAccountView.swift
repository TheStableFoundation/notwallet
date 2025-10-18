//
//  CreateWalletAccountView.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-15.
//

import Combine
import SwiftUI
import WalletKitV3

struct CreateWalletAccountView: View {

    init(viewModel: ViewModel) {
        self.viewModel = viewModel
    }

    var body: some View {
        switch viewModel.state {
        case .loading:
            ProgressView("Crunching numbers")
                .toolbar(content: {
                    /// Remove the (x) on watchOS 10
                    ToolbarItem(placement: .cancellationAction) {
                        Button("", action: {}).opacity(0.0).disabled(true)
                    }
                })
                .frame(alignment: .center)
        case .idle:
            // Render a clear color and start the loading process
            // when the view first appears, which should make the
            // view model transition into its loading state:
            Color.clear.onAppear(perform: {
                Task {
                    try await viewModel.initialize()
                }
            })
        case .failed(let error):
            Text(error.localizedDescription).frame(alignment: .center)
        case .loaded:
            ScrollView {
                VStack(spacing: 12) {
                    
                    Text("NotWallet Crypto is a non-custodial crypto wallet. I have written my seed phrase down somewhere and fully responsible of my funds.")
                        .font(.system(size: 18, weight: .regular, design: .rounded))
                        .multilineTextAlignment(.center)

                    Toggle("I understand", isOn: $viewModel.isAcceptedToc)
                        .font(.system(size: 18, weight: .regular, design: .rounded))
                        .foregroundColor(.red)
                        .onChange(of: viewModel.isAcceptedToc) { newValue in
                            // Your action here
                            print("Toggle changed to \(newValue)")
                            // You can call a function or trigger logic here
                            viewModel.isAcceptedToc = newValue
                        }

                    Button(action: { dismiss() }) {
                        Text("Continue")
                            .foregroundColor(viewModel.isAcceptedToc ? .green : .gray)
                            .padding(.vertical, 6)
                            .frame(height: 18)
                            .clipShape(Rectangle())
                            .contentShape(Rectangle())
                    }
                    .disabled(!viewModel.isAcceptedToc)
                    .buttonStyle(.bordered)
                    .frame(maxWidth: .infinity)
                }
                .padding()
                .toggleStyle(.automatic)
            }
            .toolbar(content: {
                /// Remove the (x) on watchOS 10
                ToolbarItem(placement: .cancellationAction) {
                    Button("", action: {}).opacity(0.0).disabled(true)
                }
            })
        }
    }

    // MARK: - Private
    
    @SwiftUI.Environment(\.dismiss) private var dismiss
    @ObservedObject private var viewModel: ViewModel
}

extension CreateWalletAccountView {
    final class ViewModel: ObservableObject {

        internal init(
            state: CreateWalletAccountView.ViewModel.ViewState = ViewState.idle,
            activeKeyPair: Wallet,
            isAcceptedToc: Bool = false
        ) {
            self.state = state
            self.activeKeyPair = activeKeyPair
            self.isAcceptedToc = isAcceptedToc
        }

        enum ViewState {
            case idle
            case loading
            case failed(Error)
            case loaded
        }

        @Published private(set) var state = ViewState.idle
        @Published var isAcceptedToc: Bool

        @MainActor
        func initialize() async throws {
            state = .loading
            
            let walletManagement = WalletManagement(activeWallet: activeKeyPair)
            
            _ = try walletManagement.deriveNewAccount()
            
            try await Task.sleep(nanoseconds: 2_000_000_000)

            state = .loaded
        }

        // MARK: - Private

        private let userDefault = UserDefaults.standard
        private(set) var activeKeyPair: Wallet
    }
}

#Preview {
    
    CreateWalletAccountView(
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
        ),
    )
    
}

#Preview {
    CreateWalletAccountView(
        viewModel: .init(
            state: .loaded,
            activeKeyPair: .init(
                id: "",
                username: "",
                name: "",
                account: 1,
                pubkey: "",
                privkey: "",
                seedId: ""
            )
        ),
    )
}
