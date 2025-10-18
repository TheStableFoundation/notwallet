use serde::{Deserialize, Serialize};
use tsync::tsync;

#[derive(Serialize, Deserialize)]
pub(crate) struct AirdropResponse {
    pub(crate) message: String,
    pub(crate) signature: String,
}

#[derive(Serialize)]
pub(crate) struct AirdropRequest<'a> {
    pub(crate) pubkey: &'a str,
    pub(crate) signature: &'a str,
    pub(crate) deploy_key: &'a str,
}

#[derive(Serialize, Deserialize, Debug)]
#[tsync]
pub(crate) struct CheckPubkeyResponse {
    pub(crate) exists: bool,
    pub(crate) user_id: Option<i32>,
}
