use {
    crate::{
        commands::derive_keypair_default::derive_keypair_default,
        models::{
            keypair::KeyPairError,
            response::CreateWalletResponse,
            seed::{Seed, SeedType::Created},
            wallet::Wallet,
        },
    },
    chrono::Utc,
    smbcloud_wallet_core::create_seed_phrase::create_seed_phrase,
    uuid::Uuid,
};

/// Create a new 12-word English seed phrase and derive the default keypair.
///
#[uniffi::export]
pub fn create_wallet() -> Result<CreateWalletResponse, KeyPairError> {
    let mnemonic_phrase = match create_seed_phrase(None, None) {
        Ok(mnemonic_phrase) => mnemonic_phrase.to_string(),
        Err(e) => return Err(KeyPairError::MnemonicError(e.to_string())),
    };
    let seed_id = Uuid::new_v4().to_string();
    let seed = Seed {
        id: seed_id.clone(),
        phrase: mnemonic_phrase.clone(),
        seed_type: Created {
            timestamp: Utc::now().to_string(),
        },
    };
    let keypair = derive_keypair_default(&mnemonic_phrase, 0)?;
    let wallet = Wallet {
        id: Uuid::new_v4().to_string(),
        username: None,
        name: "Account 0".to_string(),
        account: 0,
        pubkey: keypair.pubkey,
        privkey: keypair.privkey,
        seed_id: seed_id.clone(),
    };

    Ok(CreateWalletResponse { seed, wallet })
}
