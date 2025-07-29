use crate::setup::{client::setup_client, store::setup_store};
use log::info;
use tauri::{App, Manager};

mod client;
pub(crate) mod commands;
mod store;

pub(crate) fn setup(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    let app_data_dir = app
        .path()
        .app_local_data_dir()
        .expect("Could not resolve app local data path");

    info!("App local data dir: {:?}", app_data_dir);
    setup_store(app)?;
    setup_client(app)?;
    Ok(())
}
