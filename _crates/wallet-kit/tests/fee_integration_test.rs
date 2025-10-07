//! Integration tests for the wallet fee system
//!
//! These tests verify that the 0.25% fee system works correctly for both SOL and token transfers.

use {
    smbcloud_wallet_constants::constants::{
        LAMPORTS_PER_SOL, SEMITONE_PER_BACH, THE_STABLE_FOUNDATION_TREASURY_ADDRESS,
    },
    smbcloud_wallet_kit::fee::{
        FeeBreakdown, FeeConfig, TreasuryFeeManager, DEFAULT_FEE_PERCENTAGE,
    },
};

#[test]
fn test_fee_breakdown_accuracy() {
    let test_cases = vec![
        (1.0, 0.0025, 0.9975),
        (10.0, 0.025, 9.975),
        (100.0, 0.25, 99.75),
        (1000.0, 2.5, 997.5),
        (0.001, 0.0000025, 0.0009975),
    ];

    for (amount, expected_fee, expected_net) in test_cases {
        let breakdown = FeeBreakdown::new(amount, "SOL".to_string())
            .expect(&format!("Failed to create breakdown for amount {}", amount));

        assert_eq!(
            breakdown.fee_amount, expected_fee,
            "Fee amount mismatch for {} SOL",
            amount
        );
        assert_eq!(
            breakdown.net_amount, expected_net,
            "Net amount mismatch for {} SOL",
            amount
        );
        assert_eq!(
            breakdown.fee_percentage, DEFAULT_FEE_PERCENTAGE,
            "Fee percentage mismatch"
        );

        // Verify that fee + net equals original
        let sum = breakdown.fee_amount + breakdown.net_amount;
        assert!(
            (sum - amount).abs() < f64::EPSILON,
            "Fee + net != original for amount {}",
            amount
        );
    }
}

#[test]
fn test_lamports_conversion_accuracy() {
    let amount = 1.0; // 1 SOL
    let breakdown = FeeBreakdown::new(amount, "SOL".to_string()).unwrap();

    // 1 SOL = 1,000,000,000 lamports
    // Fee: 0.0025 SOL = 2,500,000 lamports
    // Net: 0.9975 SOL = 997,500,000 lamports
    assert_eq!(breakdown.fee_lamports(), 2_500_000);
    assert_eq!(breakdown.net_lamports(), 997_500_000);
    assert_eq!(breakdown.total_lamports(), 1_000_000_000);
}

#[test]
fn test_token_units_conversion_accuracy() {
    let amount = 1.0; // 1 BACH
    let breakdown = FeeBreakdown::new(amount, "BACH".to_string()).unwrap();

    // 1 BACH = 1,000,000,000 semitones
    // Fee: 0.0025 BACH = 2,500,000 semitones
    // Net: 0.9975 BACH = 997,500,000 semitones
    assert_eq!(breakdown.fee_token_units(SEMITONE_PER_BACH), 2_500_000);
    assert_eq!(breakdown.net_token_units(SEMITONE_PER_BACH), 997_500_000);
    assert_eq!(
        breakdown.total_token_units(SEMITONE_PER_BACH),
        1_000_000_000
    );
}

#[test]
fn test_treasury_manager_functionality() {
    // Test treasury public key retrieval
    let treasury_pubkey = TreasuryFeeManager::treasury_pubkey().unwrap();
    assert_eq!(
        treasury_pubkey.to_string(),
        THE_STABLE_FOUNDATION_TREASURY_ADDRESS
    );

    // Test fee calculation
    let fees = TreasuryFeeManager::calculate_fees(100.0, "SOL".to_string()).unwrap();
    assert_eq!(fees.fee_amount, 0.25);
    assert_eq!(fees.net_amount, 99.75);

    // Test fee validation
    assert!(TreasuryFeeManager::validate_fee_amount(0.25, 100.0).is_ok());
    assert!(TreasuryFeeManager::validate_fee_amount(1.0, 100.0).is_err());
}

