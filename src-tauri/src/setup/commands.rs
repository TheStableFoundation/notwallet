use crate::constants::store::store;
use crate::setup::client::INSTALLATION_ID_KEY;
use log::{error, info};
use tauri::{command, AppHandle};

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
