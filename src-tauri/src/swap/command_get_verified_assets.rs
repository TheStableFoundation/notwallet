use {
    smbcloud_wallet_core_model::models::asset_solana::SolanaAsset,
    smbcloud_wallet_core_network::model::ErrorResponse, tauri::command,
};

#[command]
pub async fn get_verified_assets() -> Result<Vec<SolanaAsset>, ErrorResponse> {
    Ok(SolanaAsset::verified_assets())
}
