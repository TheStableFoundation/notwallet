use solana_client::{nonblocking::rpc_client::RpcClient, rpc_request::TokenAccountsFilter};
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    message::Message,
    program_pack::Pack,
    pubkey::Pubkey,
    signature::{Keypair, Signature},
    signer::Signer,
    system_instruction,
    transaction::Transaction,
};
use spl_token::{
    instruction as token_instruction,
    state::{Account as TokenAccount, Mint},
};
use std::str::FromStr;
use thiserror::Error;

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
}

/// Creates and sends a SOL transfer transaction
pub async fn create_transfer_ix(
    rpc_url: String,
    sender_keypair: Keypair,
    from_pubkey: String,
    to_pubkey: String,
    amount_lamports: u64,
) -> Result<String, TransactionError> {
    // Connect to the Solana cluster
    let rpc_client = RpcClient::new(rpc_url);

    // Parse public keys
    let from = Pubkey::from_str(&from_pubkey)
        .map_err(|_| TransactionError::InvalidAddress(from_pubkey.clone()))?;

    let to = Pubkey::from_str(&to_pubkey)
        .map_err(|_| TransactionError::InvalidAddress(to_pubkey.clone()))?;

    // Check sender's SOL balance
    let balance = rpc_client
        .get_balance(&from)
        .await
        .map_err(|e| TransactionError::ConnectionError(e.to_string()))?;

    // Ensure sufficient balance (accounting for transaction fee ~5000 lamports)
    if balance < amount_lamports + 5000 {
        return Err(TransactionError::InsufficientFunds);
    }

    // Create transfer instruction
    let instruction = system_instruction::transfer(&from, &to, amount_lamports);

    // Get recent blockhash
    let blockhash = rpc_client
        .get_latest_blockhash()
        .await
        .map_err(|e| TransactionError::ConnectionError(e.to_string()))?;

    // Create and sign transaction
    let transaction = Transaction::new_signed_with_payer(
        &[instruction],
        Some(&from),
        &[&sender_keypair],
        blockhash,
    );

    // Send transaction
    let signature = rpc_client
        .send_and_confirm_transaction(&transaction)
        .await
        .map_err(|e| TransactionError::TransactionError(e.to_string()))?;

    Ok(signature.to_string())
}

/// Creates and sends an SPL token transfer transaction
pub async fn create_token_transfer_ix(
    rpc_url: String,
    sender_keypair: Keypair,
    from_pubkey: String,
    to_pubkey: String,
    token_mint_address: String,
    token_program_id: String,
    amount: u64,
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

    // Find the token accounts for the sender and recipient
    let sender_token_account = find_token_account(&rpc_client, &from_wallet, &token_mint).await?;

    // Check if recipient has a token account for this mint, if not we'll need to create one
    let recipient_token_account_result =
        find_token_account(&rpc_client, &to_wallet, &token_mint).await;

    let recipient_token_account = match recipient_token_account_result {
        Ok(account) => account,
        Err(_) => {
            // Create a token account for the recipient
            let new_account = create_token_account(
                &rpc_client,
                &sender_keypair,
                &to_wallet,
                &token_mint,
                &token_program,
            )
            .await?;

            new_account
        }
    };

    // Check token balance
    let token_balance = get_token_balance(&rpc_client, &sender_token_account).await?;
    if token_balance < amount {
        return Err(TransactionError::InsufficientFunds);
    }

    // Create token transfer instruction
    let instruction = token_instruction::transfer(
        &token_program,
        &sender_token_account,
        &recipient_token_account,
        &from_wallet,
        &[&from_wallet],
        amount,
    )
    .map_err(|e| TransactionError::TransactionError(e.to_string()))?;

    // Get recent blockhash
    let blockhash = rpc_client
        .get_latest_blockhash()
        .await
        .map_err(|e| TransactionError::ConnectionError(e.to_string()))?;

    // Create and sign transaction
    let transaction = Transaction::new_signed_with_payer(
        &[instruction],
        Some(&from_wallet),
        &[&sender_keypair],
        blockhash,
    );

    // Send transaction
    let signature = rpc_client
        .send_and_confirm_transaction(&transaction)
        .await
        .map_err(|e| TransactionError::TransactionError(e.to_string()))?;

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

    let mint = Mint::unpack(&mint_info.data)
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
