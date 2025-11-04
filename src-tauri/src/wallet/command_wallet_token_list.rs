use {
    crate::{
        constants::network::{USER_AGENT, XLP_API_KEY},
        model::settings_debug::XlpEnvironment,
    },
    log::info,
    smbcloud_wallet_core_http::xlp::get_wallet_assets_balance::wallet_token_list,
    smbcloud_wallet_core_model::models::{balance_v1::BalanceV1, environment::Environment},
    smbcloud_wallet_core_network::model::ErrorResponse,
    tauri::command,
};

#[command]
pub async fn get_wallet_assets_balance(
    environment: XlpEnvironment,
    network: Environment,
    pubkey: String,
) -> Result<Vec<BalanceV1>, ErrorResponse> {
    info!("Getting wallet assets balance for {}", pubkey);
    match wallet_token_list(
        environment.base_url(),
        network,
        &pubkey,
        XLP_API_KEY,
        USER_AGENT,
    )
    .await
    {
        Ok(balance) => Ok(balance.data),
        Err(err) => return Err(err),
    }
}
