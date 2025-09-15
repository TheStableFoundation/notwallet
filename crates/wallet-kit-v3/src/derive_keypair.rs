use {
    crate::{
        model::{KeyPair, KeyPairError, Seed, SeedType::Created, Wallet},
        response::CreateWalletResponse,
    },
    bs58::encode,
    chrono::Utc,
    solana_sdk::signer::Signer,
    uuid::Uuid,
    wallet_core::{create_seed_phrase::create_seed_phrase, derive_keypair::derive_keypair},
};

#[uniffi::export]
pub fn derive_keypair_default(
    mnemonic_phrase: &str,
    account: u32,
) -> Result<KeyPair, KeyPairError> {
    match derive_keypair(mnemonic_phrase, account, 0) {
        Ok(keypair) => {
            let pubkey = keypair.pubkey().to_string();
            let privkey = encode(keypair.to_bytes()).into_string();
            Ok(KeyPair { pubkey, privkey })
        }
        Err(e) => Err(KeyPairError::InvalidAddress(e.to_string())),
    }
}

/// Create a new 12-word English seed phrase and derive the default keypair.
///
/// # Example
///
/// ```
/// use wallet_kit::model::KeyPair;
/// use wallet_kit::derive_keypair::create_wallet;
///
/// let keypair = create_wallet().unwrap();
/// assert_eq!(keypair.pubkey(), "B365555555555555555555555555555555555555555555555555555555555555");
/// ```
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
