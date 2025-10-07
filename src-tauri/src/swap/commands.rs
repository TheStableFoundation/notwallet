use crate::constants::{
    rpc::rpc_url,
    store::{store, STORE_ACTIVE_KEYPAIR},
};
use crate::model::keypair::SolanaWallet;
use bs58;
use smbcloud_wallet_kit::{
    models::swap::{SwapQuoteResponse, SwapTransactionPayload, SwapTransactionResponse},
    swap::{
        build_swap_transaction as build_swap_tx, get_jupiter_swap_quote,
        send_jupiter_swap_transaction,
    },
};
use smbcloud_wallet_core_network::model::{ErrorCode, ErrorResponse};
use solana_sdk::signature::{Keypair, Signature};
use tauri::{command, AppHandle};

#[command]
pub async fn get_swap_quote(
    from_token: &str,
    to_token: &str,
    amount: f64,
    slippage_bps: u64,
) -> Result<SwapQuoteResponse, ErrorResponse> {
    get_jupiter_swap_quote(from_token, to_token, amount, slippage_bps).await
}

#[command]
pub async fn build_swap_transaction(
    payload: SwapTransactionPayload,
) -> Result<SwapTransactionResponse, ErrorResponse> {
    build_swap_tx(payload).await
}

#[command]
pub async fn send_swap_transaction(
    app: AppHandle,
    swap_transaction: String,
) -> Result<Signature, ErrorResponse> {
    // Load wallet from store
    let store = store(&app).map_err(|_| ErrorResponse::Error {
        code: ErrorCode::Unknown,
        message: "Failed to load store".to_string(),
    })?;
    let wallet_value = store
        .get(STORE_ACTIVE_KEYPAIR)
        .ok_or(ErrorResponse::Error {
            code: ErrorCode::Unknown,
            message: "No wallet found".to_string(),
        })?;
    let wallet: SolanaWallet =
        serde_json::from_value(wallet_value).map_err(|_| ErrorResponse::Error {
            code: ErrorCode::ParseError,
            message: "Failed to parse wallet".to_string(),
        })?;

    // Decode private key from base58
    let privkey_bytes =
        bs58::decode(wallet.privkey)
            .into_vec()
            .map_err(|_| ErrorResponse::Error {
                code: ErrorCode::ParseError,
                message: "Failed to decode private key".to_string(),
            })?;

    // Use Keypair::try_from instead of deprecated from_bytes
    let keypair = Keypair::from_bytes(&privkey_bytes).map_err(|_| ErrorResponse::Error {
        code: ErrorCode::ParseError,
        message: "Failed to create keypair from private key".to_string(),
    })?;
    send_jupiter_swap_transaction(rpc_url(), swap_transaction, keypair).await
}
