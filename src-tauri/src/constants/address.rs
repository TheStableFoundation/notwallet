use tsync::tsync;

/// Solana
#[tsync]
pub const SOLANA_MINT_ACCOUNT: &str = "So11111111111111111111111111111111111111112";
pub const SPL_TOKEN_PROGRAM_ID: &str = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

/// The Stable Foundation
/// Mainnet Bach Token Address
#[cfg(not(debug_assertions))]
pub const BACH_TOKEN_ADDRESS_MAINNET: &str = "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf";
/// Testnet Bach Token Address
#[cfg(debug_assertions)]
pub const BACH_TOKEN_ADDRESS_TESTNET: &str = "A6a2s9LTZcYZQgxrDatLHYfvHhJEfb5ZWuFENhHtxJtR";

/// Bach Token Address (exports the correct address based on build mode)
#[tsync]
#[cfg(not(debug_assertions))]
pub const BACH_TOKEN_ADDRESS: &str = BACH_TOKEN_ADDRESS_MAINNET;

#[tsync]
#[cfg(debug_assertions)]
pub const BACH_TOKEN_ADDRESS: &str = BACH_TOKEN_ADDRESS_TESTNET;

pub const BACH_TOKEN_ADDRESS_LOCAL: &str = "your_local_token_address";
