use bip39::Mnemonic;
use log::debug;
use solana_sdk::derivation_path::DerivationPath;
use solana_sdk::signer::keypair::keypair_from_seed_and_derivation_path;
use solana_sdk::signer::keypair::Keypair;
use std::str::FromStr;

/// Derives a Solana keypair from a mnemonic, account, and change index.
/// Returns Result<Keypair, String>
pub fn derive_keypair(mnemonic_phrase: &str, account: u32, change: u32) -> Result<Keypair, String> {
    let mnemonic =
        Mnemonic::from_str(mnemonic_phrase).map_err(|e| format!("Invalid mnemonic: {:?}", e))?;
    let seed = bip39::Mnemonic::to_seed(&mnemonic, "");
    let derivation_path = DerivationPath::new_bip44(Some(account), Some(change));
    debug!("Deriving keypair: {:?}", derivation_path);
    keypair_from_seed_and_derivation_path(&seed, Some(derivation_path))
        .map_err(|e| format!("Keypair derivation failed: {:?}", e))
}

/// Overload: default change = 0
pub fn derive_keypair_default(mnemonic_phrase: &str, account: u32) -> Result<Keypair, String> {
    derive_keypair(mnemonic_phrase, account, 0)
}
