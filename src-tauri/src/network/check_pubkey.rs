use crate::constants::network::API_BASE_URL;
use crate::model::airdrop::CheckPubkeyResponse;
use reqwest::Client;
use smbcloud_wallet_core_network::{model::ErrorResponse, request};

pub(crate) async fn check_pubkey(pubkey: &str) -> Result<CheckPubkeyResponse, ErrorResponse> {
    let url = format!(
        "{}/api/v1/onboarding/check-pubkey?pubkey={}",
        API_BASE_URL, pubkey
    );
    let builder = Client::new().get(&url);
    request(builder).await
}
