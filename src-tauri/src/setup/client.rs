use {
    crate::constants::store::store,
    log::{error, info},
    tauri::App,
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
    if let Some(id) = store.get(INSTALLATION_ID_KEY) {
        info!(
            "Found existing installation ID: {}",
            id.as_str().unwrap_or_default()
        );
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
    };
    // Return success immediately, as the registration happens in the background
    Ok(())
}
