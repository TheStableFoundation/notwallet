use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tsync::tsync;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
pub struct SwapInfo {
    #[serde(rename = "ammKey")]
    pub amm_key: String,
    pub label: String,
    #[serde(rename = "inputMint")]
    pub input_mint: String,
    #[serde(rename = "outputMint")]
    pub output_mint: String,
    #[serde(rename = "inAmount")]
    pub in_amount: String,
    #[serde(rename = "outAmount")]
    pub out_amount: String,
    #[serde(rename = "feeAmount")]
    pub fee_amount: String,
    #[serde(rename = "feeMint")]
    pub fee_mint: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
pub struct RoutePlan {
    #[serde(rename = "swapInfo")]
    pub swap_info: SwapInfo,
    pub percent: u8,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[tsync]
pub struct SwapQuoteResponse {
    #[serde(rename = "inputMint")]
    pub input_mint: String,
    #[serde(rename = "inAmount")]
    pub in_amount: String,
    #[serde(rename = "outputMint")]
    pub output_mint: String,
    #[serde(rename = "outAmount")]
    pub out_amount: String,
    #[serde(rename = "otherAmountThreshold")]
    pub other_amount_threshold: String,
    #[serde(rename = "swapMode")]
    pub swap_mode: String,
    #[serde(rename = "slippageBps")]
    pub slippage_bps: u64,
    #[serde(rename = "platformFee")]
    pub platform_fee: Option<PlatformFee>,
    #[serde(rename = "priceImpactPct")]
    pub price_impact_pct: String,
    #[serde(rename = "routePlan")]
    pub route_plan: Vec<RoutePlan>,
    #[serde(rename = "contextSlot")]
    pub context_slot: u64,
    #[serde(rename = "timeTaken")]
    pub time_taken: f64,
    #[serde(rename = "swapUsdValue")]
    pub swap_usd_value: Option<String>,
    #[serde(rename = "simplerRouteUsed")]
    pub simpler_route_used: Option<bool>,
    #[serde(rename = "mostReliableAmmsQuoteReport")]
    pub most_reliable_amms_quote_report: Option<MostReliableAmmsQuoteReportInfo>,
    #[serde(rename = "useIncurredSlippageForQuoting")]
    pub use_incurred_slippage_for_quoting: Option<bool>,
    #[serde(rename = "otherRoutePlans")]
    pub other_route_plans: Option<Vec<RoutePlan>>,
    #[serde(rename = "aggregatorVersion")]
    pub aggregator_version: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
pub struct MostReliableAmmsQuoteReportInfo {
    pub info: HashMap<String, String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
pub struct PriorityLevelWithMaxLamports {
    #[serde(rename = "maxLamports")]
    pub max_lamports: u64,
    #[serde(rename = "priorityLevel")]
    pub priority_level: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
pub struct PlatformFee {
    pub amount: String,
    #[serde(rename = "feeBps")]
    pub fee_bps: i32,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
pub struct PrioritizationFeeLamports {
    #[serde(rename = "priorityLevelWithMaxLamports")]
    pub priority_level_with_max_lamports: PriorityLevelWithMaxLamports,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[tsync]
pub struct SwapTransactionPayload {
    #[serde(rename = "quoteResponse")]
    pub quote_response: SwapQuoteResponse,
    #[serde(rename = "userPublicKey")]
    pub user_public_key: String,
    #[serde(rename = "dynamicComputeUnitLimit")]
    pub dynamic_compute_unit_limit: bool,
    #[serde(rename = "dynamicSlippage")]
    pub dynamic_slippage: bool,
    #[serde(rename = "prioritizationFeeLamports")]
    pub prioritization_fee_lamports: PrioritizationFeeLamports,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
pub struct ComputeBudget {
    #[serde(rename = "microLamports")]
    pub micro_lamports: u64,
    #[serde(rename = "estimatedMicroLamports")]
    pub estimated_micro_lamports: u64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
pub struct PrioritizationType {
    #[serde(rename = "computeBudget")]
    pub compute_budget: ComputeBudget,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[tsync]
pub struct DynamicSlippageReport {
    #[serde(rename = "slippageBps")]
    pub slippage_bps: u64,
    #[serde(rename = "otherAmount")]
    pub other_amount: u64,
    #[serde(rename = "simulatedIncurredSlippageBps")]
    pub simulated_incurred_slippage_bps: i64,
    #[serde(rename = "amplificationRatio")]
    pub amplification_ratio: String,
    #[serde(rename = "categoryName")]
    pub category_name: String,
    #[serde(rename = "heuristicMaxSlippageBps")]
    pub heuristic_max_slippage_bps: u64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[tsync]
pub struct SwapTransactionResponse {
    #[serde(rename = "swapTransaction")]
    pub swap_transaction: String,
    #[serde(rename = "lastValidBlockHeight")]
    pub last_valid_block_height: u64,
    #[serde(rename = "prioritizationFeeLamports")]
    pub prioritization_fee_lamports: u64,
    #[serde(rename = "computeUnitLimit")]
    pub compute_unit_limit: u64,
    #[serde(rename = "prioritizationType")]
    pub prioritization_type: PrioritizationType,
    #[serde(rename = "dynamicSlippageReport")]
    pub dynamic_slippage_report: DynamicSlippageReport,
    #[serde(rename = "simulationError")]
    pub simulation_error: Option<String>,
}
