use {
    crate::{
        model::{airdrop::CheckPubkeyResponse, settings_debug::AirdropEnvironment},
        network::check_pubkey::check_pubkey as network_check_pubkey,
    },
    log::debug,
    smbcloud_wallet_core_network::model::ErrorResponse,
    tauri::command,
};

#[command]
pub async fn check_pubkey(
    environment: AirdropEnvironment,
    pubkey: String,
) -> Result<CheckPubkeyResponse, ErrorResponse> {
    debug!("Check pubkey {}", pubkey);
    network_check_pubkey(environment, &pubkey).await
}
