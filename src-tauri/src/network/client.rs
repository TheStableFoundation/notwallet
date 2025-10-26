use {
    crate::{
        constants::network::DEPLOY_KEY,
        model::{
            client::{ClientApp, ClientInfoPayload, RegisterClientResponse},
            settings_debug::AirdropEnvironment,
        },
    },
    log::debug,
    reqwest::Client,
    smbcloud_wallet_core_network::{
        model::{ErrorCode, ErrorResponse},
        request,
    },
};

/// Send client information to the server
pub(crate) async fn send_client_info(
    environment: AirdropEnvironment,
    client_info: &ClientInfoPayload,
) -> Result<RegisterClientResponse, ErrorResponse> {
    if client_info.app == ClientApp::Splitfire {
        return Err(ErrorResponse::Error {
            code: ErrorCode::ParseError,
            message: "Only NotWallet clients are allowed.".to_string(),
        });
    }
    // API endpoint
    let url = format!(
        "{}/api/v1/setup-client?deploy_key={}",
        environment.base_url(),
        DEPLOY_KEY
    );
    debug!("Sending client info to {}", url);
    let builder = Client::new().post(url).json(client_info);
    request(builder).await
}
