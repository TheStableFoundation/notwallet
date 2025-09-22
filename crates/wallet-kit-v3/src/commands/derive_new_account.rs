use {
    crate::models::{keypair::KeyPairError, wallet::Wallet},
    bs58::encode,
    solana_sdk::signer::Signer,
    uuid::Uuid,
    wallet_core::derive_keypair::derive_keypair,
};

#[uniffi::export]
pub fn derive_new_account(
    seed_id: String,
    mnemonic_phrase: &str,
    account: u32,
) -> Result<Wallet, KeyPairError> {
    match derive_keypair(mnemonic_phrase, account, 0) {
        Ok(keypair) => {
            let pubkey = keypair.pubkey().to_string();
            let privkey = encode(keypair.to_bytes()).into_string();
            let wallet = Wallet {
                id: Uuid::new_v4().to_string(),
                username: None,
                name: format!("Account {}", account),
                account: account,
                pubkey: pubkey,
                privkey: privkey,
                seed_id: seed_id.clone(),
            };

            Ok(wallet)
        }
        Err(e) => Err(KeyPairError::MnemonicError(e.to_string())),
    }
}
