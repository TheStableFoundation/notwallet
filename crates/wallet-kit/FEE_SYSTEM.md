# Fee System Documentation

## Overview

The NotWallet fee system implements a **0.25% flat fee** on all transactions that is automatically sent to The Stable Foundation Treasury. This fee is deducted from the transaction amount before sending to the recipient.

## Key Features

- 🏦 **Flat Fee Rate**: 0.25% of transaction amount
- 🎯 **Automatic Deduction**: Fee is automatically calculated and sent to treasury
- 💰 **Multi-Currency Support**: Works with SOL and SPL tokens (BACH, USDC, etc.)
- 🔄 **Seamless Integration**: Built into all transaction functions
- 📊 **Transparent Calculation**: Clear breakdown of fees and net amounts
- 🛡️ **Error Handling**: Robust validation and error recovery
- 📝 **Audit Trail**: Comprehensive logging for all fee collections

## Treasury Information

- **Address**: `3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3`
- **Owner**: The Stable Foundation
- **Purpose**: Protocol development and maintenance funding

## How It Works

### Transaction Flow

```
User sends 100 SOL
    ↓
Fee Calculation (0.25%)
    ↓
┌─────────────────────┐
│ Fee: 0.25 SOL       │ → Treasury Account
│ Net: 99.75 SOL      │ → Recipient Account
└─────────────────────┘
```

### Fee Calculation

For any transaction amount `A`:
- **Fee Amount** = `A × 0.0025` (0.25%)
- **Net Amount** = `A - Fee Amount`
- **Recipient Receives** = `Net Amount`
- **Treasury Receives** = `Fee Amount`

## Implementation Details

### SOL Transactions

```rust
// Example: Sending 10 SOL
let amount = 10.0;
let fee_breakdown = FeeBreakdown::new(amount, "SOL".to_string())?;

// Results:
// fee_breakdown.fee_amount = 0.025 SOL (25,000,000 lamports)
// fee_breakdown.net_amount = 9.975 SOL (9,975,000,000 lamports)

// Two instructions are created:
// 1. Transfer 25,000,000 lamports to treasury
// 2. Transfer 9,975,000,000 lamports to recipient
```

### Token Transactions

```rust
// Example: Sending 100 BACH tokens
let amount = 100.0;
let fee_breakdown = FeeBreakdown::new(amount, "BACH".to_string())?;

// Results:
// fee_breakdown.fee_amount = 0.25 BACH (250,000,000 semitones)
// fee_breakdown.net_amount = 99.75 BACH (99,750,000,000 semitones)

// Two instructions are created:
// 1. Transfer 250,000,000 semitones to treasury token account
// 2. Transfer 99,750,000,000 semitones to recipient token account
```

## API Reference

### Core Types

#### `FeeBreakdown`
Represents the fee calculation for a transaction.

```rust
pub struct FeeBreakdown {
    pub original_amount: f64,    // Original transaction amount
    pub fee_amount: f64,         // 0.25% fee amount
    pub net_amount: f64,         // Amount after fee deduction
    pub fee_percentage: f64,     // 0.0025 (0.25%)
    pub currency: String,        // Token symbol (SOL, BACH, USDC, etc.)
}
```

**Methods:**
- `new(amount: f64, currency: String)` - Create fee breakdown with default 0.25% rate
- `fee_lamports()` - Convert fee to lamports for SOL transactions
- `net_lamports()` - Convert net amount to lamports for SOL transactions
- `fee_token_units(multiplier: f64)` - Convert fee to token units
- `net_token_units(multiplier: f64)` - Convert net amount to token units
- `format_summary()` - Human-readable fee summary

#### `TreasuryFeeManager`
Static utility for treasury operations.

```rust
impl TreasuryFeeManager {
    pub fn treasury_pubkey() -> Result<Pubkey, FeeError>;
    pub fn calculate_fees(amount: f64, currency: String) -> Result<FeeBreakdown, FeeError>;
    pub fn create_sol_fee_instruction(from: &Pubkey, fee_lamports: u64) -> Result<Instruction, FeeError>;
    pub fn create_token_fee_instruction(...) -> Result<Instruction, FeeError>;
    pub fn validate_fee_amount(fee_amount: f64, original_amount: f64) -> Result<(), FeeError>;
    pub fn log_fee_collection(signature: &str, breakdown: &FeeBreakdown, tx_type: &str);
}
```

#### `FeeConfig`
Configurable fee settings.

```rust
pub struct FeeConfig {
    pub standard_fee_percentage: f64,  // Default: 0.0025 (0.25%)
    pub min_transaction_amount: f64,   // Default: 0.000001
    pub treasury_address: String,      // Treasury wallet address
    pub fees_enabled: bool,            // Enable/disable fees
}
```

### Transaction Functions

Both transaction functions automatically include the 0.25% fee:

#### `create_transfer_ix` (SOL Transfers)
```rust
pub async fn create_transfer_ix(
    rpc_url: String,
    sender_keypair: Keypair,
    from_pubkey: String,
    to_pubkey: String,
    amount: f64,  // Total amount (fee will be deducted)
) -> Result<String, TransactionError>
```

