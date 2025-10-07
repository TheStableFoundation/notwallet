use {
    crate::constants::{
        network::{BIRDEYE_API_KEY, USER_AGENT},
        rpc::rpc_url,
    },
    log::info,
    smbcloud_wallet_core_network::model::ErrorResponse,
    smbcloud_wallet_kit::{balance::wallet_balance, models::currency::FiatCurrency},
    tauri::command,
};

#[command]
pub async fn get_wallet_balance(pubkey: String) -> Result<String, ErrorResponse> {
    info!("Getting wallet balance for {}", pubkey);
    wallet_balance(
        rpc_url(),
        BIRDEYE_API_KEY,
        USER_AGENT,
        pubkey,
        Some(FiatCurrency::USD),
    )
    .await
}