#[test]
fn test_fee_config_functionality() {
    // Test default configuration
    let default_config = FeeConfig::default();
    assert_eq!(
        default_config.standard_fee_percentage,
        DEFAULT_FEE_PERCENTAGE
    );
    assert_eq!(
        default_config.treasury_address,
        THE_STABLE_FOUNDATION_TREASURY_ADDRESS
    );
    assert!(default_config.fees_enabled);

    // Test custom configuration
    let custom_config = FeeConfig::new(
        0.01, // 1% fee
        0.1,  // Min 0.1 SOL
        THE_STABLE_FOUNDATION_TREASURY_ADDRESS.to_string(),
        true,
    )
    .unwrap();

    let breakdown = custom_config
        .calculate_breakdown(100.0, "SOL".to_string())
        .unwrap();
    assert_eq!(breakdown.fee_percentage, 0.01);
    assert_eq!(breakdown.fee_amount, 1.0);
    assert_eq!(breakdown.net_amount, 99.0);

    // Test disabled fees
    let mut disabled_config = FeeConfig::default();
    disabled_config.fees_enabled = false;

    let no_fee_breakdown = disabled_config
        .calculate_breakdown(100.0, "SOL".to_string())
        .unwrap();
    assert_eq!(no_fee_breakdown.fee_amount, 0.0);
    assert_eq!(no_fee_breakdown.net_amount, 100.0);
}

#[test]
fn test_minimum_transaction_thresholds() {
    let config = FeeConfig::default();

    // Test amounts that should pass
    assert!(config.meets_minimum(1.0));
    assert!(config.meets_minimum(0.001));
    assert!(config.meets_minimum(0.000001));

    // Test amounts that should fail
    assert!(!config.meets_minimum(0.0000001));
    assert!(!config.meets_minimum(0.0));
    assert!(!config.meets_minimum(-1.0));
}

#[test]
fn test_edge_cases() {
    // Test very small amounts
    let small_breakdown = FeeBreakdown::new(0.000001, "SOL".to_string()).unwrap();
    assert!(small_breakdown.fee_amount > 0.0);
    assert!(small_breakdown.net_amount > 0.0);

    // Test large amounts
    let large_breakdown = FeeBreakdown::new(1_000_000.0, "SOL".to_string()).unwrap();
    assert_eq!(large_breakdown.fee_amount, 2500.0);
    assert_eq!(large_breakdown.net_amount, 997_500.0);

    // Test zero amount should fail
    assert!(FeeBreakdown::new(0.0, "SOL".to_string()).is_err());

    // Test negative amount should fail
    assert!(FeeBreakdown::new(-1.0, "SOL".to_string()).is_err());
}

#[test]
fn test_fee_instruction_creation() {
    use solana_sdk::pubkey::Pubkey;
    use std::str::FromStr;

    let from_pubkey = Pubkey::from_str("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM").unwrap();
    let fee_lamports = 25_000_000; // 0.025 SOL in lamports

    // Test SOL fee instruction creation
    let sol_fee_instruction =
        TreasuryFeeManager::create_sol_fee_instruction(&from_pubkey, fee_lamports);
    assert!(sol_fee_instruction.is_ok());

    let instruction = sol_fee_instruction.unwrap();
    assert_eq!(instruction.accounts.len(), 2); // From and To accounts

    // Verify the treasury is the recipient
    let treasury_pubkey = TreasuryFeeManager::treasury_pubkey().unwrap();
    assert_eq!(instruction.accounts[1].pubkey, treasury_pubkey);
}

#[test]
fn test_precision_and_rounding() {
    // Test that fee calculations maintain precision
    let test_amounts = vec![
        0.000001,   // Very small
        0.123456,   // Decimal
        1.999999,   // Near integer
        1000.00001, // Large with small decimal
    ];

    for amount in test_amounts {
        let breakdown = FeeBreakdown::new(amount, "SOL".to_string()).unwrap();

        // Verify precision is maintained
        let calculated_total = breakdown.fee_amount + breakdown.net_amount;
        let precision_error = (calculated_total - amount).abs();

        assert!(
            precision_error < 1e-10,
            "Precision error too large for amount {}: error = {}",
            amount,
            precision_error
        );

        // Verify fee percentage is correct
        let calculated_percentage = breakdown.fee_amount / amount;
        let percentage_error = (calculated_percentage - DEFAULT_FEE_PERCENTAGE).abs();

        assert!(
            percentage_error < 1e-10,
            "Fee percentage error for amount {}: expected {}, got {}",
            amount,
            DEFAULT_FEE_PERCENTAGE,
            calculated_percentage
        );
    }
}

