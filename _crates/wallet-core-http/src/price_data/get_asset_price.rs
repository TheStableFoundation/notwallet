use {
    reqwest::Client,
    smbcloud_wallet_constants::constants::{BIRDEYE_BASE_URL, BIRDEYE_PRICE_PATH},
    smbcloud_wallet_core_model::models::birdeye_price_response::BirdeyePriceResponse,
    smbcloud_wallet_core_network::{model::ErrorResponse, request},
    std::time::Duration,
    tokio::time::sleep,
};

pub async fn get_asset_price(
    asset: &str,
    api_key: &str,
    user_agent: &str,
) -> Result<BirdeyePriceResponse, ErrorResponse> {
    println!("🦀🦀  Get asset price");

    let url = format!(
        "{}{}?address={}",
        BIRDEYE_BASE_URL, BIRDEYE_PRICE_PATH, asset
    );
    println!("🦀🦀  URL: {}", url);
    let client = Client::new()
        .get(url)
        .header("X-API-KEY", api_key)
        .header("User-Agent", user_agent);

    // Bypass too many request error from BirdEye 😂
    sleep(Duration::from_millis(800)).await;
    request(client).await
}
