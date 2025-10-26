use {
    serde::{Deserialize, Serialize},
    tsync::tsync,
};

// Move to app
#[tsync]
pub const ENVIRONMENT_DID_CHANGE: &str = "environment_did_change";

#[derive(Serialize, Deserialize, Debug)]
#[tsync]
pub struct AirdropEnvironmentDidChange {
    pub environment: AirdropEnvironment,
}

#[derive(Serialize, Deserialize, Debug)]
#[tsync]
#[serde(rename_all = "lowercase")]
pub enum AirdropEnvironment {
    Development,
    Production,
}

impl std::fmt::Display for AirdropEnvironment {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        let env = match self {
            AirdropEnvironment::Development => "development",
            AirdropEnvironment::Production => "production",
        };
        write!(f, "{}", env)
    }
}
