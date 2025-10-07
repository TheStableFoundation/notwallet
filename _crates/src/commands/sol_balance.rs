use {
    crate::models::keypair::KeyPairError,
    smbcloud_wallet_core_model::models::environment::Environment,
    smbcloud_wallet_core_rpc::balance::sol_balance::sol_balance as core_sol_balance,
};

#[uniffi::export]
pub fn sol_balance(network: Environment, pubkey: String) -> Result<f64, KeyPairError> {
    match core_sol_balance(network.rpc_url(), pubkey) {
        Ok(balance) => Ok(balance.1),
        Err(e) => Err(KeyPairError::InvalidAddress(e.to_string())),
    }
}
