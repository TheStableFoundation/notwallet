use {
    crate::{
        constants::store::store,
        model::settings_debug::{AirdropEnvironment, XlpEnvironment},
    },
    log::{error, info},
    smbcloud_wallet_core_model::models::environment::Environment,
    tauri::{command, AppHandle},
    tsync::tsync,
};

#[tsync]
const KEY_NETWORK_ENVIRONMENT: &str = "network_environment";
#[tsync]
const KEY_AIRDROP_ENVIRONMENT: &str = "airdrop_environment";
#[tsync]
const KEY_XLP_ENVIRONMENT: &str = "xlp_environment";

#[command]
pub async fn get_network_environment(app: AppHandle) -> Environment {
    let store_result = store(&app);
    match store_result {
        Ok(store) => {
            if let Some(env) = store.get(KEY_NETWORK_ENVIRONMENT) {
                info!("Found existing Network environment: {}", env);
                return Environment::from_value(env);
            }
            info!("No existing Network environment found. Setting to Mainnet.");
            store.set(KEY_NETWORK_ENVIRONMENT, "Mainnet");
            Environment::Mainnet
        }
        Err(err) => {
            error!(
                "Failed to get Network environment: {}. Setting to Mainnet.",
                err
            );
            Environment::Mainnet
        }
    }
}

#[command]
pub async fn set_network_environment(
    app: AppHandle,
    environment: Environment,
) -> Result<Environment, String> {
    let store_result = store(&app);
    match store_result {
        Ok(store) => {
            store.set(KEY_NETWORK_ENVIRONMENT, environment.to_string());
            Ok(environment)
        }
        Err(err) => {
            error!("Failed to set Network environment: {}", err);
            Err("Failed to set Network environment.".to_string())
        }
    }
}

/// Get the current airdrop environment.
/// Or set it to the default production environment.
#[command]
pub async fn get_airdrop_environment(app: AppHandle) -> AirdropEnvironment {
    let store_result = store(&app);
    match store_result {
        Ok(store) => {
            if let Some(env) = store.get(KEY_AIRDROP_ENVIRONMENT) {
                info!("Found existing airdrop environment: {}", env);
                return AirdropEnvironment::from_value(env);
            }
            info!("No existing airdrop environment found. Setting to production.");
            store.set(KEY_AIRDROP_ENVIRONMENT, "production");
            AirdropEnvironment::Production
        }
        Err(err) => {
            error!(
                "Failed to get airdrop environment: {}. Setting to production.",
                err
            );
            AirdropEnvironment::Production
        }
    }
}

#[command]
pub async fn set_airdrop_environment(
    app: AppHandle,
    environment: AirdropEnvironment,
) -> Result<AirdropEnvironment, String> {
    let store_result = store(&app);
    match store_result {
        Ok(store) => {
            store.set(KEY_AIRDROP_ENVIRONMENT, environment.to_string());
            Ok(environment)
        }
        Err(err) => {
            error!("Failed to set airdrop environment: {}", err);
            Err("Failed to set airdrop environment.".to_string())
        }
    }
}

#[command]
pub async fn get_xlp_environment(app: AppHandle) -> XlpEnvironment {
    let store_result = store(&app);
    match store_result {
        Ok(store) => {
            if let Some(env) = store.get(KEY_XLP_ENVIRONMENT) {
                info!("Found existing Xlp environment: {}", env);
                return XlpEnvironment::from_value(env);
            }
            info!("No existing Xlp environment found. Setting to production.");
            store.set(KEY_XLP_ENVIRONMENT, "production");
            XlpEnvironment::Production
        }
        Err(err) => {
            error!(
                "Failed to get Xlp environment: {}. Setting to production.",
                err
            );
            XlpEnvironment::Production
        }
    }
}

#[command]
pub async fn set_xlp_environment(
    app: AppHandle,
    environment: XlpEnvironment,
) -> Result<XlpEnvironment, String> {
    let store_result = store(&app);
    match store_result {
        Ok(store) => {
            store.set(KEY_XLP_ENVIRONMENT, environment.to_string());
            Ok(environment)
        }
        Err(err) => {
            error!("Failed to set Xlp environment: {}", err);
            Err("Failed to set Xlp environment.".to_string())
        }
    }
}
