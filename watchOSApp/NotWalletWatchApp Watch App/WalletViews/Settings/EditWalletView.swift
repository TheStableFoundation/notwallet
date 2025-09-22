//
//  EditWalletView.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-19.
//

import Combine
import SwiftUI
import WalletKitV3

struct EditWalletView: View {

    internal init(viewModel: ViewModel) {
        self.viewModel = viewModel
    }

    var body: some View {
        NavigationStack {
            switch viewModel.state {
            case .idle:
                Color.clear.onAppear(perform: {
                    viewModel.initialize()
                })
            case .loading:
                ProgressView("Processing").frame(alignment: .center)
            case .failed:
                VStack(spacing: 8) {
                    Text("Something wrong").frame(alignment: .center).multilineTextAlignment(.center)
                    Button(action: { viewModel.initialize() }) {
                        HStack {
                            Image(systemName: "info.circle")
                            Text("Reload")
                        }
                    }
                }
                .padding(.horizontal, 8)
            case .loaded:
                VStack {
                    TextField("Max 6 characters", text: $viewModel.walletName)
                        .help("Max 6 characters")
                        .foregroundStyle(.secondary)
                        .padding(.horizontal)
                        .navigationTitle("Wallet Name")
                    
                    Button(action: {
                        viewModel.onContinue()
                        dismiss()
                    }) {
                        Text("Continue")
                            .foregroundColor(
                                viewModel.validWalletName() ? .green : .gray
                            )
                            .padding(.vertical, 6)
                            .frame(height: 18)
                            .clipShape(Rectangle())
                            .contentShape(Rectangle())
                    }
                    .disabled(!viewModel.validWalletName())
                    .buttonStyle(.bordered)
                    .frame(maxWidth: .infinity)
                }
            }
        }
    }

    // MARK: - Private
    
    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var viewModel: ViewModel
}

extension EditWalletView {
    final class ViewModel: ObservableObject {
        internal init(
            state: ViewState = ViewState.idle,
            activeKeyPair: Wallet,
            onEditWalletDone: @escaping (Wallet) -> Void
        ) {
            self.state = state
            self.activeKeyPair = activeKeyPair
            self.walletName = activeKeyPair.name
            self.onEditWalletDone = onEditWalletDone
            self.walletManagement = WalletManagement()
        }

        enum ViewState {
            case idle
            case loading
            case failed(Error)
            case loaded(Wallet)
        }

        
        @Published var walletName = ""
        
        func onAppear() {
            state = .idle
        }
        
        func initialize() {
            do {
                state = .loading
                let wallet = try walletManagement.getActiveKeypair()
                walletName = wallet.name
                state = .loaded(wallet)
            } catch {
                state = .failed(error)
            }
        }
        
        func validWalletName() -> Bool {
            walletName.count <= 15
        }
        
        func onContinue() {
            do {
                activeKeyPair.name = walletName
                try walletManagement.sync(activeWallet: activeKeyPair)
                onEditWalletDone(activeKeyPair)
            } catch {
                state = .failed(error)
            }
        }
        
        // MARK: - Private
        
        @Published private(set) var state = ViewState.idle
        private(set) var activeKeyPair: Wallet
        private let onEditWalletDone: (Wallet) -> Void
        private let walletManagement: WalletManagement
    }
}

#Preview {
    EditWalletView(
        viewModel: .init(
            activeKeyPair: .init(
                id: "",
                username: nil,
                name: "Tesmefffdf",
                account: 0,
                pubkey: "EjEYahpsv5AADKHdv32wknbq59tsqZPDZJgyMpZ5qhnV",
                privkey: "",
                seedId: ""
            ),
            onEditWalletDone: {_ in }
        )
    )
}
