use uniffi::setup_scaffolding;

pub mod balance;
pub mod constants;
pub mod derive_keypair;
pub mod fee;
pub mod foo;
pub mod token_info;
pub mod transactions;

setup_scaffolding!();
