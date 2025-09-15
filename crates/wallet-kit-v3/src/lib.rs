use uniffi::setup_scaffolding;

mod derive_keypair;
pub(crate) mod model;
pub(crate) mod response;
pub mod storage_key;

setup_scaffolding!();
