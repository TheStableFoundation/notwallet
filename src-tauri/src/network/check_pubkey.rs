use crate::constants::network::API_BASE_URL;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct CheckPubkeyResponse {
    pub exists: bool,
    // Add more fields if needed
    pub user_id: Option<i32>,
}

pub async fn check_pubkey(pubkey: &str) -> Result<CheckPubkeyResponse, String> {
    let url = format!(
        "{}/api/v1/onboarding/check-pubkey?pubkey={}",
        API_BASE_URL, pubkey
    );
    let resp = reqwest::get(&url)
        .await
        .map_err(|e| format!("Network error: {:?}", e))?;

    let status = resp.status();
    let text = resp
        .text()
        .await
        .map_err(|e| format!("Read error: {:?}", e))?;

    println!("check_pubkey raw response: {}", text);

    if status.is_success() {
        serde_json::from_str::<CheckPubkeyResponse>(&text)
            .map_err(|e| format!("Parse error: {:?}", e))
    } else {
        Err(format!("Check pubkey failed: {} - {}", status, text))
    }
}
