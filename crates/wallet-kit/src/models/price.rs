use {
    serde::{Deserialize, Serialize},
    std::collections::HashMap,
};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct TokenPrice {
    #[serde(rename = "usdPrice")]
    pub usd_price: f64,

    #[serde(rename = "blockId")]
    pub block_id: u64,

    pub decimals: u8,

    #[serde(rename = "priceChange24h")]
    pub price_change_24h: f64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PricesResponse {
    #[serde(flatten)]
    pub prices: HashMap<String, TokenPrice>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Price {
    pub symbol: String,
    pub price: f64,
}

impl TokenPrice {
    /// Get the price change percentage as a formatted string
    pub fn price_change_percentage(&self) -> String {
        format!("{:.2}%", self.price_change_24h)
    }

    /// Check if the price has increased in the last 24 hours
    pub fn is_price_up(&self) -> bool {
        self.price_change_24h > 0.0
    }

    /// Get formatted USD price with appropriate decimal places
    pub fn formatted_usd_price(&self) -> String {
        if self.usd_price >= 1.0 {
            format!("${:.2}", self.usd_price)
        } else if self.usd_price >= 0.01 {
            format!("${:.4}", self.usd_price)
        } else {
            format!("${:.6}", self.usd_price)
        }
    }
}

impl PricesResponse {
    /// Get price data for a specific token address
    pub fn get_token_price(&self, token_address: &str) -> Option<&TokenPrice> {
        self.prices.get(token_address)
    }

    /// Get all token addresses in the response
    pub fn token_addresses(&self) -> Vec<&String> {
        self.prices.keys().collect()
    }

    /// Convert to a vector of Price structs with token addresses as symbols
    pub fn to_price_list(&self) -> Vec<Price> {
        self.prices
            .iter()
            .map(|(address, token_price)| Price {
                symbol: address.clone(),
                price: token_price.usd_price,
            })
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_deserialize_prices_response() {
        let json = r#"
        {
          "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": {
            "usdPrice": 0.4056018512541055,
            "blockId": 348004026,
            "decimals": 6,
            "priceChange24h": 0.5292887924920519
          },
          "So11111111111111111111111111111111111111112": {
            "usdPrice": 147.4789340738336,
            "blockId": 348004023,
            "decimals": 9,
            "priceChange24h": 1.2907622140620008
          }
        }
        "#;

        let response: PricesResponse = serde_json::from_str(json).unwrap();

        assert_eq!(response.prices.len(), 2);

        let jup_price = response
            .get_token_price("JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN")
            .unwrap();
        assert_eq!(jup_price.usd_price, 0.4056018512541055);
        assert_eq!(jup_price.block_id, 348004026);
        assert_eq!(jup_price.decimals, 6);
        assert_eq!(jup_price.price_change_24h, 0.5292887924920519);

        let sol_price = response
            .get_token_price("So11111111111111111111111111111111111111112")
            .unwrap();
        assert_eq!(sol_price.usd_price, 147.4789340738336);
        assert_eq!(sol_price.block_id, 348004023);
        assert_eq!(sol_price.decimals, 9);
        assert_eq!(sol_price.price_change_24h, 1.2907622140620008);
    }

    #[test]
    fn test_token_price_methods() {
        let token_price = TokenPrice {
            usd_price: 147.4789340738336,
            block_id: 348004023,
            decimals: 9,
            price_change_24h: 1.2907622140620008,
        };

        assert!(token_price.is_price_up());
        assert_eq!(token_price.price_change_percentage(), "1.29%");
        assert_eq!(token_price.formatted_usd_price(), "$147.48");

        let small_price_token = TokenPrice {
            usd_price: 0.0012345,
            block_id: 348004023,
            decimals: 6,
            price_change_24h: -2.5,
        };

        assert!(!small_price_token.is_price_up());
        assert_eq!(small_price_token.formatted_usd_price(), "$0.001235");
    }
}
