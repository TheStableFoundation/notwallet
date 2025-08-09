//! Fee System Demo
//!
//! This example demonstrates how the 0.25% fee system works for both SOL and token transfers.
//! The fee is automatically deducted from each transaction and sent to The Stable Foundation Treasury.

use wallet_kit::fee::{FeeBreakdown, FeeConfig};
use wallet_kit::transactions::{estimate_sol_transaction_cost, estimate_token_transaction_cost};

fn main() {
    println!("🏦 Wallet Transaction Fee System Demo");
    println!("=====================================\n");

    // Initialize logging
    env_logger::init();

    // Demo 1: Basic Fee Calculation
    demo_basic_fee_calculation();

    // Demo 2: SOL Transaction Fees
    demo_sol_transaction_fees();

    // Demo 3: Token Transaction Fees
    demo_token_transaction_fees();

    // Demo 4: Fee Configuration
    demo_fee_configuration();

    // Demo 5: Cost Estimation
    tokio::runtime::Runtime::new()
        .unwrap()
        .block_on(demo_cost_estimation());

    println!("\n✅ Demo completed successfully!");
}

fn demo_basic_fee_calculation() {
    println!("📊 1. Basic Fee Calculation");
    println!("---------------------------");

    let test_amounts = vec![1.0, 10.0, 100.0, 1000.0, 0.001];

    for amount in test_amounts {
        match FeeBreakdown::new(amount, "SOL".to_string()) {
            Ok(breakdown) => {
                println!("Amount: {} SOL", amount);
                println!("  Fee: {} SOL (0.25%)", breakdown.fee_amount);
                println!("  Net: {} SOL", breakdown.net_amount);
                println!("  Summary: {}", breakdown.format_summary());
                println!();
            }
            Err(e) => {
                println!("❌ Error calculating fee for {} SOL: {}", amount, e);
            }
        }
    }
}

fn demo_sol_transaction_fees() {
    println!("💰 2. SOL Transaction Fee Examples");
    println!("----------------------------------");

    let scenarios = vec![
        ("Small transfer", 1.0),
        ("Medium transfer", 50.0),
        ("Large transfer", 1000.0),
        ("Micro transfer", 0.01),
    ];

    for (description, amount) in scenarios {
        let breakdown = FeeBreakdown::new(amount, "SOL".to_string()).unwrap();

        println!("Scenario: {}", description);
        println!("  Original: {} SOL", breakdown.original_amount);
        println!(
            "  Treasury Fee: {} SOL ({} lamports)",
            breakdown.fee_amount,
            breakdown.fee_lamports()
        );
        println!(
            "  Recipient Gets: {} SOL ({} lamports)",
            breakdown.net_amount,
            breakdown.net_lamports()
        );
        println!("  Total Cost: {} lamports", breakdown.total_lamports());
        println!();
    }
}

fn demo_token_transaction_fees() {
    println!("🪙 3. Token Transaction Fee Examples");
    println!("------------------------------------");

    let scenarios = vec![
        ("BACH transfer", 100.0, "BACH"),
        ("USDC transfer", 50.0, "USDC"),
        ("Small BACH", 1.0, "BACH"),
    ];

    for (description, amount, token) in scenarios {
        let breakdown = FeeBreakdown::new(amount, token.to_string()).unwrap();

        println!("Scenario: {}", description);
        println!("  Original: {} {}", breakdown.original_amount, token);
        println!("  Treasury Fee: {} {}", breakdown.fee_amount, token);
        println!("  Recipient Gets: {} {}", breakdown.net_amount, token);

        if token == "BACH" {
            // Show semitone conversion for BACH
            let fee_semitones = breakdown.fee_token_units(1_000_000_000.0); // SEMITONE_PER_BACH
            let net_semitones = breakdown.net_token_units(1_000_000_000.0);
            println!("  Fee in semitones: {}", fee_semitones);
            println!("  Net in semitones: {}", net_semitones);
        }
        println!();
    }
}

fn demo_fee_configuration() {
    println!("⚙️  4. Fee Configuration Examples");
    println!("---------------------------------");

    // Default configuration
    let default_config = FeeConfig::default();
    println!("Default Configuration:");
    println!(
        "  Fee Percentage: {}%",
        default_config.standard_fee_percentage * 100.0
    );
    println!("  Treasury: {}", default_config.treasury_address);
    println!("  Fees Enabled: {}", default_config.fees_enabled);
    println!();

    // Custom configuration
    match FeeConfig::new(
        0.005, // 0.5% fee
        0.1,   // Min 0.1 SOL
        "3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3".to_string(),
        true,
    ) {
        Ok(custom_config) => {
            println!("Custom Configuration (0.5% fee):");
            let breakdown = custom_config
                .calculate_breakdown(100.0, "SOL".to_string())
                .unwrap();
            println!("  100 SOL transaction breakdown:");
            println!("    Fee: {} SOL", breakdown.fee_amount);
            println!("    Net: {} SOL", breakdown.net_amount);
            println!();
        }
        Err(e) => {
            println!("❌ Error creating custom config: {}", e);
        }
    }

    // Disabled fees configuration
    let mut disabled_config = FeeConfig::default();
    disabled_config.fees_enabled = false;

    let no_fee_breakdown = disabled_config
        .calculate_breakdown(100.0, "SOL".to_string())
        .unwrap();
    println!("Disabled Fees Configuration:");
    println!("  100 SOL transaction with fees disabled:");
    println!("    Fee: {} SOL", no_fee_breakdown.fee_amount);
    println!("    Net: {} SOL", no_fee_breakdown.net_amount);
    println!();
}

