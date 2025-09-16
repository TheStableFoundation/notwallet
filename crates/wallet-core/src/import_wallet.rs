use {crate::derive_keypair::derive_keypair_default, solana_sdk::signature::Signer};

pub fn import_solana_wallet(mnemonic_phrase: String) -> Result<(String, String), String> {
    // Derive keypair using the helper function (default account 0, change 0)
    let keypair = derive_keypair_default(&mnemonic_phrase, 0)?;

    let pubkey = keypair.pubkey().to_string();
    let privkey = bs58::encode(keypair.to_bytes()).into_string();

    Ok((pubkey, privkey))
}
