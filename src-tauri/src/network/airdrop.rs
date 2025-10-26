use {
    crate::{
        constants::network::DEPLOY_KEY,
        model::{
            airdrop::{AirdropRequest, AirdropResponse},
            settings_debug::AirdropEnvironment,
        },
    },
    reqwest::Client,
    smbcloud_wallet_core_network::{model::ErrorResponse, request},
};

pub async fn airdrop(
    environment: AirdropEnvironment,
    pubkey: String,
    signature: String,
) -> Result<AirdropResponse, ErrorResponse> {
    let req_body = AirdropRequest {
        pubkey: &pubkey,
        signature: &signature,
        deploy_key: DEPLOY_KEY,
    };

    let url = format!("{}/api/v1/airdrop", environment.base_url());
    let client = Client::new();
    let builder = client.post(&url).json(&req_body);
    request(builder).await
}