#[test]
fn test_multi_currency_support() {
    let currencies = vec!["SOL", "BACH", "USDC", "BONK"];
    let amount = 100.0;

    for currency in currencies {
        let breakdown = FeeBreakdown::new(amount, currency.to_string()).unwrap();

        assert_eq!(breakdown.currency, currency);
        assert_eq!(breakdown.original_amount, amount);
        assert_eq!(breakdown.fee_amount, amount * DEFAULT_FEE_PERCENTAGE);
        assert_eq!(
            breakdown.net_amount,
            amount * (1.0 - DEFAULT_FEE_PERCENTAGE)
        );
    }
}

#[test]
fn test_fee_summary_formatting() {
    let breakdown = FeeBreakdown::new(100.0, "SOL".to_string()).unwrap();
    let summary = breakdown.format_summary();

    // Verify summary contains all expected information
    assert!(summary.contains("100")); // Original amount
    assert!(summary.contains("0.25")); // Fee amount
    assert!(summary.contains("99.75")); // Net amount
    assert!(summary.contains("SOL")); // Currency
    assert!(summary.contains("0.25%")); // Fee percentage
    assert!(summary.contains("Amount:")); // Labels
    assert!(summary.contains("Fee:"));
    assert!(summary.contains("Net:"));
}

#[test]
fn test_concurrent_fee_calculations() {
    use std::sync::Arc;
    use std::thread;

    let amounts = Arc::new(vec![1.0, 10.0, 100.0, 1000.0]);
    let mut handles = vec![];

    // Test concurrent fee calculations
    for i in 0..4 {
        let amounts_clone = Arc::clone(&amounts);
        let handle = thread::spawn(move || {
            let amount = amounts_clone[i];
            let breakdown = FeeBreakdown::new(amount, "SOL".to_string()).unwrap();

            // Verify calculations are consistent
            assert_eq!(breakdown.fee_amount, amount * DEFAULT_FEE_PERCENTAGE);
            assert_eq!(
                breakdown.net_amount,
                amount * (1.0 - DEFAULT_FEE_PERCENTAGE)
            );

            breakdown
        });
        handles.push(handle);
    }

    // Wait for all threads and verify results
    for handle in handles {
        let breakdown = handle.join().unwrap();
        assert!(breakdown.fee_amount > 0.0);
        assert!(breakdown.net_amount > 0.0);
    }
}

#[test]
fn test_error_conditions() {
    // Test invalid fee percentages
    assert!(FeeConfig::new(
        -0.1,
        0.0,
        THE_STABLE_FOUNDATION_TREASURY_ADDRESS.to_string(),
        true
    )
    .is_err());
    assert!(FeeConfig::new(
        1.1,
        0.0,
        THE_STABLE_FOUNDATION_TREASURY_ADDRESS.to_string(),
        true
    )
    .is_err());

    // Test invalid treasury address
    assert!(FeeConfig::new(0.0025, 0.0, "invalid_address".to_string(), true).is_err());

    // Test invalid amounts
    assert!(FeeBreakdown::new(-1.0, "SOL".to_string()).is_err());
    assert!(FeeBreakdown::new(0.0, "SOL".to_string()).is_err());

    // Test very small amounts that might cause precision issues
    let very_small = 1e-15;
    assert!(FeeBreakdown::new(very_small, "SOL".to_string()).is_err());
}