#### `create_token_transfer_ix` (Token Transfers)
```rust
pub async fn create_token_transfer_ix(
    rpc_url: String,
    sender_keypair: Keypair,
    from_pubkey: String,
    to_pubkey: String,
    token_mint_address: String,
    token_program_id: String,
    amount: f64,  // Total amount (fee will be deducted)
) -> Result<String, TransactionError>
```

## Examples

### Basic Fee Calculation

```rust
use wallet_kit::fee::{FeeBreakdown, TreasuryFeeManager};

// Calculate fees for 100 SOL
let breakdown = FeeBreakdown::new(100.0, "SOL".to_string())?;
println!("Fee: {} SOL", breakdown.fee_amount);        // 0.25 SOL
println!("Net: {} SOL", breakdown.net_amount);        // 99.75 SOL
println!("Summary: {}", breakdown.format_summary());
```

### SOL Transaction with Fee

```rust
use wallet_kit::transactions::create_transfer_ix;

// Send 10 SOL (0.025 SOL goes to treasury, 9.975 SOL to recipient)
let signature = create_transfer_ix(
    "https://api.mainnet-beta.solana.com".to_string(),
    sender_keypair,
    "sender_address".to_string(),
    "recipient_address".to_string(),
    10.0,  // 0.025 SOL fee + 9.975 SOL to recipient
).await?;
```

### Token Transaction with Fee

```rust
use wallet_kit::transactions::create_token_transfer_ix;

// Send 100 BACH (0.25 BACH goes to treasury, 99.75 BACH to recipient)
let signature = create_token_transfer_ix(
    "https://api.mainnet-beta.solana.com".to_string(),
    sender_keypair,
    "sender_address".to_string(),
    "recipient_address".to_string(),
    "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf".to_string(), // BACH token
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA".to_string(),   // Token program
    100.0, // 0.25 BACH fee + 99.75 BACH to recipient
).await?;
```

### Cost Estimation

```rust
use wallet_kit::transactions::{estimate_sol_transaction_cost, estimate_token_transaction_cost};

// Estimate SOL transaction cost
let estimate = estimate_sol_transaction_cost(
    "https://api.mainnet-beta.solana.com".to_string(),
    10.0
).await?;

println!("Fee: {} SOL", estimate.fee_amount);           // 0.025
println!("Net: {} SOL", estimate.net_amount);           // 9.975
println!("Network fee: {} lamports", estimate.network_fee_lamports);
```

## Fee Examples by Amount

| Original Amount | Fee (0.25%) | Net Amount | Currency |
|----------------|-------------|------------|----------|
| 1.0 SOL        | 0.0025 SOL  | 0.9975 SOL | SOL      |
| 10.0 SOL       | 0.025 SOL   | 9.975 SOL  | SOL      |
| 100.0 SOL      | 0.25 SOL    | 99.75 SOL  | SOL      |
| 1000.0 SOL     | 2.5 SOL     | 997.5 SOL  | SOL      |
| 100.0 BACH     | 0.25 BACH   | 99.75 BACH | BACH     |
| 50.0 USDC      | 0.125 USDC  | 49.875 USDC| USDC     |

## Transaction Cost Breakdown

### SOL Transaction Costs
- **Amount to recipient**: `Original Amount - (Original Amount × 0.0025)`
- **Fee to treasury**: `Original Amount × 0.0025`
- **Network fees**: ~10,000 lamports (for 2 instructions)
- **Total cost to sender**: `Original Amount + Network Fees`

