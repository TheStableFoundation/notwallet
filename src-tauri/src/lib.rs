mod constants;
mod model;
mod network;
mod onramp;
mod settings;
mod setup;
mod swap;
mod wallet;

use {
    crate::{
        onramp::commands::onramp_session,
        settings::commands::{get_airdrop_environment, set_airdrop_environment},
        setup::{
            commands::{get_installation_id, is_debug, register_client},
            setup,
        },
        swap::commands::{build_swap_transaction, get_swap_quote, send_swap_transaction},
        wallet::{
            check_pubkey::check_pubkey,
            command_balance::get_wallet_balance,
            command_onboarding_create_wallet::onboarding_create_wallet,
            command_other_assets_balance::get_other_assets_balance,
            commands::{
                derive_next_keypair, destroy_all_wallets, get_all_keypairs, get_bach_balance,
                get_sol_balance, get_treasury_bach_balance, get_treasury_sol_balance, send_token,
                update_username,
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
        .plugin(tauri_plugin_os::init())
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
        .setup(|app| {
            // Android-only plugin.
            #[cfg(target_os = "android")]
            {
                app.handle().plugin(tauri_plugin_android_tv_check::init())?;
            }
            setup(app)
        })
        .invoke_handler(tauri::generate_handler![
            onboarding_create_wallet,
            import_solana_wallet,
            derive_new_keypair,
            derive_next_keypair,
            destroy_all_wallets,
            sign_message,
            check_pubkey,
            set_active_keypair,
            get_installation_id,
            get_bach_balance,
            get_sol_balance,
            get_wallet_balance,
            onramp_session,
            get_all_keypairs,
            update_username,
            send_token,
            get_treasury_bach_balance,
            get_treasury_sol_balance,
            get_swap_quote,
            get_other_assets_balance,
            build_swap_transaction,
            send_swap_transaction,
            is_debug,
            get_airdrop_environment,
            set_airdrop_environment,
            register_client,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
