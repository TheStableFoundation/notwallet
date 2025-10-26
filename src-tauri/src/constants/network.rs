pub const API_BASE_URL_LOCAL: &str = "https://localhost:3001";
pub const API_BASE_URL: &str = "your_api_base_url";
pub const DEPLOY_KEY: &str = "your_deploy_key_here";

/// Birdeye
pub const BIRDEYE_API_KEY: &str = "YOUR_API_KEY_HERE";

/// Network request
#[cfg(debug_assertions)]
pub const USER_AGENT: &str = "NotWallet Crypto Debug";
#[cfg(not(debug_assertions))]
pub const USER_AGENT: &str = "NotWallet Crypto";
