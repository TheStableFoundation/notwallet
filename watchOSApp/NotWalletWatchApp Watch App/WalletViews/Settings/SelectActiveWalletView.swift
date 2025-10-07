//
//  SelectActiveWalletView.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-19.
//

import Combine
import SwiftUI
import WalletKitV3

struct SelectActiveWalletView: View {

    internal init(viewModel: ViewModel) {
        self.viewModel = viewModel
    }
    var body: some View {
        VStack {
            switch viewModel.state {
            case .loading:
                ProgressView().frame(alignment: .center)
            case .idle:
                Color.clear.onAppear(perform: {
                    viewModel.fetchKeyPairs()
                })
            case .failed:
                Text("Failed")
            case .loaded:
                VStack {
                    Picker("Choose your wallet", selection: $viewModel.selectedKeyPair) {
                        ForEach(viewModel.keyPairs, id: \.self) {
                            Text($0.initial())
                                .tag($0.id)
                                .font(.system(size: 18, weight: .medium, design: .rounded))
                        }
                    }
                    .pickerStyle(.inline)
                    
                    Button(action: {
                        viewModel.onContinue()
                        dismiss()
                    }) {
                        Text("Continue")
                            .foregroundColor(
                                viewModel.activeKeyPairHasChanged() ? .green : .gray
                            )
                            .padding(.vertical, 6)
                            .frame(height: 18)
                            .clipShape(Rectangle())
                            .contentShape(Rectangle())
                    }
                    .disabled(!viewModel.activeKeyPairHasChanged())
                    .buttonStyle(.bordered)
                    .frame(maxWidth: .infinity)
                }
            }
        }
    }

    // MARK: - Private
    
    @SwiftUI.Environment(\.dismiss) private var dismiss
    @ObservedObject private var viewModel: ViewModel
}

extension SelectActiveWalletView {
    final class ViewModel: ObservableObject {
        internal init(
            state: ViewState = ViewState.idle,
            activeKeyPair: Wallet,
            onSelectWalletDone: @escaping (Wallet) -> Void
        ) {
            self.state = state
            self.activeKeyPair = activeKeyPair
            self.onSelectWalletDone = onSelectWalletDone
            self.selectedKeyPair = activeKeyPair
        }

        @Published var keyPairs: [Wallet] = []
        @Published var selectedKeyPair: Wallet
        
        enum ViewState {
            case idle
            case loading
            case failed(Error)
            case loaded
        }
        
        func fetchKeyPairs() {
            do {
                state = .loading
                keyPairs = try WalletManagement(
                    activeWallet: activeKeyPair
                ).allKeyPairs()
                state = .loaded
            } catch {
                state = .failed(error)
            }
        }
        
        func onContinue() {
            do {
                try WalletManagement(
                    activeWallet: selectedKeyPair
                ).sync(activeWallet: selectedKeyPair)
                
                onSelectWalletDone(selectedKeyPair)
            } catch {
                state = .failed(error)
            }
        }
        
        func activeKeyPairHasChanged() -> Bool {
            activeKeyPair.id != selectedKeyPair.id
        }

        @Published private(set) var state = ViewState.idle
        private(set) var activeKeyPair: Wallet
        private let onSelectWalletDone: (Wallet) -> Void
    }
}

#Preview {
    SelectActiveWalletView(
        viewModel: .init(
            state: .loaded,
            activeKeyPair: .init(
                id: "",
                username: nil,
                name: "",
                account: 0,
                pubkey: "EjEYahpsv5AADKHdv32wknbq59tsqZPDZJgyMpZ5qhnV",
                privkey: "",
                seedId: ""
            ),
            onSelectWalletDone: {_ in}
        ),
    )
}
