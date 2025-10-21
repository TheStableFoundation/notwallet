use {
    crate::constants::store::store,
    log::{error, info},
    tauri::App,
};

/// We need to setup the debug store regardless so we
/// can switch environment during runtime.
pub fn setup_store(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    match store(app.handle()) {
        Ok(_) => {
            info!("Store loaded successfully.");
        }
        Err(e) => {
            error!("Error setting up store: {:?}", e);
        }
    };
    Ok(())
}
