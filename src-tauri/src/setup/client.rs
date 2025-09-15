use {
    crate::{
        constants::store::store,
        model::client::{ClientApp, ClientInfoPayload},
        network::client::send_client_info,
    },
    log::{error, info},
    tauri::{async_runtime, App},
    uuid::Uuid,
};

pub const INSTALLATION_ID_KEY: &str = "installation_id";

/// Register the client with the server.
/// - Checks if we already have an installation_id in the store
/// - Only creates a new one if none exists
/// - Starts a task to send client information to the server
pub fn setup_client(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    let store_result = store(app.handle());

    let store = match store_result {
        Ok(store) => store,
        Err(e) => {
            error!("Failed to get store: {:?}", e);
            return Err(Box::new(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("Failed to get store: {:?}", e),
            )));
        }
    };

    // Check if installation_id exists
    let installation_id = if let Some(id) = store.get(INSTALLATION_ID_KEY) {
        info!("Found existing installation ID");
        id.as_str().unwrap_or_default().to_string()
    } else {
        // Generate a new UUID if none exists
        let new_id = Uuid::new_v4().to_string();
        info!("Generated new installation ID: {}", new_id);

        // Save the new installation ID
        store.set(INSTALLATION_ID_KEY, serde_json::json!(new_id.clone()));

        // Save the store and handle the result
        if let Err(e) = store.save() {
            error!("Failed to persist store: {:?}", e);
            return Err(Box::new(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("Failed to persist store: {:?}", e),
            )));
        }
        info!("Installation ID saved successfully.");

        new_id
    };

    // Get OS information
    let info = os_info::get();

    // Print full information:
    println!("OS information: {info}");

    // Print information separately:
    println!("Type: {}", info.os_type());
    println!("Version: {}", info.version());

    // Simple device information with straightforward platform detection
    // For a production app, you might want to implement more sophisticated
    // device detection using platform-specific APIs

    // Create client info with simple fields as requested
    let client_info = ClientInfoPayload {
        uuid: installation_id,
        app: ClientApp::NotWallet,
        os_name: info.os_type().to_string(),
        os_version: info.version().to_string(),
        app_version: app.handle().package_info().version.to_string(),
    };

    // Log client registration
    info!(
        "Registering client: os={}, version={}, app_version={}, uuid={}",
        client_info.os_name, client_info.os_version, client_info.app_version, client_info.uuid
    );

    // Register with the server in a separate task
    let client_info_clone = client_info.clone();
    async_runtime::spawn(async move {
        match send_client_info(&client_info_clone).await {
            Ok(response) => {
                info!("Client registered successfully: {:?}", response);
            }
            Err(e) => {
                error!("Failed to register client: {}", e);
            }
        }
    });

    // Return success immediately, as the registration happens in the background
    Ok(())
}
