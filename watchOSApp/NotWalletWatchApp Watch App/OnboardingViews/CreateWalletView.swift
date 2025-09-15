//
//  CreateWalletView.swift
//  NotWalletWatchApp
//
//  Created by Seto Elkahfi on 2025-09-15.
//

import Combine
import SwiftUI
import WalletKitV3

struct CreateWalletView: View {

    init(viewModel: ViewModel) {
        self.viewModel = viewModel
    }

    var body: some View {
        switch viewModel.state {
        case .loading:
            ProgressView("Crunching numbers...")
                .toolbar(content: {
                    /// Remove the (x) on watchOS 10
                    ToolbarItem(placement: .cancellationAction) {
                       Button("", action: {}).opacity(0.0).disabled(true)
                    }
                 })
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
            Text(error.localizedDescription)
        case .loaded(let walletResponse):
            ScrollView {
                VStack(spacing: 12) {
                    Text("Seed Phrase")
                        .font(.system(size: 24, weight: .bold, design: .rounded))
                        .foregroundColor(.purple)
                    Text(walletResponse.seed.phrase)
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

                    Button(action: { viewModel.shouldContinue = true }) {
                        Text("Continue")
                            .foregroundColor(.primary)
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
                .padding()
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

extension CreateWalletView {
    final class ViewModel: ObservableObject {
        
        internal init(state: CreateWalletView.ViewModel.ViewState = ViewState.idle, isAcceptedToc: Bool = false, shouldContinue: Bool = false) {
            self.state = state
            self.isAcceptedToc = isAcceptedToc
            self.shouldContinue = shouldContinue
        }
        
        
        enum ViewState {
            case idle
            case loading
            case failed(Error)
            case loaded(CreateWalletResponse)
        }

        @Published private(set) var state = ViewState.idle
        @Published var isAcceptedToc: Bool
        @Published var shouldContinue: Bool

        @MainActor
        func initialize() async throws {
            state = .loading
            let wallet = try createWallet()

            // Append wallet
            var keyPairs: [Wallet] =
                if let data = userDefault.object(forKey: storage(key: .keyPairs)) as? Data,
                    let keyPairs = try? JSONDecoder().decode([Wallet].self, from: data)
                {
                    keyPairs
                } else { [] }
            keyPairs.append(wallet.wallet)
            if let encoded = try? JSONEncoder().encode(keyPairs) {
                userDefault.set(encoded, forKey: storage(key: .keyPairs))
            }

            // Append seed to stored seeds
            var seeds: [Seed] =
                if let data = userDefault.object(forKey: storage(key: .seeds)) as? Data,
                    let seeds = try? JSONDecoder().decode([Seed].self, from: data)
                {
                    seeds
                } else { [] }
            seeds.append(wallet.seed)

            if let encoded = try? JSONEncoder().encode(seeds) {
                userDefault.set(encoded, forKey: storage(key: .seeds))
            }
            
            try await Task.sleep(nanoseconds: 3_000_000_000)
            
            state = .loaded(wallet)
        }

        // MARK: - Private

        private let userDefault = UserDefaults.standard
    }
}

extension Wallet: Codable {
    enum CodingKeys: String, CodingKey {
        case id, username, name, account, pubkey, privkey, seedId
    }

    public init(from decoder: any Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let id = try container.decode(String.self, forKey: .id)
        let username = try container.decode(String.self, forKey: .username)
        let name = try container.decode(String.self, forKey: .name)
        let account = try container.decode(UInt32.self, forKey: .account)
        let pubkey = try container.decode(String.self, forKey: .pubkey)
        let privkey = try container.decode(String.self, forKey: .privkey)
        let seedId = try container.decode(String.self, forKey: .seedId)
        self.init(
            id: id, username: username, name: name, account: account, pubkey: pubkey,
            privkey: privkey, seedId: seedId)
    }

    public func encode(to encoder: any Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(username, forKey: .username)
        try container.encode(name, forKey: .name)
        try container.encode(account, forKey: .account)
        try container.encode(pubkey, forKey: .pubkey)
        try container.encode(privkey, forKey: .privkey)
        try container.encode(seedId, forKey: .seedId)
    }
}

extension Seed: Codable {
    enum CodingKeys: String, CodingKey {
        case id, phrase, seedType
    }
    public init(from decoder: any Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let id = try container.decode(String.self, forKey: .id)
        let phrase = try container.decode(String.self, forKey: .phrase)
        let seedType = try container.decode(SeedType.self, forKey: .seedType)
        self.init(id: id, phrase: phrase, seedType: seedType)
    }
    public func encode(to encoder: any Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(phrase, forKey: .phrase)
        try container.encode(seedType, forKey: .seedType)
    }
}

extension SeedType: Codable {

    private enum CodingKeys: String, CodingKey {
        case type
        case timestamp
    }

    private enum CaseType: String, Codable {
        case created
        case imported
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let type = try container.decode(CaseType.self, forKey: .type)
        let timestamp = try container.decode(String.self, forKey: .timestamp)
        switch type {
        case .created:
            self = .created(timestamp: timestamp)
        case .imported:
            self = .imported(timestamp: timestamp)
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .created(let timestamp):
            try container.encode(CaseType.created, forKey: .type)
            try container.encode(timestamp, forKey: .timestamp)
        case .imported(let timestamp):
            try container.encode(CaseType.imported, forKey: .type)
            try container.encode(timestamp, forKey: .timestamp)
        }
    }
}

#Preview {
    CreateWalletView(viewModel: .init())
}