async fn demo_cost_estimation() {
    println!("🧮 5. Transaction Cost Estimation");
    println!("----------------------------------");

    // Mock RPC URL for demonstration (won't actually connect)
    let rpc_url = "https://api.mainnet-beta.solana.com".to_string();

    // SOL transaction cost estimation
    println!("SOL Transaction Cost Estimation:");
    match estimate_sol_transaction_cost(rpc_url.clone(), 10.0).await {
        Ok(estimate) => {
            println!("  Transaction: 10.0 SOL");
            println!("  Fee Amount: {} SOL", estimate.fee_amount);
            println!("  Net Amount: {} SOL", estimate.net_amount);
            println!("  Network Fee: {} lamports", estimate.network_fee_lamports);
            println!("  Total Cost: {} lamports", estimate.total_cost_lamports);
        }
        Err(e) => {
            println!(
                "  ⚠️  Note: Cost estimation requires network connection: {}",
                e
            );
        }
    }
    println!();

    // Token transaction cost estimation
    println!("Token Transaction Cost Estimation:");
    let from_address = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM";
    let to_address = "3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3";
    let bach_token = "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf";

    match estimate_token_transaction_cost(
        rpc_url,
        from_address.to_string(),
        to_address.to_string(),
        bach_token.to_string(),
        100.0,
    )
    .await
    {
        Ok(estimate) => {
            println!("  Transaction: 100.0 BACH");
            println!("  Fee Amount: {} BACH", estimate.fee_amount);
            println!("  Net Amount: {} BACH", estimate.net_amount);
            println!("  Network Fee: {} lamports", estimate.network_fee_lamports);
            println!(
                "  Account Creation Cost: {} lamports",
                estimate.account_creation_cost_lamports
            );
            println!(
                "  Total SOL Cost: {} lamports",
                estimate.total_cost_lamports
            );
            if let Some(token_cost) = estimate.total_cost_tokens {
                println!("  Total Token Cost: {} semitones", token_cost);
            }
            println!(
                "  Requires Treasury Account: {}",
                estimate.requires_treasury_account_creation
            );
        }
        Err(e) => {
            println!(
                "  ⚠️  Note: Cost estimation requires network connection: {}",
                e
            );
        }
    }
    println!();
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_demo_fee_calculations() {
        // Test that our demo calculations are correct
        let breakdown = FeeBreakdown::new(100.0, "SOL".to_string()).unwrap();

        assert_eq!(breakdown.fee_amount, 0.25);
        assert_eq!(breakdown.net_amount, 99.75);
        assert_eq!(breakdown.fee_percentage, 0.0025);
    }

    #[test]
    fn test_treasury_pubkey_accessible() {
        // Ensure we can access the treasury public key
        let treasury = TreasuryFeeManager::treasury_pubkey();
        assert!(treasury.is_ok());
    }

    #[test]
    fn test_fee_config_creation() {
        let config = FeeConfig::default();
        assert!(config.fees_enabled);
        assert_eq!(config.standard_fee_percentage, 0.0025);
    }
}

/// Helper function to demonstrate fee calculation for various scenarios
#[allow(dead_code)]
fn demonstrate_fee_scenarios() {
    println!("💡 Fee Calculation Scenarios");
    println!("============================");

    let scenarios = vec![
        ("Minimum viable transaction", 0.000001),
        ("Coffee purchase equivalent", 0.005),
        ("Small trade", 1.0),
        ("Medium trade", 100.0),
        ("Large trade", 10000.0),
        ("Whale transaction", 1000000.0),
    ];

    for (description, amount) in scenarios {
        match FeeBreakdown::new(amount, "SOL".to_string()) {
            Ok(breakdown) => {
                println!("{}: {} SOL", description, amount);
                println!("  💸 Fee to treasury: {} SOL", breakdown.fee_amount);
                println!("  💰 Net to recipient: {} SOL", breakdown.net_amount);
                println!("  📊 Effective rate: {}%", breakdown.fee_percentage * 100.0);
            }
            Err(e) => {
                println!("❌ {}: Cannot process {} SOL - {}", description, amount, e);
            }
        }
        println!();
    }
}

/// Demonstrates the treasury fee instruction creation
#[allow(dead_code)]
fn demonstrate_instruction_creation() {
    println!("🔧 Transaction Instruction Creation");
    println!("===================================");

    // Example wallet addresses
    let from_wallet = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM";
    let to_wallet = "3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3";

    println!("Transaction Details:");
    println!("  From: {}", from_wallet);
    println!("  To: {}", to_wallet);
    println!(
        "  Treasury: {}",
        wallet_kit::constants::THE_STABLE_FOUNDATION_TREASURY_ADDRESS
    );
    println!();

    // Show how SOL transaction would work
    let amount = 10.0;
    let fee_breakdown = FeeBreakdown::new(amount, "SOL".to_string()).unwrap();

    println!("SOL Transaction ({}):)", amount);
    println!(
        "  1️⃣ Transfer {} SOL to treasury (fee)",
        fee_breakdown.fee_amount
    );
    println!(
        "  2️⃣ Transfer {} SOL to recipient (net)",
        fee_breakdown.net_amount
    );
    println!("  Total instructions: 2");
    println!();

    // Show how token transaction would work
    println!("Token Transaction ({} BACH):", amount);
    println!(
        "  1️⃣ Transfer {} BACH to treasury (fee)",
        fee_breakdown.fee_amount
    );
    println!(
        "  2️⃣ Transfer {} BACH to recipient (net)",
        fee_breakdown.net_amount
    );
    println!("  Additional: Create token accounts if needed");
    println!("  Total instructions: 2-6 (depending on account creation needs)");
    println!();
}
