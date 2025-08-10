use crate::constants::network::API_BASE_URL;
use crate::model::airdrop::{AirdropRequest, AirdropResponse};
use network::{model::ErrorResponse, request};
use reqwest::Client;

pub async fn airdrop(pubkey: String, signature: String) -> Result<AirdropResponse, ErrorResponse> {
    let req_body = AirdropRequest {
        pubkey: &pubkey,
        signature: &signature,
    };

    let url = format!("{}/api/v1/airdrop", API_BASE_URL);
    let client = Client::new();
    let builder = client.post(&url).json(&req_body);
    request(builder).await
}
