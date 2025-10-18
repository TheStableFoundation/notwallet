use {
    crate::price_data::get_asset_price::get_asset_price,
    smbcloud_wallet_constants::constants::SOLANA,
    smbcloud_wallet_core_network::model::{ErrorCode::BalanceError, ErrorResponse},
};

pub async fn get_sol_price(api_key: &str, user_agent: &str) -> Result<f64, ErrorResponse> {
    match get_asset_price(SOLANA, api_key, user_agent).await {
        Ok(price) => {
            println!("🦀🦀  Got SOL price data: {:?}", price);
            if price.is_valid() {
                Ok(price.data.value)
            } else {
                Err(ErrorResponse::Error {
                    code: BalanceError,
                    message: "No price data available".to_string(),
                })
            }
        }
        Err(err) => {
            println!("🦀🦀  Failed to get SOL price: {:?}", err);
            Err(err)
        }
    }
}
