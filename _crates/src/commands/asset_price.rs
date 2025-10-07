use {
    crate::models::keypair::KeyPairError,
    smbcloud_wallet_core_http::price_data::get_asset_price::get_asset_price,
};

#[uniffi::export(async_runtime = "tokio")]
pub async fn asset_price(asset: String) -> Result<f64, KeyPairError> {
    match get_asset_price(&asset).await {
        Ok(response) => Ok(response.data.value),
        Err(error) => Err(KeyPairError::AssetPrice(error.to_string())),
    }
}
