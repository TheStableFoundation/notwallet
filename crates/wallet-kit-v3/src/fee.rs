use {
    crate::constants::{LAMPORTS_PER_SOL, THE_STABLE_FOUNDATION_TREASURY_ADDRESS},
    log::info,
    serde::{Deserialize, Serialize},
    solana_address::Address,
    solana_instruction::Instruction,
    solana_sdk::pubkey::Pubkey,
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

/// Treasury fee management utilities
pub struct TreasuryFeeManager;

impl TreasuryFeeManager {
    /// Get the treasury wallet public key
    pub fn treasury_pubkey() -> Result<Address, FeeError> {
        Address::from_str(THE_STABLE_FOUNDATION_TREASURY_ADDRESS).map_err(|e| {
            FeeError::TreasuryAddressError(format!(
                "Invalid treasury address {}: {}",
                THE_STABLE_FOUNDATION_TREASURY_ADDRESS, e
            ))
        })
    }
}
