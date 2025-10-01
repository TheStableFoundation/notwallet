use {
    crate::models::{
        balance::Balance,
        keypair::KeyPairError,
        network_type::{rpc_url, NetworkType},
    },
    wallet_core::balance::wallet_balance_aggregate::wallet_balance_aggregate as core_wallet_balance_aggregate,
};

#[uniffi::export(async_runtime = "tokio")]
pub async fn wallet_balance_aggregate(
    network: NetworkType,
    pubkey: String,
) -> Result<Vec<Balance>, KeyPairError> {
    println!(
        "🦀🦀  Will load wallet balance for {} in {}",
        pubkey, network
    );
    match core_wallet_balance_aggregate(rpc_url(network), pubkey).await {
        Ok(balances) => Ok(balances
            .iter()
            .map(|x| Balance {
                mint: x.mint.clone(),
                symbol: x.symbol.clone(),
                balance: x.balance_string.clone(),
            })
            .collect()),
        Err(e) => Err(KeyPairError::InvalidAddress(e.to_string())),
    }
}
