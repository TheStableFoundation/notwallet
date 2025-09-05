use {
    crate::{
        constants::store::{store, STORE_ACTIVE_KEYPAIR},
        model::{airdrop::AirdropResponse, keypair::SolanaWallet},
        network::airdrop::airdrop,
    },
    bs58,
    network::model::{ErrorCode, ErrorResponse},
    solana_sdk::signature::{Keypair, Signer},
    tauri::{command, AppHandle},
};

#[command]
pub async fn sign_message(
    app: AppHandle,
    message: String,
) -> Result<AirdropResponse, ErrorResponse> {
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

    // Sign the message
    let signature = keypair.sign_message(message.as_bytes());
    let signature_b58 = bs58::encode(signature).into_string();

    // Call the airdrop function with pubkey and signature
    airdrop(wallet.pubkey.clone(), signature_b58.clone()).await
}
