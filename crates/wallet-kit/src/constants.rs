use tsync::tsync;

pub const LAMPORTS_PER_SOL: f64 = 1_000_000_000.0;
pub const SEMITONE_PER_BACH: f64 = 1_000_000_000_000.0;

/// The Stable Foundation
#[tsync]
pub const THE_STABLE_FOUNDATION_ADDRESS: &str = "9DWkPYFKcjpGVjwCjgAnYM8T6H4hssEnW27rLDtfU8y5";
#[tsync]
pub const THE_STABLE_FOUNDATION_TREASURY_ADDRESS: &str =
    "3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3";
pub const PLATFORM_FEE_BPS: u16 = 10;
pub const FEE_ACCOUNT: &str = THE_STABLE_FOUNDATION_TREASURY_ADDRESS;
#[tsync]
pub const SPL_TOKEN_PROGRAM_ID: &str = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

/// Jupiter Aggregator
pub const JUPITER_BASE_URL: &str = "https://lite-api.jup.ag/";
pub const JUPITER_SWAP_QUOTE_PATH: &str = "swap/v1/quote";
pub const JUPITER_SWAP_PATH: &str = "swap/v1/swap";
pub const JUPITER_PRICE_PATH: &str = "price/v3";

/// Birdeye
pub const BIRDEYE_API_KEY: &str = "YOUR_API_KEY_HERE";
pub const BIRDEYE_BASE_URL: &str = "https://public-api.birdeye.so/";
pub const BIRDEYE_PRICE_PATH: &str = "defi/price";

/// Network request
#[cfg(debug_assertions)]
pub const USER_AGENT: &str = "NotWallet Crypto Debug";
#[cfg(not(debug_assertions))]
pub const USER_AGENT: &str = "NotWallet Crypto";
