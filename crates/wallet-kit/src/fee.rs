use {
    constants::constants::{LAMPORTS_PER_SOL, THE_STABLE_FOUNDATION_TREASURY_ADDRESS},
    log::info,
    serde::{Deserialize, Serialize},
    solana_address::Address,
    solana_instruction::Instruction,
    solana_sdk::{pubkey::Pubkey, system_instruction},
    solana_system_interface::instruction,
    spl_token::instruction as token_instruction,
    std::str::FromStr,
    thiserror::Error,
};

#[derive(Error, Debug)]
pub enum FeeError {
    #[error("Invalid fee percentage: {0}")]
    InvalidFeePercentage(f64),

    #[error("Amount too small for fee calculation: {0}")]
    AmountTooSmall(f64),

    #[error("Fee calculation overflow")]
    CalculationOverflow,

    #[error("Treasury address error: {0}")]
    TreasuryAddressError(String),
}

/// Default fee percentage for all transactions (0.25%)
pub const DEFAULT_FEE_PERCENTAGE: f64 = 0.0025;

/// Minimum transaction amount to avoid dust fees
pub const MIN_TRANSACTION_AMOUNT: f64 = 0.000001;

/// Fee breakdown for a transaction
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FeeBreakdown {
    /// Original transaction amount
    pub original_amount: f64,
    /// Fee amount (0.25% of original)
    pub fee_amount: f64,
    /// Net amount after fee deduction
    pub net_amount: f64,
    /// Fee percentage used
    pub fee_percentage: f64,
    /// Currency/token symbol
    pub currency: String,
}

impl FeeBreakdown {
    /// Create a new fee breakdown for the given amount
    pub fn new(amount: f64, currency: String) -> Result<Self, FeeError> {
        Self::with_custom_percentage(amount, DEFAULT_FEE_PERCENTAGE, currency)
    }

    /// Create a fee breakdown with a custom fee percentage
    pub fn with_custom_percentage(
        amount: f64,
        fee_percentage: f64,
        currency: String,
    ) -> Result<Self, FeeError> {
        // Validate inputs
        if amount <= 0.0 {
            return Err(FeeError::AmountTooSmall(amount));
        }

        if fee_percentage < 0.0 || fee_percentage > 1.0 {
            return Err(FeeError::InvalidFeePercentage(fee_percentage));
        }

        if amount < MIN_TRANSACTION_AMOUNT {
            return Err(FeeError::AmountTooSmall(amount));
        }

        // Calculate fee and net amount
        let fee_amount = amount * fee_percentage;
        let net_amount = amount - fee_amount;

        // Check for calculation overflow/underflow
        if fee_amount.is_infinite() || net_amount.is_infinite() || net_amount <= 0.0 {
            return Err(FeeError::CalculationOverflow);
        }

        Ok(FeeBreakdown {
            original_amount: amount,
            fee_amount,
            net_amount,
            fee_percentage,
            currency,
        })
    }

    /// Convert fee amount to lamports (for SOL transactions)
    pub fn fee_lamports(&self) -> u64 {
        (self.fee_amount * LAMPORTS_PER_SOL) as u64
    }

    /// Convert net amount to lamports (for SOL transactions)
    pub fn net_lamports(&self) -> u64 {
        (self.net_amount * LAMPORTS_PER_SOL) as u64
    }

    /// Convert fee amount to token units (for token transactions)
    pub fn fee_token_units(&self, decimals_multiplier: f64) -> u64 {
        (self.fee_amount * decimals_multiplier) as u64
    }

    /// Convert net amount to token units (for token transactions)
    pub fn net_token_units(&self, decimals_multiplier: f64) -> u64 {
        (self.net_amount * decimals_multiplier) as u64
    }

    /// Get total lamports needed for SOL transaction (including fee)
    pub fn total_lamports(&self) -> u64 {
        self.fee_lamports() + self.net_lamports()
    }

