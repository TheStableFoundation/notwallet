use {
    crate::models::{
        keypair::KeyPairError,
        response::CreateWalletResponse,
        seed::{Seed, SeedType},
        wallet::Wallet,
    },
    chrono::Utc,
    uuid::Uuid,
    wallet_core::import_wallet::import_solana_wallet as core_import_wallet,
};

#[uniffi::export]
pub fn import_wallet(mnemonic_phrase: String) -> Result<CreateWalletResponse, KeyPairError> {
    // Derive keypair using the helper function (default account 0, change 0)
    let keypair = match core_import_wallet(mnemonic_phrase.clone()) {
        Ok(keypair) => keypair,
        Err(err) => return Err(KeyPairError::MnemonicError(err)),
    };

    // Create a new Seed struct with a generated UUID and Imported type
    let seed_id = Uuid::new_v4().to_string();
    let seed_struct = Seed {
        id: seed_id.clone(),
        phrase: mnemonic_phrase.clone(),
        seed_type: SeedType::Imported {
            timestamp: Utc::now().to_string(),
        },
    };

    let wallet = Wallet {
        id: Uuid::new_v4().to_string(),
        username: None,
        name: "Account 0".to_string(),
        account: 0,
        pubkey: keypair.0,
        privkey: keypair.1,
        seed_id: seed_id.clone(),
    };

    Ok(CreateWalletResponse {
        seed: seed_struct,
        wallet,
    })
}
