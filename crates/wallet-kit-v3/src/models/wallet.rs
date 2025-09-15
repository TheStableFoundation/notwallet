#[derive(uniffi::Record)]
pub struct Wallet {
    /// The unique identifier for the wallet, typically a UUID.
    /// This ID is used to reference the wallet in various operations.
    pub id: String,
    /// The unique username of the wallet that is human-readable.
    pub username: Option<String>,
    /// The name of the wallet, which is a human-readable identifier.
    /// This can be used to differentiate between multiple wallets.
    pub name: String,
    /// The account index for the wallet, typically used in Solana to differentiate between multiple accounts.
    /// This is usually 0 for the first account.
    /// In the context of Solana, this is often referred to as the "account" index.
    pub account: u32,
    /// The public key of the wallet, represented as a base58-encoded string.
    /// This key is used to receive funds and is shared publicly.
    /// In Solana, this is often referred to as the "public key" or "address".
    pub pubkey: String,
    /// The private key of the wallet, represented as a base58-encoded string.
    /// This key is used to sign transactions and should be kept secret.
    /// In Solana, this is often referred to as the "private key
    pub privkey: String,
    /// The UUID of the seed that this keypair is derived from.
    pub seed_id: String,
}