    /// Get total token units needed for token transaction (including fee)
    pub fn total_token_units(&self, decimals_multiplier: f64) -> u64 {
        self.fee_token_units(decimals_multiplier) + self.net_token_units(decimals_multiplier)
    }

    /// Format fee breakdown as human-readable string
    pub fn format_summary(&self) -> String {
        format!(
            "Amount: {} {}, Fee: {} {} ({}%), Net: {} {}",
            self.original_amount,
            self.currency,
            self.fee_amount,
            self.currency,
            self.fee_percentage * 100.0,
            self.net_amount,
            self.currency
        )
    }
}

/// Treasury fee management utilities
pub struct TreasuryFeeManager;

impl TreasuryFeeManager {
    /// Get the treasury wallet public key
    pub fn treasury_pubkey() -> Result<Pubkey, FeeError> {
        Pubkey::from_str(THE_STABLE_FOUNDATION_TREASURY_ADDRESS).map_err(|e| {
            FeeError::TreasuryAddressError(format!(
                "Invalid treasury address {}: {}",
                THE_STABLE_FOUNDATION_TREASURY_ADDRESS, e
            ))
        })
    }

    /// Get the treasury wallet public key
    pub fn treasury_pubkey_v3() -> Result<Address, FeeError> {
        Address::from_str(THE_STABLE_FOUNDATION_TREASURY_ADDRESS).map_err(|e| {
            FeeError::TreasuryAddressError(format!(
                "Invalid treasury address {}: {}",
                THE_STABLE_FOUNDATION_TREASURY_ADDRESS, e
            ))
        })
    }

    /// Calculate fee breakdown for a given amount
    pub fn calculate_fees(amount: f64, currency: String) -> Result<FeeBreakdown, FeeError> {
        FeeBreakdown::new(amount, currency)
    }

    /// Create SOL fee transfer instruction
    pub fn create_sol_fee_instruction(
        from: &Pubkey,
        fee_lamports: u64,
    ) -> Result<solana_sdk::instruction::Instruction, FeeError> {
        let treasury = Self::treasury_pubkey()?;
        Ok(system_instruction::transfer(from, &treasury, fee_lamports))
    }

    /// Create SOL fee transfer instruction v3
    pub fn create_sol_fee_instruction_v3(
        from: &Address,
        fee_lamports: u64,
    ) -> Result<Instruction, FeeError> {
        let treasury = Self::treasury_pubkey_v3()?;
        Ok(instruction::transfer(from, &treasury, fee_lamports))
    }
    /// Create token fee transfer instruction
    pub fn create_token_fee_instruction(
        token_program: &Pubkey,
        from_token_account: &Pubkey,
        treasury_token_account: &Pubkey,
        from_wallet: &Pubkey,
        fee_token_units: u64,
    ) -> Result<solana_sdk::instruction::Instruction, FeeError> {
        token_instruction::transfer(
            token_program,
            from_token_account,
            treasury_token_account,
            from_wallet,
            &[from_wallet],
            fee_token_units,
        )
        .map_err(|e| FeeError::TreasuryAddressError(format!("Token transfer error: {}", e)))
    }

    /// Validate that a fee amount is reasonable
    pub fn validate_fee_amount(fee_amount: f64, original_amount: f64) -> Result<(), FeeError> {
        let calculated_percentage = fee_amount / original_amount;

        // Allow some floating point precision tolerance
        if (calculated_percentage - DEFAULT_FEE_PERCENTAGE).abs() > 0.000001 {
            return Err(FeeError::InvalidFeePercentage(calculated_percentage));
        }

        Ok(())
    }

    /// Log fee collection for audit purposes
    pub fn log_fee_collection(
        transaction_signature: &str,
        fee_breakdown: &FeeBreakdown,
        transaction_type: &str,
    ) {
        info!(
            "Fee collected - Signature: {} | Type: {} | Original: {} {} | Fee: {} {} | Net: {} {} | Treasury: {}",
            transaction_signature,
            transaction_type,
            fee_breakdown.original_amount,
            fee_breakdown.currency,
            fee_breakdown.fee_amount,
            fee_breakdown.currency,
            fee_breakdown.net_amount,
            fee_breakdown.currency,
            THE_STABLE_FOUNDATION_TREASURY_ADDRESS
        );
    }
}