### Token Transaction Costs
- **Amount to recipient**: `Original Amount - (Original Amount × 0.0025)`
- **Fee to treasury**: `Original Amount × 0.0025`
- **Network fees**: 5,000-30,000 lamports (depending on account creation needs)
- **Account creation**: 0-2,039,280 lamports (if token accounts don't exist)
- **Total cost to sender**: `Original Amount + Network Fees + Account Creation`

## Error Handling

The fee system includes comprehensive error handling:

### `FeeError` Types
- `InvalidFeePercentage` - Fee percentage outside 0-100% range
- `AmountTooSmall` - Transaction amount below minimum threshold
- `CalculationOverflow` - Mathematical overflow in calculations
- `TreasuryAddressError` - Invalid treasury address

### `TransactionError` Types (Fee-Related)
- `FeeCalculationError` - Error in fee calculation
- `TreasuryError` - Error setting up treasury accounts
- `InsufficientFunds` - Not enough balance for amount + fees

## Security Considerations

1. **Treasury Address Validation**: Treasury address is validated on every transaction
2. **Fee Calculation Verification**: Fee amounts are validated to prevent manipulation
3. **Balance Checks**: Ensures sufficient funds for both transaction and fees
4. **Atomic Transactions**: Fee and main transfer happen in single transaction
5. **Audit Logging**: All fee collections are logged with transaction signatures

## Configuration

### Default Configuration
```rust
FeeConfig {
    standard_fee_percentage: 0.0025,  // 0.25%
    min_transaction_amount: 0.000001, // Minimum viable amount
    treasury_address: "3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3",
    fees_enabled: true,
}
```

### Custom Configuration
```rust
let custom_config = FeeConfig::new(
    0.005,    // 0.5% fee
    0.1,      // Minimum 0.1 SOL
    treasury_address,
    true      // Fees enabled
)?;
```

### Disable Fees (Testing)
```rust
let mut config = FeeConfig::default();
config.fees_enabled = false;

// This will result in zero fees
let breakdown = config.calculate_breakdown(100.0, "SOL".to_string())?;
assert_eq!(breakdown.fee_amount, 0.0);
```

## Logging and Auditing

All fee collections are logged with the following information:
- Transaction signature
- Transaction type (SOL/Token)
- Original amount
- Fee amount
- Net amount
- Treasury address
- Timestamp

Example log entry:
```
INFO wallet_kit::fee: Fee collected - Signature: 5J7... | Type: SOL | Original: 100 SOL | Fee: 0.25 SOL | Net: 99.75 SOL | Treasury: 3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3
```

## Testing

Run the fee system tests:
```bash
cargo test fee
```

Run the demo example:
```bash
cargo run --example fee_demo
```

## Integration Example

```rust
use wallet_kit::fee::{FeeBreakdown, TreasuryFeeManager};
use wallet_kit::transactions::create_transfer_ix;

async fn send_with_fee_display(
    sender_keypair: Keypair,
    from: String,
    to: String,
    amount: f64,
) -> Result<String, Box<dyn std::error::Error>> {
    // Calculate and display fee breakdown
    let fee_breakdown = TreasuryFeeManager::calculate_fees(amount, "SOL".to_string())?;
    
    println!("Transaction Summary:");
    println!("  Original Amount: {} SOL", fee_breakdown.original_amount);
    println!("  Fee to Treasury: {} SOL", fee_breakdown.fee_amount);
    println!("  Net to Recipient: {} SOL", fee_breakdown.net_amount);
    println!("  Treasury Address: {}", THE_STABLE_FOUNDATION_TREASURY);
    
    // Execute transaction (fee is automatically included)
    let signature = create_transfer_ix(
        "https://api.mainnet-beta.solana.com".to_string(),
        sender_keypair,
        from,
        to,
        amount,
    ).await?;
    
    println!("Transaction completed: {}", signature);
    Ok(signature)
}
```

## Fee Structure Rationale

### Why 0.25%?
- **Sustainable**: Provides ongoing funding for protocol development
- **Competitive**: Lower than most traditional financial services
- **Fair**: Scales proportionally with transaction size
- **Transparent**: Fixed rate, no hidden fees

### Revenue Distribution
All fees collected go to The Stable Foundation Treasury for:
- Protocol development and maintenance
- Security audits and improvements
- Community initiatives and grants
- Operational expenses

## Compliance and Transparency

### Fee Disclosure
- Fees are clearly calculated and displayed before transaction confirmation
- Fee amount and percentage are included in transaction logs
- Users can preview exact fee amounts using cost estimation functions

### Audit Trail
- Every fee collection is logged with transaction signature
- Treasury address is validated on every transaction
- Fee calculations include overflow and underflow protection

## Future Enhancements

Potential future improvements to the fee system:
- 📊 **Dynamic Fee Rates**: Adjust fees based on network conditions
- 🎯 **Fee Tiers**: Different rates for different user types
- 💎 **Fee Discounts**: Reduced fees for token holders
- 🔄 **Fee Rebates**: Partial fee returns for high-volume users
- 📈 **Fee Analytics**: Detailed fee collection dashboards

## Troubleshooting

### Common Issues

1. **"Insufficient Funds" Error**
   - Ensure wallet has enough balance for amount + fee + network fees
   - Check: `balance >= (amount + network_fees)` where network fees ≈ 0.00001 SOL

2. **"Treasury Account Not Found" for Tokens**
   - System automatically creates treasury token accounts
   - Sender pays for token account creation (~0.002 SOL)

3. **"Fee Calculation Error"**
   - Check that transaction amount is positive
   - Ensure amount meets minimum threshold (0.000001)

### Debug Tips

Enable detailed logging:
```rust
env_logger::init();
```

This will show:
- Fee calculation details
- Treasury account operations
- Transaction instruction creation
- Error details and retry attempts

### Testing Fee Calculations

```rust
use wallet_kit::fee::FeeBreakdown;

// Test fee calculation
let breakdown = FeeBreakdown::new(100.0, "SOL".to_string())?;
assert_eq!(breakdown.fee_amount, 0.25);
assert_eq!(breakdown.net_amount, 99.75);
assert_eq!(breakdown.fee_percentage, 0.0025);
```

## License and Legal

The fee system is part of the NotWallet project and is subject to the same license terms. Fee collection is disclosed in the application terms of service.

For questions about fee structure or treasury operations, contact The Stable Foundation.