use {
    crate::fee::TreasuryFeeManager,
    constants::constants::{SEMITONE_PER_BACH, THE_STABLE_FOUNDATION_TREASURY_ADDRESS},
    log::{debug, info, warn},
    solana_client::{nonblocking::rpc_client::RpcClient, rpc_request::TokenAccountsFilter},
    solana_sdk::{
        program_pack::Pack, pubkey::Pubkey, signature::Keypair, signer::Signer, system_instruction,
        transaction::Transaction,
    },
    spl_token::{
        instruction as token_instruction,
        state::{Account as TokenAccount, Mint},
    },
    std::str::FromStr,
    thiserror::Error,
};

#[derive(Error, Debug)]
pub enum TransactionError {
    #[error("Failed to connect to RPC: {0}")]
    ConnectionError(String),

    #[error("Invalid address: {0}")]
    InvalidAddress(String),

    #[error("Transaction error: {0}")]
    TransactionError(String),

    #[error("Token account not found")]
    TokenAccountNotFound,

    #[error("Insufficient funds")]
    InsufficientFunds,

    #[error("Fee calculation error: {0}")]
    FeeCalculationError(String),

    #[error("Treasury setup error: {0}")]
    TreasuryError(String),
}

/// Creates and sends a SOL transfer transaction with 0.25% fee to treasury
pub async fn create_transfer_ix(
    rpc_url: String,
    sender_keypair: Keypair,
    from_pubkey: String,
    to_pubkey: String,
    amount: f64,
) -> Result<String, TransactionError> {
    // Connect to the Solana cluster
    let rpc_client = RpcClient::new(rpc_url);

    // Parse public keys
    let from = Pubkey::from_str(&from_pubkey)
        .map_err(|_| TransactionError::InvalidAddress(from_pubkey.clone()))?;

    let to = Pubkey::from_str(&to_pubkey)
        .map_err(|_| TransactionError::InvalidAddress(to_pubkey.clone()))?;

    // Calculate fee breakdown
    let fee_breakdown = TreasuryFeeManager::calculate_fees(amount, "SOL".to_string())
        .map_err(|e| TransactionError::FeeCalculationError(e.to_string()))?;

    // Convert to lamports
    let fee_lamports = fee_breakdown.fee_lamports();
    let net_amount_lamports = fee_breakdown.net_lamports();
    let total_amount_lamports = fee_breakdown.total_lamports();

    // Check sender's SOL balance
    let balance = rpc_client
        .get_balance(&from)
        .await
        .map_err(|e| TransactionError::ConnectionError(e.to_string()))?;

    // Ensure sufficient balance (accounting for amount + fee + transaction fees ~10000 lamports)
    if balance < total_amount_lamports + 10000 {
        warn!(
            "Insufficient funds: balance {} lamports, required {} lamports",
            balance,
            total_amount_lamports + 10000
        );
        return Err(TransactionError::InsufficientFunds);
    }

    debug!("Fee breakdown: {}", fee_breakdown.format_summary());

    // Create transfer instructions
    let fee_instruction = TreasuryFeeManager::create_sol_fee_instruction(&from, fee_lamports)
        .map_err(|e| TransactionError::FeeCalculationError(e.to_string()))?;
    let main_instruction = system_instruction::transfer(&from, &to, net_amount_lamports);

    // Get recent blockhash
    let blockhash = rpc_client
        .get_latest_blockhash()
        .await
        .map_err(|e| TransactionError::ConnectionError(e.to_string()))?;

    // Create and sign transaction with both instructions
    let transaction = Transaction::new_signed_with_payer(
        &[fee_instruction, main_instruction],
        Some(&from),
        &[&sender_keypair],
        blockhash,
    );

    // Send transaction
    let signature = rpc_client
        .send_and_confirm_transaction(&transaction)
        .await
        .map_err(|e| TransactionError::TransactionError(e.to_string()))?;

    // Log fee collection for audit
    TreasuryFeeManager::log_fee_collection(&signature.to_string(), &fee_breakdown, "SOL");

    info!(
        "SOL transfer completed successfully. Signature: {}",
        signature
    );
    Ok(signature.to_string())
}

