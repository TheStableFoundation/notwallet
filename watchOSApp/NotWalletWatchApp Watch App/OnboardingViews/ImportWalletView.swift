//
//  ImportWalletView.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-15.
//


import Combine
import SwiftUI
import WalletKitV3

struct ImportWalletView: View {
    
    internal init(viewModel: ViewModel) {
        self.viewModel = viewModel
    }
    
    
    var body: some View {
        switch viewModel.state {
        case .loading:
            ProgressView("Importing wallet")
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
            Color.clear.onAppear(perform: {viewModel.onAppear()})
        case .failed(let error):
            VStack {
                Text(error.localizedDescription).frame(alignment: .center)
            }
        case .loaded:
            ScrollView {
                VStack(spacing: 8) {
                    Text("Seed Phrase")
                        .font(.system(size: 24, weight: .bold, design: .rounded))
                        .foregroundColor(.purple)
                    TextField("Your 12-word seed phrase.", text: $viewModel.seedPhrase)

                    Divider()
                    
                    Button(action: {
                        Task {
                            try await viewModel.importWallet()
                        }
                            
                    }) {
                        Text("Import")
                            .foregroundColor(viewModel.validSeedPhare() ? .green : .gray)
                            .padding(.vertical, 8)
                            .frame(height: 28)
                            .clipShape(Rectangle())
                            .contentShape(Rectangle())
                    }
                    .disabled(!viewModel.validSeedPhare())
                    .buttonStyle(.bordered)
                    .frame(maxWidth: .infinity)
                    
                    
                }
                .toggleStyle(.automatic)
            }
        case .imported(let response):
            ScrollView {
                VStack(spacing: 8) {
                    Text("Your Seed Phrase")
                        .font(.system(size: 24, weight: .bold, design: .rounded))
                        .foregroundColor(.purple)
                    
                    Text(response.seed.phrase)
                        .font(.system(size: 18, weight: .regular, design: .rounded))
                        .foregroundColor(.primary)

                    Divider()
                    
                    Text("I have written them down somewhere and fully responsible of my funds.")
                        .font(.system(size: 12, weight: .regular, design: .rounded))
                        .foregroundColor(.red)

                    Toggle("I understand", isOn: $viewModel.isAcceptedToc)
                        .font(.system(size: 12, weight: .regular, design: .rounded))
                        .onChange(of: viewModel.isAcceptedToc) { newValue in
                            // Your action here
                            print("Toggle changed to \(newValue)")
                            // You can call a function or trigger logic here
                            viewModel.isAcceptedToc = newValue
                        }

                    Button(action: {
                        viewModel.done()
                    }) {
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
    
    @ObservedObject private var viewModel: ViewModel
}


extension ImportWalletView {
    final class ViewModel: ObservableObject {

        internal init(
            state: ViewState = ViewState.idle,
            onImportWalletDone: @escaping () -> Void
        ) {
            self.state = state
            self.onImportWalletDone = onImportWalletDone
        }

        enum ViewState {
            case idle
            case loading
            case failed(Error)
            case loaded
            case imported(CreateWalletResponse)
        }

        @Published private(set) var state = ViewState.idle
        @Published var seedPhrase: String = ""
        @Published var isAcceptedToc: Bool = false

      
        func onAppear() {
            state = .loaded
        }
        
        func done() {
            onImportWalletDone()
        }
        
        func validSeedPhare() -> Bool {
            guard !seedPhrase.isEmpty else { return false }
            
            // Split by whitespace and filter out empty strings
            let words = seedPhrase
                .split { $0.isWhitespace }
                .filter { !$0.isEmpty }
            return words.count == 12
        }
        
        @MainActor
        func importWallet() async throws {
            do {
                state = .loading
                
                print("Will import wallet")
                
                let wallet = try WalletKitV3.importWallet(mnemonicPhrase: seedPhrase)
                
                try await saveCreateWalletResponse(userDefault: userDefault, wallet: wallet)
                
                state = .imported(wallet)
            } catch {
                state = .failed(error)
            }
        }

        // MARK: - Private

        private let userDefault = UserDefaults.standard
        private let onImportWalletDone: () -> Void
    }
}


#Preview {
    ImportWalletView(viewModel: .init(onImportWalletDone: {}))
}
