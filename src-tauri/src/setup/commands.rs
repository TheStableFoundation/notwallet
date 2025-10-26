use {
    crate::{
        constants::store::store,
        model::{
            client::{ClientApp, ClientInfoPayload},
            settings_debug::AirdropEnvironment,
        },
        network::client::send_client_info,
        setup::client::INSTALLATION_ID_KEY,
    },
    log::{error, info},
    tauri::{command, AppHandle, Manager},
    tauri_plugin_os::{platform, version},
};

#[command]
pub async fn get_installation_id(app: AppHandle) -> Result<String, String> {
    let store_result = store(&app);
    match store_result {
        Ok(store) => {
            // Check if installation_id exists
            if let Some(id) = store.get(INSTALLATION_ID_KEY) {
                info!("Found existing installation ID");
                return Ok(id.as_str().unwrap_or_default().to_string());
            }
            Err("No go".to_string())
        }
        Err(err) => {
            error!("Failed to get installation ID: {}", err);
            Err(err.to_string())
        }
    }
}

#[command]
pub async fn register_client(
    app: AppHandle,
    environment: AirdropEnvironment,
) -> Result<(), String> {
    let store_result = store(&app);

    let store = match store_result {
        Ok(store) => store,
        Err(e) => {
            error!("Failed to get store: {:?}", e);
            return Err(e.to_string());
        }
    };

    // Check if installation_id exists
    let installation_id = if let Some(id) = store.get(INSTALLATION_ID_KEY) {
        info!("Found existing installation ID.");
        id.as_str().unwrap_or_default().to_string()
    } else {
        // Panic!
        return Err("No installation ID found.".to_string());
    };

    // Print information separately:
    println!("Type: {}", platform());
    println!("Version: {}", version());

    // Create client info with simple fields as requested
    let client_info = ClientInfoPayload {
        uuid: installation_id,
        app: ClientApp::NotWallet,
        os_name: platform().to_string(),
        os_version: version().to_string(),
        app_version: app.app_handle().package_info().version.to_string(),
    };

    // Log client registration
    info!(
        "Registering client: os={}, version={}, app_version={}, uuid={}",
        client_info.os_name, client_info.os_version, client_info.app_version, client_info.uuid
    );

    // Register with the server in a separate task
    let client_info_clone = client_info.clone();
    match send_client_info(environment, &client_info_clone).await {
        Ok(response) => {
            info!("Client registered successfully: {:?}", response);
            Ok(())
        }
        Err(e) => {
            error!("Failed to register client: {}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub fn is_debug() -> bool {
    cfg!(debug_assertions)
}
