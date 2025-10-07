#[cfg(debug_assertions)]
pub const API_BASE_URL: &str = "https://localhost:3001";
#[cfg(not(debug_assertions))]
pub const API_BASE_URL: &str = "your_api_base_url";

/// Birdeye
pub const BIRDEYE_API_KEY: &str = "YOUR_API_KEY_HERE";

/// Network request
#[cfg(debug_assertions)]
pub const USER_AGENT: &str = "NotWallet Crypto Debug";
#[cfg(not(debug_assertions))]
pub const USER_AGENT: &str = "NotWallet Crypto";
