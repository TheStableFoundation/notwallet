//
//  ContentView.swift
//  NotWallet Watch App
//
//  Created by Seto Elkahfi on 2025-07-14.
//

import Combine
import SwiftUI

struct ContentView: View {
    @State private var showTransactions = false
    @State private var showBachInfo = false

    var body: some View {
        VStack {
            Text("€BACH")
                .font(.system(size: 32, weight: .bold, design: .rounded))
                .foregroundColor(.purple)
                .onTapGesture {
                    showBachInfo = true
                }
            Text("Fixed supply: 12 million BACH")
                .font(.system(size: 12, weight: .regular, design: .rounded))
                .foregroundColor(.secondary)

            PriceGraphView(prices: [])
                .frame(height: 60)
                .padding(.vertical, 8)

            Divider()
            Text("My saldo")
                .font(.system(size: 18, weight: .semibold, design: .rounded))
                .foregroundColor(.secondary)
            Button(action: { showTransactions = true }) {
                MarqueeText(
                    text: "10.624434723489 BACH",
                    font: .system(size: 20, weight: .medium, design: .monospaced),
                    leftFade: 8, rightFade: 8, startDelay: 1.5
                )
                .foregroundColor(.primary)
                .padding(.bottom, 8)
                .frame(height: 28)
                .clipShape(Rectangle())
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .frame(maxWidth: .infinity)
        }
        .padding()
        .sheet(isPresented: $showTransactions) {
            TransactionListView()
        }
        .sheet(isPresented: $showBachInfo) {
            BachInfoView()
        }
    }
}

#Preview {
    ContentView()
}
