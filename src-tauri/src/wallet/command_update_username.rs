use {
    crate::{
        constants::store::{store, STORE_ACTIVE_KEYPAIR, STORE_KEYPAIRS},
        model::keypair::SolanaWallet,
    },
    smbcloud_wallet_core_network::model::{ErrorCode, ErrorResponse},
    tauri::{command, AppHandle},
    uuid::Uuid,
};

#[command]
pub async fn update_username(
    app: AppHandle,
    uid: String,
    username: String,
) -> Result<String, ErrorResponse> {
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
    let mut active_wallet: SolanaWallet =
        serde_json::from_value(wallet_value).map_err(|_| ErrorResponse::Error {
            code: ErrorCode::ParseError,
            message: "Failed to parse wallet".to_string(),
        })?;
    // Sanity check - parse the uid string to Uuid
    let wallet_id: Uuid = Uuid::parse_str(&uid).map_err(|_| ErrorResponse::Error {
        code: ErrorCode::ParseError,
        message: "Invalid UUID format".to_string(),
    })?;
    if active_wallet.id != wallet_id {
        return Err(ErrorResponse::Error {
            code: ErrorCode::ParseError,
            message: "Invalid wallet ID".to_string(),
        });
    }
    active_wallet.username = Some(username.clone());
    // Update the active wallet in the store
    store.set(STORE_ACTIVE_KEYPAIR, serde_json::json!(&active_wallet));
    // Load existing keypairs, update the wallet with uuid
    let mut keypairs: Vec<SolanaWallet> = match store.get(STORE_KEYPAIRS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };
    // Find the wallet with the same uuid as the active wallet and update it
    for wallet in &mut keypairs {
        if wallet.id == active_wallet.id {
            wallet.username = Some(username.clone());
            break;
        }
    }
    store.set(STORE_KEYPAIRS, serde_json::json!(keypairs));
    store.save().map_err(|_| ErrorResponse::Error {
        code: ErrorCode::ParseError,
        message: "Failed to update keypair".to_string(),
    })?;
    Ok("Username updated successfully".to_string())
}
