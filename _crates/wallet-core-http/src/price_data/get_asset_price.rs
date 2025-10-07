use {
    log::debug,
    reqwest::Client,
    smbcloud_wallet_constants::constants::{
        BIRDEYE_API_KEY, BIRDEYE_BASE_URL, BIRDEYE_PRICE_PATH, USER_AGENT,
    },
    smbcloud_wallet_core_model::models::birdeye_price_response::BirdeyePriceResponse,
    smbcloud_wallet_core_network::{model::ErrorResponse, request},
};

pub async fn get_asset_price(asset: &str) -> Result<BirdeyePriceResponse, ErrorResponse> {
    debug!("Get asset price");

    let url = format!(
        "{}{}?address={}",
        BIRDEYE_BASE_URL, BIRDEYE_PRICE_PATH, asset
    );
    println!("🦀🦀  URL: {}", url);
    let client = Client::new()
        .get(url)
        .header("X-API-KEY", BIRDEYE_API_KEY)
        .header("User-Agent", USER_AGENT);
    request(client).await
}
