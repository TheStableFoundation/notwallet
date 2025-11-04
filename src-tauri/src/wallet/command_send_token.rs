use {
    crate::{
        constants::{
            address::{BACH_TOKEN_ADDRESS, BACH_TOKEN_ADDRESS_LOCAL},
            rpc::{rpc_url, USE_LOCAL_RPC},
            store::{store, STORE_KEYPAIRS},
        },
        model::keypair::SolanaWallet,
    },
    log::info,
    smbcloud_wallet_constants::constants::SPL_TOKEN_PROGRAM_ID,
    smbcloud_wallet_kit::transactions::{create_token_transfer_ix, create_transfer_ix},
    tauri::{command, AppHandle},
};

#[command]
pub async fn send_token(
    app: AppHandle,
    from: String,
    to: String,
    amount: f64,
    token_type: String,
) -> Result<String, String> {
    info!("Sending {} {} from {} to {}", amount, token_type, from, to);

    // Get the sender's keypair
    let store = store(&app).map_err(|_| "Failed to load store".to_string())?;
    let keypairs: Vec<SolanaWallet> = match store.get(STORE_KEYPAIRS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => return Err("No keypairs found".to_string()),
    };

    let sender = keypairs
        .iter()
        .find(|k| k.pubkey == from)
        .ok_or_else(|| "Sender keypair not found".to_string())?;

    // Convert the private key from bs58 to keypair
    let privkey_bytes = bs58::decode(&sender.privkey)
        .into_vec()
        .map_err(|_| "Failed to decode private key".to_string())?;

    let keypair = solana_sdk::signer::keypair::Keypair::from_bytes(&privkey_bytes)
        .map_err(|_| "Failed to create keypair from private key".to_string())?;

    // Create and send the transaction based on token type
    let tx_signature = if token_type == "BACH" {
        // For BACH token transfers
        let bach_token_address = if USE_LOCAL_RPC {
            BACH_TOKEN_ADDRESS_LOCAL.to_string()
        } else {
            BACH_TOKEN_ADDRESS.to_string()
        };

        // Create token transfer instruction
        create_token_transfer_ix(
            rpc_url(),
            keypair,
            from,
            to,
            bach_token_address,
            SPL_TOKEN_PROGRAM_ID.to_string(),
            amount,
        )
        .await
        .map_err(|e| format!("Failed to send BACH tokens: {:?}", e))?
    } else {
        // Create SOL transfer instruction
        create_transfer_ix(rpc_url(), keypair, from, to, amount)
            .await
            .map_err(|e| format!("Failed to send SOL: {:?}", e))?
    };

    info!("Transaction sent successfully: {}", tx_signature);
    Ok(tx_signature)
}
