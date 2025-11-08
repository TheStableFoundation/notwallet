use {
    log::warn,
    serde::{Deserialize, Serialize},
    serde_json::Value,
    smbcloud_wallet_constants::rpc::{
        devnet_rpc_url, local_rpc_url, mainnet_rpc_url, testnet_rpc_url,
    },
    std::fmt::Display,
    tsync::tsync,
};

#[derive(Debug, Serialize, Deserialize, PartialEq, uniffi::Enum)]
#[tsync]
pub enum Environment {
    Local,
    Devnet,
    Testnet,
    Mainnet,
}

impl Display for Environment {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Local => write!(f, "Local"),
            Self::Devnet => write!(f, "Devnet"),
            Self::Testnet => write!(f, "Testnet"),
            Self::Mainnet => write!(f, "Mainnet"),
        }
    }
}

impl Environment {
    pub fn from_value(value: Value) -> Self {
        let env = match serde_json::from_value::<String>(value) {
            Ok(env) => env,
            Err(e) => {
                warn!("Cannot determine airdrop environment: {}", e);
                return Environment::Mainnet;
            }
        };
        match env.as_str() {
            "Devnet" => Environment::Devnet,
            "Testnet" => Environment::Testnet,
            "Mainnet" => Environment::Mainnet,
            _ => {
                warn!(
                    "Cannot determine Network environment from '{}'. Default to Mainnet.",
                    env
                );
                Environment::Mainnet
            }
        }
    }
}

impl Environment {
    pub fn new_or_default(environment: String) -> Self {
        match environment.as_str() {
            "local" => Self::Local,
            "devnet" => Self::Devnet,
            "testnet" => Self::Testnet,
            "mainnet" => Self::Mainnet,
            _ => Self::Mainnet,
        }
    }
    pub fn rpc_url(self) -> String {
        match self {
            Self::Local => local_rpc_url(),
            Self::Devnet => devnet_rpc_url(),
            Self::Testnet => testnet_rpc_url(),
            Self::Mainnet => mainnet_rpc_url(),
        }
    }
}

impl Environment {
    pub fn from_string(network: String) -> Option<Self> {
        match network.as_str() {
            "local" => Some(Self::Local),
            "devnet" => Some(Self::Devnet),
            "testnet" => Some(Self::Testnet),
            "mainnet" => Some(Self::Mainnet),
            _ => None,
        }
    }
}
