use {
    crate::models::{
        keypair::KeyPairError,
        network_type::{rpc_url, NetworkType},
    },
    wallet_core::balance::wallet_balance::wallet_balance as core_wallet_balance,
};

#[uniffi::export(async_runtime = "tokio")]
pub async fn wallet_balance(network: NetworkType, pubkey: String) -> Result<String, KeyPairError> {
    match core_wallet_balance(rpc_url(network), pubkey).await {
        Ok(balance) => Ok(balance),
        Err(e) => Err(KeyPairError::InvalidAddress(e.to_string())),
    }
}
