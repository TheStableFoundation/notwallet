use {
    bip39::{Language, Mnemonic},
    log::debug,
};

pub fn create_seed_phrase(
    language: Option<Language>,
    length: Option<usize>,
) -> Result<Mnemonic, String> {
    debug!("Starting Solana wallet creation");

    let language = language.unwrap_or(Language::English);
    let length = length.unwrap_or(12);

    // Generate a new 12-word mnemonic
    let mnemonic = Mnemonic::generate_in(language, length)
        .map_err(|e| format!("Mnemonic generation failed: {:?}", e))?;

    Ok(mnemonic)
}
