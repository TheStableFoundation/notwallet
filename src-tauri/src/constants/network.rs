#[cfg(debug_assertions)]
pub const API_BASE_URL: &str = "https://localhost:3001";
#[cfg(not(debug_assertions))]
pub const API_BASE_URL: &str = "your_api_base_url";