/// Creates and sends an SPL token transfer transaction with 0.25% fee to treasury
/// Only for BACH token transfer
pub async fn create_token_transfer_ix(
    rpc_url: String,
    sender_keypair: Keypair,
    from_pubkey: String,
    to_pubkey: String,
    token_mint_address: String,
    token_program_id: String,
    amount: f64,
) -> Result<String, TransactionError> {
    // Connect to the Solana cluster
    let rpc_client = RpcClient::new(rpc_url);

    // Parse public keys
    let from_wallet = Pubkey::from_str(&from_pubkey)
        .map_err(|_| TransactionError::InvalidAddress(from_pubkey.clone()))?;

    let to_wallet = Pubkey::from_str(&to_pubkey)
        .map_err(|_| TransactionError::InvalidAddress(to_pubkey.clone()))?;

    let token_mint = Pubkey::from_str(&token_mint_address)
        .map_err(|_| TransactionError::InvalidAddress(token_mint_address.clone()))?;

    let token_program = Pubkey::from_str(&token_program_id)
        .map_err(|_| TransactionError::InvalidAddress(token_program_id.clone()))?;

    // Calculate fee breakdown for token transaction
    let fee_breakdown = TreasuryFeeManager::calculate_fees(amount, "BACH".to_string())
        .map_err(|e| TransactionError::FeeCalculationError(e.to_string()))?;

    // Find the token accounts for the sender, recipient, and treasury
    let sender_token_account = find_token_account(&rpc_client, &from_wallet, &token_mint).await?;

    // Ensure recipient has a token account for this mint
    let recipient_token_account =
        match find_token_account(&rpc_client, &to_wallet, &token_mint).await {
            Ok(account) => {
                debug!("Recipient token account exists: {}", account);
                account
            }
            Err(_) => {
                info!("Creating recipient token account for mint: {}", token_mint);
                create_token_account(
                    &rpc_client,
                    &sender_keypair,
                    &to_wallet,
                    &token_mint,
                    &token_program,
                )
                .await?
            }
        };

    // Check if treasury has a token account for this mint, if not we'll need to create one
    let treasury_wallet =
        Pubkey::from_str(THE_STABLE_FOUNDATION_TREASURY_ADDRESS).map_err(|_| {
            TransactionError::InvalidAddress(THE_STABLE_FOUNDATION_TREASURY_ADDRESS.to_string())
        })?;

    let treasury_token_account_result =
        find_token_account(&rpc_client, &treasury_wallet, &token_mint).await;

    let _treasury_token_account = match treasury_token_account_result {
        Ok(account) => {
            debug!("Treasury token account exists: {}", account);
            account
        }
        Err(_) => {
            info!("Creating treasury token account for mint: {}", token_mint);
            // Create a token account for the treasury (sender pays for creation)
            let new_account = create_token_account(
                &rpc_client,
                &sender_keypair,
                &treasury_wallet,
                &token_mint,
                &token_program,
            )
            .await
            .map_err(|e| {
                TransactionError::TreasuryError(format!(
                    "Failed to create treasury token account: {}",
                    e
                ))
            })?;

            info!("Created treasury token account: {}", new_account);
            new_account
        }
    };

    // Get treasury token account
    let treasury_wallet = TreasuryFeeManager::treasury_pubkey()
        .map_err(|e| TransactionError::TreasuryError(e.to_string()))?;

    let treasury_token_account =
        match find_token_account(&rpc_client, &treasury_wallet, &token_mint).await {
            Ok(account) => {
                debug!("Treasury token account exists: {}", account);
                account
            }
            Err(_) => {
                info!("Creating treasury token account for mint: {}", token_mint);
                create_token_account(
                    &rpc_client,
                    &sender_keypair,
                    &treasury_wallet,
                    &token_mint,
                    &token_program,
                )
                .await
                .map_err(|e| {
                    TransactionError::TreasuryError(format!(
                        "Failed to create treasury token account: {}",
                        e
                    ))
                })?
            }
        };

    // Convert to semitones
    let fee_semitones = fee_breakdown.fee_token_units(SEMITONE_PER_BACH);
    let net_amount_semitones = fee_breakdown.net_token_units(SEMITONE_PER_BACH);
    let total_amount_semitones = fee_breakdown.total_token_units(SEMITONE_PER_BACH);

    debug!("Token fee breakdown: {}", fee_breakdown.format_summary());

    // Check token balance
    let token_balance = get_token_balance(&rpc_client, &sender_token_account).await?;

    if token_balance < total_amount_semitones {
        warn!(
            "Insufficient token funds: balance {} semitones, required {} semitones",
            token_balance, total_amount_semitones
        );
        return Err(TransactionError::InsufficientFunds);
    }

    debug!(
        "Creating token transfer: fee={} semitones, net={} semitones",
        fee_semitones, net_amount_semitones
    );

    // Create token transfer instructions
    let fee_instruction = TreasuryFeeManager::create_token_fee_instruction(
        &token_program,
        &sender_token_account,
        &treasury_token_account,
        &from_wallet,
        fee_semitones,
    )
    .map_err(|e| TransactionError::TransactionError(e.to_string()))?;

    let main_instruction = token_instruction::transfer(
        &token_program,
        &sender_token_account,
        &recipient_token_account,
        &from_wallet,
        &[&from_wallet],
        net_amount_semitones,
    )
    .map_err(|e| TransactionError::TransactionError(e.to_string()))?;

    // Get recent blockhash
    let blockhash = rpc_client
        .get_latest_blockhash()
        .await
        .map_err(|e| TransactionError::ConnectionError(e.to_string()))?;

    // Create and sign transaction with both instructions
    let transaction = Transaction::new_signed_with_payer(
        &[fee_instruction, main_instruction],
        Some(&from_wallet),
        &[&sender_keypair],
        blockhash,
    );

    // Send transaction
    let signature = rpc_client
        .send_and_confirm_transaction(&transaction)
        .await
        .map_err(|e| TransactionError::TransactionError(e.to_string()))?;

    // Log fee collection for audit
    TreasuryFeeManager::log_fee_collection(&signature.to_string(), &fee_breakdown, "Token");

    info!(
        "Token transfer completed successfully. Signature: {}",
        signature
    );
    Ok(signature.to_string())
}

