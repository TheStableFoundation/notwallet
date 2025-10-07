use {
    crate::model::airdrop::CheckPubkeyResponse,
    crate::network::check_pubkey::check_pubkey as network_check_pubkey, log::debug,
    smbcloud_wallet_core_network::model::ErrorResponse, tauri::command,
};

#[command]
pub async fn check_pubkey(pubkey: String) -> Result<CheckPubkeyResponse, ErrorResponse> {
    debug!("Check pubkey {}", pubkey);
    network_check_pubkey(&pubkey).await
}
