use {
    reqwest::Client,
    smbcloud_wallet_constants::constants::XLP_WALLET_BALANCE_PATH,
    smbcloud_wallet_core_model::models::xlp::WalletBalanceResponse,
    smbcloud_wallet_core_network::{model::ErrorResponse, request},
};

pub async fn wallet_balance(
    base_url: &str,
    environment: &str,
    wallet_address: &str,
    api_key: &str,
    user_agent: &str,
) -> Result<WalletBalanceResponse, ErrorResponse> {
    println!("🦀🦀  Get asset price");

    let url = format!(
        "{}{}?wallet={}&environment={}",
        base_url, XLP_WALLET_BALANCE_PATH, wallet_address, environment
    );
    println!("🦀🦀  URL: {}", url);
    let client = Client::new()
        .get(url)
        .header("X-API-KEY", api_key)
        .header("x-chain", "Solana")
        .header("User-Agent", user_agent);

    request(client).await
}