#[test]
fn test_fee_system_constants() {
    // Verify that our fee percentage constant is exactly 0.25%
    assert_eq!(DEFAULT_FEE_PERCENTAGE, 0.0025);

    // Verify treasury address format
    assert_eq!(THE_STABLE_FOUNDATION_TREASURY_ADDRESS.len(), 44); // Base58 Solana address length
    assert!(THE_STABLE_FOUNDATION_TREASURY_ADDRESS
        .chars()
        .all(|c| c.is_ascii_alphanumeric()));

    // Verify conversion constants
    assert_eq!(LAMPORTS_PER_SOL, 1_000_000_000.0);
    assert_eq!(SEMITONE_PER_BACH, 1_000_000_000.0);
}

#[test]
fn test_realistic_transaction_scenarios() {
    // Simulate real-world transaction scenarios
    let scenarios = vec![
        ("Coffee payment", 0.005, "SOL"),
        ("Small trade", 1.5, "SOL"),
        ("Medium investment", 100.0, "BACH"),
        ("Large transfer", 5000.0, "USDC"),
        ("Whale transaction", 100000.0, "SOL"),
    ];

    for (description, amount, currency) in scenarios {
        let breakdown = FeeBreakdown::new(amount, currency.to_string()).unwrap();

        println!("Scenario: {}", description);
        println!("  Amount: {} {}", amount, currency);
        println!("  Fee: {} {}", breakdown.fee_amount, currency);
        println!("  Net: {} {}", breakdown.net_amount, currency);

        // Verify fee is always 0.25%
        let calculated_percentage = breakdown.fee_amount / breakdown.original_amount;
        assert!((calculated_percentage - DEFAULT_FEE_PERCENTAGE).abs() < 1e-10);

        // Verify amounts are positive
        assert!(breakdown.fee_amount > 0.0);
        assert!(breakdown.net_amount > 0.0);
        assert!(breakdown.net_amount < breakdown.original_amount);
    }
}

#[test]
fn test_treasury_account_operations() {
    // Test treasury public key operations
    let treasury_pubkey = TreasuryFeeManager::treasury_pubkey();
    assert!(treasury_pubkey.is_ok());

    let pubkey = treasury_pubkey.unwrap();
    assert_eq!(pubkey.to_string(), THE_STABLE_FOUNDATION_TREASURY_ADDRESS);

    // Test that treasury pubkey is valid Solana address
    assert!(pubkey.is_on_curve()); // Ensure it's a valid point on the Ed25519 curve
}

#[test]
fn test_fee_validation_edge_cases() {
    // Test fee validation with various edge cases
    let test_cases = vec![
        (100.0, 0.25, true),  // Correct fee
        (100.0, 0.24, false), // Slightly low fee
        (100.0, 0.26, false), // Slightly high fee
        (100.0, 1.0, false),  // Way too high fee
        (100.0, 0.0, false),  // No fee
    ];

    for (original_amount, fee_amount, should_pass) in test_cases {
        let result = TreasuryFeeManager::validate_fee_amount(fee_amount, original_amount);

        if should_pass {
            assert!(
                result.is_ok(),
                "Fee validation should pass for fee {} on amount {}",
                fee_amount,
                original_amount
            );
        } else {
            assert!(
                result.is_err(),
                "Fee validation should fail for fee {} on amount {}",
                fee_amount,
                original_amount
            );
        }
    }
}

#[test]
fn test_fee_config_edge_cases() {
    // Test minimum transaction amount validation
    let config = FeeConfig::default();

    assert!(config.meets_minimum(1.0));
    assert!(config.meets_minimum(0.000001));
    assert!(!config.meets_minimum(0.0000001));
    assert!(!config.meets_minimum(0.0));

    // Test treasury pubkey validation in config
    let treasury_pubkey = config.treasury_pubkey();
    assert!(treasury_pubkey.is_ok());
}

#[test]
fn test_custom_fee_percentages() {
    let test_percentages = vec![0.001, 0.005, 0.01, 0.025, 0.05];
    let amount = 1000.0;

    for percentage in test_percentages {
        let breakdown =
            FeeBreakdown::with_custom_percentage(amount, percentage, "TEST".to_string()).unwrap();

        let expected_fee = amount * percentage;
        let expected_net = amount - expected_fee;

        assert_eq!(breakdown.fee_amount, expected_fee);
        assert_eq!(breakdown.net_amount, expected_net);
        assert_eq!(breakdown.fee_percentage, percentage);
    }
}

