//
//  QRCodeView.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-19.
//

import Combine
import QRCode
import SwiftUI
import WalletKitV3

struct QRCodeView: View {

    internal init(viewModel: ViewModel) {
        self.viewModel = viewModel
    }

    var body: some View {
        switch viewModel.state {
        case .loading:
            ProgressView().frame(alignment: .center)
        case .idle:
            Color.clear.onAppear(perform: {
                viewModel.onAppear()
            })
        case .loaded(let pubkey):
            VStack {
                QRCodeViewUI(
                    content: pubkey,
                    foregroundColor: UIColor.purple.cgColor,
                    backgroundColor: UIColor.darkGray.cgColor,
                    onPixelShape: QRCode.PixelShape.RoundedPath(
                        cornerRadiusFraction: 0.7, hasInnerCorners: true),
                    eyeShape: QRCode.EyeShape.RoundedRect()
                )
            }
            .padding()
        case .failed(_):
            Text("N/A")
                .font(.system(size: 32, weight: .bold, design: .rounded))
                .foregroundColor(.purple)
        }
    }

    // MARK: - Private

    @ObservedObject private var viewModel: ViewModel

}

extension QRCodeView {
    final class ViewModel: ObservableObject {
        internal init(state: State = State.idle, activeKeyPair: Wallet) {
            self.state = state
            self.activeKeyPair = activeKeyPair
        }

        enum State {
            case idle
            case loading
            case failed(Error)
            case loaded(String)
        }

        func onAppear() {
            state = .loaded(activeKeyPair.pubkey)
        }
        

        // MARK: - Private
        
        @Published private(set) var state = State.idle
        private(set) var activeKeyPair: Wallet
        private let userDefault = UserDefaults.standard
    }
}


#Preview {
    QRCodeView(
        viewModel: .init(
            activeKeyPair: .init(
                id: "",
                username: nil,
                name: "Test",
                account: 0,
                pubkey: "HRXrnm5d3UmL5sm9tkrKVShyx2kZBDe1U8Kumpit1VKR",
                privkey: "",
                seedId: "sdfsdf"
            )
        )
    )
}

