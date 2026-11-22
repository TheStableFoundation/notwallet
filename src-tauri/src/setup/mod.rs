use {
    crate::setup::{
        client::setup_client, setup_application_filesystem::setup_application_filesystem,
        store::setup_store,
    },
    log::info,
    tauri::{App, Manager},
};

mod client;
pub(crate) mod commands;
mod store;
pub(crate) mod command_start_server;
pub(crate) mod setup_application_filesystem;

pub(crate) fn setup(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    let app_data_dir = app
        .path()
        .app_local_data_dir()
        .expect("Could not resolve app local data path");

    info!("App local data dir: {:?}", app_data_dir);

    // Amethyst (AI Chat) runs fully on-device. Disable onde's pulse
    // telemetry and redirect the chat model's HuggingFace cache into the
    // shared App Group container. Must run before any onde / hf-hub code,
    // i.e. before the chat ENGINE lazily initialises.
    std::env::set_var("ONDE_DISABLE_PULSE", "1");
    setup_application_filesystem(app)?;

    setup_store(app)?;
    setup_client(app)?;
    Ok(())
}
