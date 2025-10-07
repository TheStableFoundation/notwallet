use {
    crate::constants::rpc::rpc_url, log::info, smbcloud_wallet_kit::balance::wallet_balance,
    smbcloud_wallet_kit::models::currency::FiatCurrency,
    smbcloud_wallet_core_network::model::ErrorResponse, tauri::command,
};

#[command]
pub async fn get_wallet_balance(pubkey: String) -> Result<String, ErrorResponse> {
    info!("Getting wallet balance for {}", pubkey);
    wallet_balance(rpc_url(), pubkey, Some(FiatCurrency::USD)).await
}
