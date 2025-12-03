use smbcloud_model::{error_codes::ErrorResponse, oauth::UserInfo};

#[tauri::command]
pub async fn get_profile(access_token: String) -> Result<UserInfo, ErrorResponse> {
    smbcloud_networking_account::oauth::get_profile::get_profile(access_token).await
}
