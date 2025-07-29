mod constants;
mod model;
mod network;
mod setup;
mod wallet;

use crate::{
    setup::{commands::get_installation_id, setup},
    wallet::{
        check_pubkey::check_pubkey,
        commands::{
            derive_next_keypair, get_bach_balance, get_token_info, onboarding_create_wallet,
        },
        import_wallet::{derive_new_keypair, import_solana_wallet},
        set_active_keypair::set_active_keypair,
        sign::sign_message,
    },
};
use tauri_plugin_log::fern::colors::{Color, ColoredLevelConfig};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(
            tauri_plugin_log::Builder::default()
                .with_colors(
                    ColoredLevelConfig::default()
                        .debug(Color::Green)
                        .info(Color::Cyan),
                )
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_haptics::init())
        .setup(|app| setup(app))
        .invoke_handler(tauri::generate_handler![
            onboarding_create_wallet,
            import_solana_wallet,
            derive_new_keypair,
            derive_next_keypair,
            sign_message,
            check_pubkey,
            set_active_keypair,
            get_installation_id,
            get_bach_balance,
            get_token_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
