use {
    crate::price_data::get_asset_price::get_asset_price,
    constants::constants::SOLANA,
    network::model::{ErrorCode::BalanceError, ErrorResponse},
};

pub async fn get_sol_price() -> Result<f64, ErrorResponse> {
    match get_asset_price(SOLANA).await {
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
