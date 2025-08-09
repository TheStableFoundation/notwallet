use crate::constants::network::API_BASE_URL;
use serde::Serialize;

#[derive(Serialize)]
struct AirdropRequest<'a> {
    pubkey: &'a str,
    signature: &'a str,
}

pub async fn airdrop(pubkey: String, signature: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let req_body = AirdropRequest {
        pubkey: &pubkey,
        signature: &signature,
    };

    let url = format!("{}/api/v1/airdrop", API_BASE_URL);
    let resp = client
        .post(&url)
        .json(&req_body)
        .send()
        .await
        .map_err(|e| format!("Network error: {:?}", e))?;

    let status = resp.status();
    let text = resp
        .text()
        .await
        .map_err(|e| format!("Read error: {:?}", e))?;

    if status.is_success() {
        Ok(text)
    } else {
        Err(format!("Airdrop failed: {} - {}", status, text))
    }
}
