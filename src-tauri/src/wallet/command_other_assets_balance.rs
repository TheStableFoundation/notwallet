use {
    crate::constants::rpc::rpc_url,
    log::info,
    smbcloud_wallet_kit::{balance::other_assets_balance, models::asset::AssetBalance},
    smbcloud_wallet_core_network::model::ErrorResponse,
    tauri::command,
};

#[command]
pub async fn get_other_assets_balance(pubkey: String) -> Result<Vec<AssetBalance>, ErrorResponse> {
    info!("Getting wallet balance for {}", pubkey);
    other_assets_balance(rpc_url(), pubkey).await
}
