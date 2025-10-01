//
//  OnboardingView.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-15.
//

import SwiftUI

struct OnboardingView: View {
    
    init(
        viewModel: OnboardingView.ViewModel,
        onCreateWalletDone: @escaping () -> Void
    ) {
        self.viewModel = viewModel
        self.onCreateWalletDone = onCreateWalletDone
    }
    
    var body: some View {
        VStack {
            Text("NotWallet")
                .font(.system(size: 24, weight: .bold, design: .rounded))
                .foregroundColor(.purple)
            Text("Crypto")
                .font(.system(size: 18, weight: .regular, design: .rounded))
                .foregroundColor(.purple)
            
            Divider().padding(.vertical, 4)
            
            Button(action: { viewModel.showCreate = true }) {
                Text("Create new")
                    .foregroundColor(.primary)
                    .padding(.vertical, 8)
                    .frame(height: 28)
                    .clipShape(Rectangle())
                    .contentShape(Rectangle())
            }
            .buttonStyle(.bordered)
            .frame(maxWidth: .infinity)
            
             Button(action: { viewModel.showImport = true }) {
                 Text("Import")
                 .foregroundColor(.primary)
                 .padding(.vertical, 8)
                 .frame(height: 28)
                 .clipShape(Rectangle())
                 .contentShape(Rectangle())
             }
             .buttonStyle(.bordered)
             .frame(maxWidth: .infinity)
        }
        .sheet(isPresented: $viewModel.showImport) {
            ImportWalletView(viewModel: .init(onImportWalletDone: onCreateWalletDone))
        }
        .sheet(isPresented: $viewModel.showCreate) {
            CreateWalletView(viewModel: .init(), onCreateWalletDone: onCreateWalletDone)
        }
    }
    
    // MARK: - Private

    @ObservedObject private var viewModel: ViewModel
    private let onCreateWalletDone: () -> Void
}


extension OnboardingView {
    final class ViewModel: ObservableObject {
        internal init(state: ViewState = ViewState.idle) {
            self.state = state
        }
        
        enum ViewState {
            case idle
            case loading
            case failed(Error)
            case loaded(OnboardingState)
        }
        
        enum OnboardingState {
            case done, new
        }
        
        @Published private(set) var state = ViewState.idle
        
        @Published var showImport = false
        @Published var showCreate = false
    }
}

#Preview {
    OnboardingView(viewModel: .init(), onCreateWalletDone: {})
}