#[test]
fn test_format_summary_consistency() {
    let breakdown = FeeBreakdown::new(123.456789, "BACH".to_string()).unwrap();
    let summary = breakdown.format_summary();

    // Summary should include all key information
    assert!(summary.contains("123.456789")); // Original amount
    assert!(summary.contains("BACH")); // Currency
    assert!(summary.contains("0.25%")); // Fee percentage

    // Fee and net amounts should be present (exact values may vary due to floating point)
    assert!(summary.contains(&breakdown.fee_amount.to_string()));
    assert!(summary.contains(&breakdown.net_amount.to_string()));
}

#[test]
fn test_instruction_creation_scenarios() {
    use solana_sdk::pubkey::Pubkey;
    use std::str::FromStr;

    let from_pubkey = Pubkey::from_str("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM").unwrap();
    let token_program = Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap();
    let token_account1 = Pubkey::from_str("4fYNw3dojWmQ4dXtSGE9epjRGy9HFayjHVLLAGn8bW7Y").unwrap();
    let token_account2 = Pubkey::from_str("7rQ9CgpYe2c6nNPVTsKLXaAb2L8p4y7t3UvRe9jdFxGh").unwrap();

    // Test SOL fee instruction
    let sol_instruction = TreasuryFeeManager::create_sol_fee_instruction(&from_pubkey, 1000000);
    assert!(sol_instruction.is_ok());

    // Test token fee instruction
    let token_instruction = TreasuryFeeManager::create_token_fee_instruction(
        &token_program,
        &token_account1,
        &token_account2,
        &from_pubkey,
        1000000,
    );
    assert!(token_instruction.is_ok());
}

#[test]
fn test_fee_calculation_consistency_across_calls() {
    let amount = 99.99;
    let currency = "SOL";

    // Calculate fee multiple times
    let breakdown1 = FeeBreakdown::new(amount, currency.to_string()).unwrap();
    let breakdown2 = FeeBreakdown::new(amount, currency.to_string()).unwrap();
    let breakdown3 = TreasuryFeeManager::calculate_fees(amount, currency.to_string()).unwrap();

    // All calculations should be identical
    assert_eq!(breakdown1.fee_amount, breakdown2.fee_amount);
    assert_eq!(breakdown1.net_amount, breakdown2.net_amount);
    assert_eq!(breakdown1.fee_amount, breakdown3.fee_amount);
    assert_eq!(breakdown1.net_amount, breakdown3.net_amount);

    // Verify specific values
    let expected_fee = amount * DEFAULT_FEE_PERCENTAGE;
    let expected_net = amount - expected_fee;

    assert_eq!(breakdown1.fee_amount, expected_fee);
    assert_eq!(breakdown1.net_amount, expected_net);
}

#[test]
fn test_fee_system_documentation_examples() {
    // Test all examples from the documentation to ensure they're accurate

    // Example 1: Basic 100 SOL transaction
    let breakdown = FeeBreakdown::new(100.0, "SOL".to_string()).unwrap();
    assert_eq!(breakdown.fee_amount, 0.25);
    assert_eq!(breakdown.net_amount, 99.75);

    // Example 2: Token conversion
    let bach_breakdown = FeeBreakdown::new(1.0, "BACH".to_string()).unwrap();
    assert_eq!(bach_breakdown.fee_token_units(SEMITONE_PER_BACH), 2_500_000);
    assert_eq!(
        bach_breakdown.net_token_units(SEMITONE_PER_BACH),
        997_500_000
    );

    // Example 3: Configuration
    let config = FeeConfig::default();
    let config_breakdown = config
        .calculate_breakdown(100.0, "SOL".to_string())
        .unwrap();
    assert_eq!(config_breakdown.fee_amount, 0.25);
}
