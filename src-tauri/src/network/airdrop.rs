use {
    crate::{
        constants::network::API_BASE_URL,
        model::airdrop::{AirdropRequest, AirdropResponse},
    },
    reqwest::Client,
    smbcloud_wallet_core_network::{model::ErrorResponse, request},
};

pub async fn airdrop(pubkey: String, signature: String) -> Result<AirdropResponse, ErrorResponse> {
    let req_body = AirdropRequest {
        pubkey: &pubkey,
        signature: &signature,
        deploy_key: "your_deploy_key",
    };

    let url = format!("{}/api/v1/airdrop", API_BASE_URL);
    let client = Client::new();
    let builder = client.post(&url).json(&req_body);
    request(builder).await
}
