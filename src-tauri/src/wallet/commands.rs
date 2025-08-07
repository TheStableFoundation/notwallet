use crate::constants::{
    address::{BACH_TOKEN_ADDRESS, BACH_TOKEN_ADDRESS_LOCAL, SPL_TOKEN_PROGRAM_ID},
    rpc::{rpc_url, USE_LOCAL_RPC},
    store::{store, STORE_KEYPAIRS, STORE_SEEDS},
};
use crate::model::keypair::SolanaWallet;
use crate::model::seed::{Seed, SeedType};
use crate::model::wallet::OnboardingCreateWallet;
use bip39::{Language, Mnemonic};
use chrono::Utc;
use log::{debug, error, info};
use solana_sdk::{signature::Signer, transaction::Transaction};
use tauri::{command, AppHandle, State};
use uuid::Uuid;
use wallet_kit::{
    balance::{bach_balance, sol_balance},
    derive_keypair::derive_keypair_default,
    token_info::token_info,
    transactions::{create_token_transfer_ix, create_transfer_ix},
};

#[command]
pub fn onboarding_create_wallet(app: AppHandle) -> Result<OnboardingCreateWallet, String> {
    debug!("Starting Solana wallet creation");

    // Generate a new 12-word mnemonic
    let mnemonic = Mnemonic::generate_in(Language::English, 12)
        .map_err(|e| format!("Mnemonic generation failed: {:?}", e))?;
    let mnemonic_phrase = mnemonic.to_string();

    // Derive keypair using helper (account 0)
    let keypair = derive_keypair_default(&mnemonic_phrase, 0)?;

    let pubkey = keypair.pubkey().to_string();
    let privkey = bs58::encode(keypair.to_bytes()).into_string();
    debug!("Wallet pubkey: {}", pubkey);
    debug!("Wallet privkey (bs58, truncated): {}...", &privkey[..8]);

    // Create Seed struct
    let seed_id = Uuid::new_v4();
    let seed_struct = Seed {
        id: seed_id,
        phrase: mnemonic_phrase.clone(),
        seed_type: SeedType::Created {
            timestamp: Utc::now(),
        },
    };

    // Save the seed struct to the store_seeds
    let store = match store(&app) {
        Ok(store) => store,
        Err(_) => {
            return Err("Failed to load store".to_string());
        }
    };
    let mut seeds: Vec<Seed> = match store.get(STORE_SEEDS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };
    seeds.push(seed_struct);
    store.set(STORE_SEEDS, serde_json::json!(seeds));
    store.save().ok();
    let name = "Account 0".to_string();
    let wallet = SolanaWallet {
        name,
        account: 0,
        pubkey,
        privkey,
        seed_id: seed_id,
        id: Uuid::new_v4(),
    };
    // Load existing keypairs, append, and save
    let mut keypairs: Vec<SolanaWallet> = match store.get(STORE_KEYPAIRS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };
    keypairs.push(wallet.clone());
    store.set(STORE_KEYPAIRS, serde_json::json!(keypairs));
    match store.save() {
        Ok(_) => {
            info!("Wallet stored successfully.");
            Ok(OnboardingCreateWallet {
                seed: mnemonic_phrase.clone(),
                keypair: wallet,
            })
        }
        Err(e) => {
            error!("Failed to save wallet: {:?}", e);
            Err("Error saving wallet".to_string())
        }
    }
}

#[command]
pub async fn derive_next_keypair(app: AppHandle, seed_uuid: Uuid) -> Result<SolanaWallet, String> {
    let store = store(&app).map_err(|_| "Failed to load store".to_string())?;
    let seeds: Vec<Seed> = match store.get(STORE_SEEDS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };
    // Get the seed phrase for this give seed uuid
    let seed = seeds
        .iter()
        .find(|s| s.id == seed_uuid)
        .ok_or_else(|| format!("Seed with UUID {} not found", seed_uuid))?;
    debug!("Deriving keypair for seed {}", seed.id);

    // Get all keypairs to determine the next account index
    let count = match store.get(STORE_KEYPAIRS) {
        Some(value) => {
            let keypairs: Vec<SolanaWallet> = serde_json::from_value(value).unwrap_or_default();
            keypairs.iter().filter(|k| k.seed_id == seed_uuid).count()
        }
        None => 0,
    };

    // Derive new keypair for this account index
    let keypair = derive_keypair_default(&seed.phrase, count as u32)
        .map_err(|e| format!("Failed to derive keypair: {:?}", e))?;

    let pubkey = keypair.pubkey().to_string();
    let privkey = bs58::encode(keypair.to_bytes()).into_string();
    let name = format!("Account {}", count as u32).to_string();
    let wallet = SolanaWallet {
        id: Uuid::new_v4(),
        name,
        account: count as u32,
        pubkey,
        privkey,
        seed_id: seed_uuid,
    };
    // Load existing keypairs, append, and save
    let mut keypairs: Vec<SolanaWallet> = match store.get(STORE_KEYPAIRS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };
    keypairs.push(wallet.clone());
    store.set(STORE_KEYPAIRS, serde_json::json!(keypairs));
    store
        .save()
        .map_err(|_| "Failed to save keypair".to_string())?;
    debug!("Derived keypair: {}", wallet.pubkey);
    info!("Derived keypair for seed {}: {}", seed.id, wallet.pubkey);
    Ok(wallet)
}

#[command]
pub fn get_bach_balance(pubkey: String) -> String {
    info!("Getting Bach balance for {}", pubkey);
    let bach_token_address = if USE_LOCAL_RPC {
        BACH_TOKEN_ADDRESS_LOCAL.to_string()
    } else {
        BACH_TOKEN_ADDRESS.to_string()
    };
    bach_balance(
        rpc_url(),
        pubkey,
        SPL_TOKEN_PROGRAM_ID.to_string(),
        bach_token_address,
    )
}

#[command]
pub fn get_sol_balance(pubkey: String) -> String {
    info!("Getting balance for {}", pubkey);
    sol_balance(rpc_url(), pubkey)
}

#[command]
pub fn get_token_info(id: String) -> String {
    info!("Getting token info for {}", id);
    token_info(id)
}

#[command]
pub fn get_all_keypairs(app: AppHandle) -> Result<Vec<SolanaWallet>, String> {
    info!("Getting all keypairs");
    let store = store(&app).map_err(|_| "Failed to load store".to_string())?;

    // Load existing keypairs
    let keypairs: Vec<SolanaWallet> = match store.get(STORE_KEYPAIRS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };

    Ok(keypairs)
}

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