// Helper function to find a token account for a wallet and token mint
async fn find_token_account(
    rpc_client: &RpcClient,
    wallet: &Pubkey,
    token_mint: &Pubkey,
) -> Result<Pubkey, TransactionError> {
    let token_accounts = rpc_client
        .get_token_accounts_by_owner(wallet, TokenAccountsFilter::Mint(*token_mint))
        .await
        .map_err(|e| TransactionError::ConnectionError(e.to_string()))?;

    if let Some(account_info) = token_accounts.iter().next() {
        let pubkey = Pubkey::from_str(&account_info.pubkey)
            .map_err(|_| TransactionError::InvalidAddress(account_info.pubkey.clone()))?;
        Ok(pubkey)
    } else {
        Err(TransactionError::TokenAccountNotFound)
    }
}

// Helper function to create a token account
async fn create_token_account(
    rpc_client: &RpcClient,
    payer: &Keypair,
    owner: &Pubkey,
    token_mint: &Pubkey,
    token_program: &Pubkey,
) -> Result<Pubkey, TransactionError> {
    // Create a new keypair for the token account
    let token_account_keypair = Keypair::new();
    let token_account_pubkey = token_account_keypair.pubkey();

    // Get token mint data to determine account size
    let mint_info = rpc_client
        .get_account(token_mint)
        .await
        .map_err(|e| TransactionError::ConnectionError(e.to_string()))?;

    let _mint = Mint::unpack(&mint_info.data)
        .map_err(|_| TransactionError::TransactionError("Failed to unpack mint".to_string()))?;

    // Calculate space required for token account
    let space = TokenAccount::LEN;

    // Get minimum rent for token account
    let rent = rpc_client
        .get_minimum_balance_for_rent_exemption(space)
        .await
        .map_err(|e| TransactionError::ConnectionError(e.to_string()))?;

    // Create account instruction
    let create_account_ix = system_instruction::create_account(
        &payer.pubkey(),
        &token_account_pubkey,
        rent,
        space as u64,
        token_program,
    );

    // Initialize token account instruction
    let init_account_ix = token_instruction::initialize_account(
        token_program,
        &token_account_pubkey,
        token_mint,
        owner,
    )
    .map_err(|e| TransactionError::TransactionError(e.to_string()))?;

    // Get recent blockhash
    let blockhash = rpc_client
        .get_latest_blockhash()
        .await
        .map_err(|e| TransactionError::ConnectionError(e.to_string()))?;

    // Create and sign transaction
    let transaction = Transaction::new_signed_with_payer(
        &[create_account_ix, init_account_ix],
        Some(&payer.pubkey()),
        &[payer, &token_account_keypair],
        blockhash,
    );

    // Send transaction
    rpc_client
        .send_and_confirm_transaction(&transaction)
        .await
        .map_err(|e| TransactionError::TransactionError(e.to_string()))?;

    Ok(token_account_pubkey)
}

