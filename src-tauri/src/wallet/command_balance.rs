use {
    crate::constants::rpc::rpc_url, log::info, network::model::ErrorResponse, tauri::command,
    wallet_kit::balance::wallet_balance, wallet_kit::models::currency::FiatCurrency,
};

#[command]
pub async fn get_wallet_balance(pubkey: String) -> Result<String, ErrorResponse> {
    info!("Getting wallet balance for {}", pubkey);
    wallet_balance(rpc_url(), pubkey, Some(FiatCurrency::USD)).await
}
