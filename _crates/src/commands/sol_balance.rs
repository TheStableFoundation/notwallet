use {
    crate::models::{
        keypair::KeyPairError,
        network_type::{rpc_url, NetworkType},
    },
    smbcloud_wallet_core_rpc::balance::sol_balance::sol_balance as core_sol_balance,
};

#[uniffi::export]
pub fn sol_balance(network: NetworkType, pubkey: String) -> Result<f64, KeyPairError> {
    match core_sol_balance(rpc_url(network), pubkey) {
        Ok(balance) => Ok(balance.1),
        Err(e) => Err(KeyPairError::InvalidAddress(e)),
    }
}