// Helper function to get token balance
async fn get_token_balance(
    rpc_client: &RpcClient,
    token_account: &Pubkey,
) -> Result<u64, TransactionError> {
    let account = rpc_client
        .get_account(token_account)
        .await
        .map_err(|e| TransactionError::ConnectionError(e.to_string()))?;

    let token_account = TokenAccount::unpack(&account.data).map_err(|_| {
        TransactionError::TransactionError("Failed to unpack token account".to_string())
    })?;

    Ok(token_account.amount)
}

/// Represents the cost breakdown of a transaction
#[derive(Debug, Clone)]
pub struct TransactionCostEstimate {
    pub total_amount: f64,
    pub fee_amount: f64,
    pub net_amount: f64,
    pub network_fee_lamports: u64,
    pub total_cost_lamports: u64,       // For SOL transactions
    pub total_cost_tokens: Option<u64>, // For token transactions
    pub requires_treasury_account_creation: bool,
    pub account_creation_cost_lamports: u64,
}

/// Estimates the total cost of a SOL transaction including fees
pub async fn estimate_sol_transaction_cost(
    amount: f64,
) -> Result<TransactionCostEstimate, TransactionError> {
    // Calculate fee breakdown
    let fee_breakdown = TreasuryFeeManager::calculate_fees(amount, "SOL".to_string())
        .map_err(|e| TransactionError::FeeCalculationError(e.to_string()))?;

    // Convert to lamports using fee breakdown
    let total_amount_lamports = fee_breakdown.total_lamports();

    // Estimate network fees (approximately 10000 lamports for a transaction with 2 instructions)
    let network_fee_lamports = 10000u64;

    Ok(TransactionCostEstimate {
        total_amount: amount,
        fee_amount: fee_breakdown.fee_amount,
        net_amount: fee_breakdown.net_amount,
        network_fee_lamports,
        total_cost_lamports: total_amount_lamports + network_fee_lamports,
        total_cost_tokens: None,
        requires_treasury_account_creation: false,
        account_creation_cost_lamports: 0,
    })
}

