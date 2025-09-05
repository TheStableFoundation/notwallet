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
pub struct BirdeyePriceData {
    #[serde(rename = "isScaledUiToken")]
    pub is_scaled_ui_token: bool,

    pub value: f64,

    #[serde(rename = "updateUnixTime")]
    pub update_unix_time: i64,

    #[serde(rename = "updateHumanTime")]
    pub update_human_time: String,

    #[serde(rename = "priceChange24h")]
    pub price_change_24h: f64,

    #[serde(rename = "priceInNative")]
    pub price_in_native: f64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BirdeyePriceResponse {
    pub data: BirdeyePriceData,
    pub success: bool,
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

impl BirdeyePriceData {
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
        if self.value >= 1.0 {
            format!("${:.2}", self.value)
        } else if self.value >= 0.01 {
            format!("${:.4}", self.value)
        } else {
            format!("${:.6}", self.value)
        }
    }

    /// Convert to a Price struct
    pub fn to_price(&self, symbol: String) -> Price {
        Price {
            symbol,
            price: self.value,
        }
    }
}

impl BirdeyePriceResponse {
    /// Check if the response is successful and has data
    pub fn is_valid(&self) -> bool {
        self.success
    }

    /// Get the USD price value if response is valid
    pub fn get_usd_price(&self) -> Option<f64> {
        if self.success {
            Some(self.data.value)
        } else {
            None
        }
    }

    /// Convert to a Price struct
    pub fn to_price(&self, symbol: String) -> Option<Price> {
        if self.success {
            Some(self.data.to_price(symbol))
        } else {
            None
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

    #[test]
    fn test_deserialize_birdeye_response() {
        let json = r#"
        {
            "data": {
                "isScaledUiToken": false,
                "value": 0.16841499484059755,
                "updateUnixTime": 1756693582,
                "updateHumanTime": "2025-09-01T02:26:22",
                "priceChange24h": -17.011320660513977,
                "priceInNative": 0.0008419589807401728
            },
            "success": true
        }
        "#;

        let response: BirdeyePriceResponse = serde_json::from_str(json).unwrap();

        assert!(response.success);
        assert!(!response.data.is_scaled_ui_token);
        assert_eq!(response.data.value, 0.16841499484059755);
        assert_eq!(response.data.update_unix_time, 1756693582);
        assert_eq!(response.data.update_human_time, "2025-09-01T02:26:22");
        assert_eq!(response.data.price_change_24h, -17.011320660513977);
        assert_eq!(response.data.price_in_native, 0.0008419589807401728);
    }

    #[test]
    fn test_birdeye_price_data_methods() {
        let price_data = BirdeyePriceData {
            is_scaled_ui_token: false,
            value: 0.16841499484059755,
            update_unix_time: 1756693582,
            update_human_time: "2025-09-01T02:26:22".to_string(),
            price_change_24h: -17.011320660513977,
            price_in_native: 0.0008419589807401728,
        };

        assert!(!price_data.is_price_up());
        assert_eq!(price_data.price_change_percentage(), "-17.01%");
        assert_eq!(price_data.formatted_usd_price(), "$0.1684");

        let price = price_data.to_price("TEST".to_string());
        assert_eq!(price.symbol, "TEST");
        assert_eq!(price.price, 0.16841499484059755);
    }

    #[test]
    fn test_birdeye_response_methods() {
        let response = BirdeyePriceResponse {
            data: BirdeyePriceData {
                is_scaled_ui_token: false,
                value: 0.16841499484059755,
                update_unix_time: 1756693582,
                update_human_time: "2025-09-01T02:26:22".to_string(),
                price_change_24h: -17.011320660513977,
                price_in_native: 0.0008419589807401728,
            },
            success: true,
        };

        assert!(response.is_valid());
        assert_eq!(response.get_usd_price(), Some(0.16841499484059755));

        let price = response.to_price("TEST".to_string()).unwrap();
        assert_eq!(price.symbol, "TEST");
        assert_eq!(price.price, 0.16841499484059755);

        // Test failed response
        let failed_response = BirdeyePriceResponse {
            data: response.data.clone(),
            success: false,
        };

        assert!(!failed_response.is_valid());
        assert_eq!(failed_response.get_usd_price(), None);
        assert!(failed_response.to_price("TEST".to_string()).is_none());
    }
}
