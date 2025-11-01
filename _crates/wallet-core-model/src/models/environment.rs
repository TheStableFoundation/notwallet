use {
    serde::{Deserialize, Serialize},
    smbcloud_wallet_constants::rpc::{
        devnet_rpc_url, local_rpc_url, mainnet_rpc_url, testnet_rpc_url,
    },
    std::fmt::Display,
};

#[derive(Debug, Serialize, Deserialize, uniffi::Enum)]
pub enum Environment {
    Local,
    Devnet,
    Testnet,
    Mainnet,
}

impl Display for Environment {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Local => write!(f, "Local network"),
            Self::Devnet => write!(f, "Dev network"),
            Self::Testnet => write!(f, "Test network"),
            Self::Mainnet => write!(f, "Main network"),
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
