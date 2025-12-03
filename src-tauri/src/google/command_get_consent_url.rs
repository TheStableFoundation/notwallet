#[tauri::command]
pub async fn get_consent_url(redirect_uri: String) -> String {
    let client_id = dotenv!("GOOGLE_OAUTH_CLIENT_ID").to_string();
    smbcloud_networking_account::oauth::get_consent_url::get_consent_url(client_id, redirect_uri)
}
