/// Network request
#[cfg(debug_assertions)]
pub const USER_AGENT: &str = "NotWallet Crypto Debug";
#[cfg(not(debug_assertions))]
pub const USER_AGENT: &str = "NotWallet Crypto";