/// Estimates the total cost of a token transaction including fees and potential account creation
pub async fn estimate_token_transaction_cost(
    rpc_url: String,
    from_pubkey: String,
    to_pubkey: String,
    token_mint_address: String,
    amount: f64,
) -> Result<TransactionCostEstimate, TransactionError> {
    let rpc_client = RpcClient::new(rpc_url);

    // Parse addresses
    let _from_wallet = Pubkey::from_str(&from_pubkey)
        .map_err(|_| TransactionError::InvalidAddress(from_pubkey.clone()))?;
    let to_wallet = Pubkey::from_str(&to_pubkey)
        .map_err(|_| TransactionError::InvalidAddress(to_pubkey.clone()))?;
    let token_mint = Pubkey::from_str(&token_mint_address)
        .map_err(|_| TransactionError::InvalidAddress(token_mint_address.clone()))?;
    let treasury_wallet = TreasuryFeeManager::treasury_pubkey()
        .map_err(|e| TransactionError::TreasuryError(e.to_string()))?;

    // Calculate fee breakdown
    let fee_breakdown = TreasuryFeeManager::calculate_fees(amount, "BACH".to_string())
        .map_err(|e| TransactionError::FeeCalculationError(e.to_string()))?;

    // Convert to token units (semitones for BACH)
    let total_amount_tokens = fee_breakdown.total_token_units(SEMITONE_PER_BACH);

    // Check if recipient and treasury need token accounts
    let recipient_needs_account = find_token_account(&rpc_client, &to_wallet, &token_mint)
        .await
        .is_err();
    let treasury_needs_account = find_token_account(&rpc_client, &treasury_wallet, &token_mint)
        .await
        .is_err();

    // Estimate account creation costs
    let account_creation_cost = if recipient_needs_account || treasury_needs_account {
        let rent_per_account = rpc_client
            .get_minimum_balance_for_rent_exemption(TokenAccount::LEN)
            .await
            .map_err(|e| TransactionError::ConnectionError(e.to_string()))?;

        let accounts_to_create = if recipient_needs_account && treasury_needs_account {
            2
        } else {
            1
        };
        rent_per_account * accounts_to_create
    } else {
        0
    };

    // Estimate network fees (more instructions = higher fees)
    let instruction_count = 2 + // Transfer instructions (fee + main)
        if recipient_needs_account { 2 } else { 0 } + // Create + initialize recipient account
        if treasury_needs_account { 2 } else { 0 }; // Create + initialize treasury account

    let network_fee_lamports = 5000u64 * instruction_count;

    Ok(TransactionCostEstimate {
        total_amount: amount,
        fee_amount: fee_breakdown.fee_amount,
        net_amount: fee_breakdown.net_amount,
        network_fee_lamports,
        total_cost_lamports: account_creation_cost + network_fee_lamports,
        total_cost_tokens: Some(total_amount_tokens),
        requires_treasury_account_creation: treasury_needs_account,
        account_creation_cost_lamports: account_creation_cost,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fee_calculation_integration() {
        // Test fee calculation through TreasuryFeeManager
        let fee_breakdown = TreasuryFeeManager::calculate_fees(100.0, "SOL".to_string()).unwrap();
        assert_eq!(fee_breakdown.fee_amount, 0.25);
        assert_eq!(fee_breakdown.net_amount, 99.75);
        assert_eq!(fee_breakdown.original_amount, 100.0);
    }

    #[test]
    fn test_transaction_cost_estimate_creation() {
        let estimate = TransactionCostEstimate {
            total_amount: 100.0,
            fee_amount: 0.25,
            net_amount: 99.75,
            network_fee_lamports: 10000,
            total_cost_lamports: 100250000, // 100.25 SOL in lamports
            total_cost_tokens: None,
            requires_treasury_account_creation: false,
            account_creation_cost_lamports: 0,
        };

        assert_eq!(estimate.fee_amount, 0.25);
        assert_eq!(estimate.net_amount, 99.75);
        assert_eq!(estimate.total_amount, 100.0);
    }
}
