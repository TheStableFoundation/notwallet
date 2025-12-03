use smbcloud_model::{
    error_codes::ErrorResponse,
    oauth::{OauthRedirect, TokenResponse},
};

#[tauri::command]
pub async fn get_token(oauth_redirect: OauthRedirect) -> Result<TokenResponse, ErrorResponse> {
    let client_id = dotenv!("GOOGLE_OAUTH_CLIENT_ID").to_string();
    let client_secret = dotenv!("GOOGLE_OAUTH_CLIENT_SECRET").to_string();
    smbcloud_networking_account::oauth::get_token::get_token(
        oauth_redirect,
        client_id,
        client_secret,
    )
    .await
}
