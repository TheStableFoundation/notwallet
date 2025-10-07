use {
    crate::model::airdrop::CheckPubkeyResponse,
    crate::network::check_pubkey::check_pubkey as network_check_pubkey, log::debug, tauri::command,
    wallet_network::model::ErrorResponse,
};

#[command]
pub async fn check_pubkey(pubkey: String) -> Result<CheckPubkeyResponse, ErrorResponse> {
    debug!("Check pubkey {}", pubkey);
    network_check_pubkey(&pubkey).await
}
