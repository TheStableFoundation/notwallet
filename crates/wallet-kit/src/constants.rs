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
pub const FEE_ACCOUNT: u16 = 10;

/// Jupiter Aggregator
pub const JUPITER_BASE_URL: &str = "https://lite-api.jup.ag/";
pub const JUPITER_SWAP_QUOTE_PATH: &str = "swap/v1/quote";
pub const JUPITER_SWAP_PATH: &str = "swap/v1/swap";
