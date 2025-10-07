use {
    crate::balance::wallet_token_list::wallet_token_list,
    smbcloud_wallet_core_http::price_data::get_asset_price::get_asset_price,
    smbcloud_wallet_core_network::model::ErrorResponse, std::time::Duration, tokio::time::sleep,
};

pub async fn wallet_balance(
    rpc_url: String,
    api_key: &str,
    user_agent: &str,
    pubkey: String,
) -> Result<String, ErrorResponse> {
    // Get all assets for the given pubkey
    let assets_balance = match wallet_token_list(rpc_url, pubkey).await {
        Ok(list) => list,
        Err(_) => return Ok(format!("{}{:.2}", "$", 0)),
    };

    println!("🦀🦀  SPL tokens with balance: {:?}", assets_balance);

    let mut total_asset_value = 0.0;
    for asset_balance in assets_balance {
        // Get the asset value from the current Balance.
        // Bypass too many request error from BirdEye 😂
        sleep(Duration::from_millis(800)).await;
        let asset_value =
            match get_asset_price(&asset_balance.meta.address, api_key, user_agent).await {
                Ok(price) => price.data.value,
                Err(_) => continue,
            };
        total_asset_value += asset_value;
    }

    println!("🦀🦀  Assets value is {:?} USD", total_asset_value);

    Ok(format!("{}{:.2}", "$", total_asset_value))
}
