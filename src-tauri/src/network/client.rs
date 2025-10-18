use {
    crate::constants::network::API_BASE_URL,
    crate::model::client::{ClientApp, ClientInfoPayload, RegisterClientResponse},
    reqwest::Client,
    smbcloud_wallet_core_network::{
        model::{ErrorCode, ErrorResponse},
        request,
    },
};

/// Send client information to the server
pub(crate) async fn send_client_info(
    client_info: &ClientInfoPayload,
) -> Result<RegisterClientResponse, ErrorResponse> {
    if client_info.app == ClientApp::Splitfire {
        return Err(ErrorResponse::Error {
            code: ErrorCode::ParseError,
            message: "Only NotWallet clients are allowed.".to_string(),
        });
    }
    // API endpoint
    let url = format!("{}/api/v1/setup-client", API_BASE_URL);
    let builder = Client::new().post(url).json(client_info);
    request(builder).await
}
