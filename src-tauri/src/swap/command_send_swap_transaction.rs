use {
    crate::constants::store::{store, STORE_ACTIVE_KEYPAIR},
    crate::model::keypair::SolanaWallet,
    bs58,
    smbcloud_wallet_core_model::models::environment::Environment,
    smbcloud_wallet_core_network::model::{ErrorCode, ErrorResponse},
    smbcloud_wallet_kit::swap::send_jupiter_swap_transaction,
    solana_sdk::signature::{Keypair, Signature},
    tauri::{command, AppHandle},
};

#[command]
pub async fn send_swap_transaction(
    app: AppHandle,
    network: Environment,
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
    send_jupiter_swap_transaction(network.rpc_url(), swap_transaction, keypair).await
}
