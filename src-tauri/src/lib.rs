mod constants;
mod model;
mod network;
mod onramp;
mod setup;
mod swap;
mod wallet;

use {
    crate::{
        onramp::commands::onramp_session,
        setup::{commands::get_installation_id, setup},
        swap::commands::{build_swap_transaction, get_swap_quote, send_swap_transaction},
        wallet::{
            check_pubkey::check_pubkey,
            commands::{
                derive_next_keypair, get_all_keypairs, get_bach_balance, get_sol_balance,
                get_token_info, get_treasury_bach_balance, get_treasury_sol_balance,
                onboarding_create_wallet, send_token, update_username,
            },
            import_wallet::{derive_new_keypair, import_solana_wallet},
            set_active_keypair::set_active_keypair,
            sign::sign_message,
        },
    },
    tauri_plugin_log::fern::colors::{Color, ColoredLevelConfig},
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_android_tv_check::init())
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
            get_sol_balance,
            get_token_info,
            onramp_session,
            get_all_keypairs,
            update_username,
            send_token,
            get_treasury_bach_balance,
            get_treasury_sol_balance,
            get_swap_quote,
            build_swap_transaction,
            send_swap_transaction,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
