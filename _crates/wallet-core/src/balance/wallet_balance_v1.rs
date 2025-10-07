use {
    crate::balance::wallet_token_list::wallet_token_list,
    smbcloud_wallet_core_http::price_data::get_asset_price::get_asset_price,
    smbcloud_wallet_core_network::model::ErrorResponse,
};

pub async fn wallet_balance(
    rpc_url: String,
    api_key: &str,
    user_agent: &str,
    pubkey: String,
) -> Result<String, ErrorResponse> {
    // Get all assets for the given pubkey
    let token_list = match wallet_token_list(rpc_url, pubkey).await {
        Ok(list) => list,
        Err(_) => return Ok(format!("{}{:.2}", "$", 0)),
    };

    println!("🦀🦀  Assets with balance: {:?}", token_list);

    let mut total_asset_value = 0.0;
    for token in token_list {
        // Get the asset value from the current Balance.
        let asset_price = match get_asset_price(&token.meta.address, api_key, user_agent).await {
            Ok(price) => price.data.value,
            Err(_) => continue,
        };
        total_asset_value += token.ui_amount * asset_price;
    }

    println!("🦀🦀  Assets value is {:?} USD", total_asset_value);

    Ok(format!("{}{:.2}", "$", total_asset_value))
}
