use {
    crate::{
        constants::network::{USER_AGENT, XLP_API_KEY},
        model::settings_debug::XlpEnvironment,
    },
    log::info,
    smbcloud_wallet_core_http::xlp::get_wallet_balance::wallet_balance,
    smbcloud_wallet_core_model::models::environment::Environment,
    smbcloud_wallet_core_network::model::ErrorResponse,
    tauri::command,
};

#[command]
pub async fn get_wallet_balance(
    environment: XlpEnvironment,
    network: Environment,
    pubkey: String,
) -> Result<String, ErrorResponse> {
    info!("Getting wallet balance for {}", pubkey);
    match wallet_balance(
        environment.base_url(),
        network,
        &pubkey,
        XLP_API_KEY,
        USER_AGENT,
    )
    .await
    {
        Ok(balance) => Ok(balance.value),
        Err(err) => return Err(err),
    }
}
