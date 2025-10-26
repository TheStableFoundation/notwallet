use {
    crate::constants::network::{
        API_BASE_URL, API_BASE_URL_LOCAL, XLP_BASE_URL, XLP_BASE_URL_LOCAL,
    },
    log::warn,
    serde::{Deserialize, Serialize},
    serde_json::Value,
    tsync::tsync,
};

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

impl AirdropEnvironment {
    pub fn from_value(value: Value) -> Self {
        let env = match serde_json::from_value::<String>(value) {
            Ok(env) => env,
            Err(e) => {
                warn!("Cannot determine airdrop environment: {}", e);
                return AirdropEnvironment::Production;
            }
        };
        match env.as_str() {
            "development" => AirdropEnvironment::Development,
            "production" => AirdropEnvironment::Production,
            _ => {
                warn!(
                    "Cannot determine airdrop environment from '{}'. Default to production.",
                    env
                );
                AirdropEnvironment::Production
            }
        }
    }

    pub fn base_url(&self) -> &'static str {
        match self {
            AirdropEnvironment::Development => API_BASE_URL_LOCAL,
            AirdropEnvironment::Production => API_BASE_URL,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
#[tsync]
#[serde(rename_all = "lowercase")]
pub enum XlpEnvironment {
    Development,
    Production,
}

impl std::fmt::Display for XlpEnvironment {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        let env = match self {
            XlpEnvironment::Development => "development",
            XlpEnvironment::Production => "production",
        };
        write!(f, "{}", env)
    }
}

impl XlpEnvironment {
    pub fn from_value(value: Value) -> Self {
        let env = match serde_json::from_value::<String>(value) {
            Ok(env) => env,
            Err(e) => {
                warn!("Cannot determine xlp environment: {}", e);
                return XlpEnvironment::Production;
            }
        };
        match env.as_str() {
            "development" => XlpEnvironment::Development,
            "production" => XlpEnvironment::Production,
            _ => {
                warn!(
                    "Cannot determine xlp environment from '{}'. Default to production.",
                    env
                );
                XlpEnvironment::Production
            }
        }
    }

    pub fn base_url(&self) -> &'static str {
        match self {
            XlpEnvironment::Development => XLP_BASE_URL_LOCAL,
            XlpEnvironment::Production => XLP_BASE_URL,
        }
    }
}
