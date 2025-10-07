use {
    crate::models::keypair::KeyPairError,
    smbcloud_wallet_core::balance::wallet_balance::wallet_balance as core_wallet_balance,
    smbcloud_wallet_core_model::models::environment::Environment,
};

#[uniffi::export(async_runtime = "tokio")]
pub async fn wallet_balance(
    network: Environment,
    pubkey: String,
    api_key: &str,
    user_agent: &str,
) -> Result<String, KeyPairError> {
    println!(
        "🦀🦀  Will load wallet balance for {} in {}",
        pubkey, network
    );
    match core_wallet_balance(network.rpc_url(), api_key, user_agent, pubkey).await {
        Ok(balance) => Ok(balance),
        Err(e) => Err(KeyPairError::InvalidAddress(e.to_string())),
    }
}