/// Fee configuration for different transaction types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FeeConfig {
    /// Standard transaction fee percentage
    pub standard_fee_percentage: f64,
    /// Minimum transaction amount
    pub min_transaction_amount: f64,
    /// Treasury address
    pub treasury_address: String,
    /// Whether fees are enabled
    pub fees_enabled: bool,
}

impl Default for FeeConfig {
    fn default() -> Self {
        Self {
            standard_fee_percentage: DEFAULT_FEE_PERCENTAGE,
            min_transaction_amount: MIN_TRANSACTION_AMOUNT,
            treasury_address: THE_STABLE_FOUNDATION_TREASURY_ADDRESS.to_string(),
            fees_enabled: true,
        }
    }
}

impl FeeConfig {
    /// Create a new fee configuration
    pub fn new(
        fee_percentage: f64,
        min_amount: f64,
        treasury_address: String,
        enabled: bool,
    ) -> Result<Self, FeeError> {
        if fee_percentage < 0.0 || fee_percentage > 1.0 {
            return Err(FeeError::InvalidFeePercentage(fee_percentage));
        }

        if min_amount < 0.0 {
            return Err(FeeError::AmountTooSmall(min_amount));
        }

        // Validate treasury address
        Pubkey::from_str(&treasury_address).map_err(|e| {
            FeeError::TreasuryAddressError(format!("Invalid treasury address: {}", e))
        })?;

        Ok(Self {
            standard_fee_percentage: fee_percentage,
            min_transaction_amount: min_amount,
            treasury_address,
            fees_enabled: enabled,
        })
    }

    /// Calculate fee breakdown using this configuration
    pub fn calculate_breakdown(
        &self,
        amount: f64,
        currency: String,
    ) -> Result<FeeBreakdown, FeeError> {
        if !self.fees_enabled {
            return Ok(FeeBreakdown {
                original_amount: amount,
                fee_amount: 0.0,
                net_amount: amount,
                fee_percentage: 0.0,
                currency,
            });
        }

        FeeBreakdown::with_custom_percentage(amount, self.standard_fee_percentage, currency)
    }

    /// Check if amount meets minimum threshold
    pub fn meets_minimum(&self, amount: f64) -> bool {
        amount >= self.min_transaction_amount
    }

