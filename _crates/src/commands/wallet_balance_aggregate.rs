use {
    crate::models::keypair::KeyPairError,
    smbcloud_wallet_core::balance::wallet_balance_aggregate::wallet_balance_aggregate as core_wallet_balance_aggregate,
    smbcloud_wallet_core_model::models::{balance::Balance, environment::Environment},
};

#[uniffi::export(async_runtime = "tokio")]
pub async fn wallet_balance_aggregate(
    network: Environment,
    pubkey: String,
) -> Result<Vec<Balance>, KeyPairError> {
    println!(
        "🦀🦀  Will load wallet balance for {} in {}",
        pubkey, network
    );
    match core_wallet_balance_aggregate(network.rpc_url(), pubkey).await {
        Ok(balances) => Ok(balances),
        Err(e) => Err(KeyPairError::InvalidAddress(e.to_string())),
    }
}