    /// Get treasury public key
    pub fn treasury_pubkey(&self) -> Result<Pubkey, FeeError> {
        Pubkey::from_str(&self.treasury_address)
            .map_err(|e| FeeError::TreasuryAddressError(format!("Invalid treasury address: {}", e)))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use constants::constants::SEMITONE_PER_BACH;

    #[test]
    fn test_fee_breakdown_creation() {
        let breakdown = FeeBreakdown::new(100.0, "SOL".to_string()).unwrap();
        assert_eq!(breakdown.original_amount, 100.0);
        assert_eq!(breakdown.fee_amount, 0.25);
        assert_eq!(breakdown.net_amount, 99.75);
        assert_eq!(breakdown.fee_percentage, DEFAULT_FEE_PERCENTAGE);
    }

    #[test]
    fn test_fee_breakdown_custom_percentage() {
        let breakdown =
            FeeBreakdown::with_custom_percentage(100.0, 0.01, "BACH".to_string()).unwrap();
        assert_eq!(breakdown.fee_amount, 1.0);
        assert_eq!(breakdown.net_amount, 99.0);
        assert_eq!(breakdown.fee_percentage, 0.01);
    }

    #[test]
    fn test_fee_breakdown_invalid_amount() {
        assert!(FeeBreakdown::new(0.0, "SOL".to_string()).is_err());
        assert!(FeeBreakdown::new(-1.0, "SOL".to_string()).is_err());
    }

    #[test]
    fn test_fee_breakdown_invalid_percentage() {
        assert!(FeeBreakdown::with_custom_percentage(100.0, -0.1, "SOL".to_string()).is_err());
        assert!(FeeBreakdown::with_custom_percentage(100.0, 1.1, "SOL".to_string()).is_err());
    }

    #[test]
    fn test_lamports_conversion() {
        let breakdown = FeeBreakdown::new(1.0, "SOL".to_string()).unwrap();
        assert_eq!(breakdown.fee_lamports(), 2500000); // 0.0025 SOL in lamports
        assert_eq!(breakdown.net_lamports(), 997500000); // 0.9975 SOL in lamports
        assert_eq!(breakdown.total_lamports(), 1000000000); // 1 SOL in lamports
    }

    #[test]
    fn test_token_units_conversion() {
        let breakdown = FeeBreakdown::new(1.0, "BACH".to_string()).unwrap();
        let fee_units = breakdown.fee_token_units(SEMITONE_PER_BACH);
        let net_units = breakdown.net_token_units(SEMITONE_PER_BACH);

        assert_eq!(fee_units, 2500000); // 0.0025 BACH in semitones
        assert_eq!(net_units, 997500000); // 0.9975 BACH in semitones
    }

    #[test]
    fn test_treasury_manager() {
        let treasury = TreasuryFeeManager::treasury_pubkey().unwrap();
        assert_eq!(treasury.to_string(), THE_STABLE_FOUNDATION_TREASURY_ADDRESS);

        let fees = TreasuryFeeManager::calculate_fees(100.0, "SOL".to_string()).unwrap();
        assert_eq!(fees.fee_amount, 0.25);
    }

    #[test]
    fn test_fee_config_default() {
        let config = FeeConfig::default();
        assert_eq!(config.standard_fee_percentage, DEFAULT_FEE_PERCENTAGE);
        assert_eq!(
            config.treasury_address,
            THE_STABLE_FOUNDATION_TREASURY_ADDRESS
        );
        assert!(config.fees_enabled);
    }

    #[test]
    fn test_fee_config_custom() {
        let config = FeeConfig::new(
            0.01,
            0.1,
            THE_STABLE_FOUNDATION_TREASURY_ADDRESS.to_string(),
            true,
        )
        .unwrap();

        let breakdown = config
            .calculate_breakdown(100.0, "USDC".to_string())
            .unwrap();
        assert_eq!(breakdown.fee_percentage, 0.01);
        assert_eq!(breakdown.fee_amount, 1.0);
    }

    #[test]
    fn test_fee_config_disabled() {
        let mut config = FeeConfig::default();
        config.fees_enabled = false;

        let breakdown = config
            .calculate_breakdown(100.0, "SOL".to_string())
            .unwrap();
        assert_eq!(breakdown.fee_amount, 0.0);
        assert_eq!(breakdown.net_amount, 100.0);
    }

    #[test]
    fn test_fee_validation() {
        let original_amount = 100.0;
        let correct_fee = original_amount * DEFAULT_FEE_PERCENTAGE;

        // Valid fee should pass
        assert!(TreasuryFeeManager::validate_fee_amount(correct_fee, original_amount).is_ok());

        // Invalid fee should fail
        assert!(TreasuryFeeManager::validate_fee_amount(1.0, original_amount).is_err());
    }

    #[test]
    fn test_minimum_threshold() {
        let config = FeeConfig::default();

        assert!(config.meets_minimum(1.0));
        assert!(!config.meets_minimum(0.0000001));
    }

    #[test]
    fn test_format_summary() {
        let breakdown = FeeBreakdown::new(100.0, "SOL".to_string()).unwrap();
        let summary = breakdown.format_summary();

        assert!(summary.contains("100"));
        assert!(summary.contains("0.25"));
        assert!(summary.contains("99.75"));
        assert!(summary.contains("SOL"));
        assert!(summary.contains("0.25%"));
    }
}
