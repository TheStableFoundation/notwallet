use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tsync::tsync;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
#[allow(non_snake_case)]
pub struct SwapInfo {
    pub ammKey: String,
    pub label: String,
    pub inputMint: String,
    pub outputMint: String,
    pub inAmount: String,
    pub outAmount: String,
    pub feeAmount: String,
    pub feeMint: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
#[allow(non_snake_case)]
pub struct RoutePlan {
    pub swapInfo: SwapInfo,
    pub percent: u8,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[tsync]
#[allow(non_snake_case)]
pub struct SwapQuoteResponse {
    pub inputMint: String,
    pub outputMint: String,
    pub inAmount: String,
    pub outAmount: String,
    pub otherAmountThreshold: String,
    pub swapMode: String,
    pub slippageBps: u64,
    pub platformFee: Option<PlatformFee>,
    pub priceImpactPct: String,
    pub routePlan: Vec<RoutePlan>,
    pub contextSlot: u64,
    pub timeTaken: f64,
    pub swapUsdValue: Option<String>,
    pub simplerRouteUsed: Option<bool>,
    pub mostReliableAmmsQuoteReport: Option<MostReliableAmmsQuoteReportInfo>,
    pub useIncurredSlippageForQuoting: Option<bool>,
    pub otherRoutePlans: Option<Vec<RoutePlan>>,
    pub aggregatorVersion: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
pub struct MostReliableAmmsQuoteReportInfo {
    pub info: HashMap<String, String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
#[allow(non_snake_case)]
pub struct PriorityLevelWithMaxLamports {
    pub maxLamports: u64,
    pub priorityLevel: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
#[allow(non_snake_case)]
pub struct PlatformFee {
    pub amount: String,
    pub feeBps: i32,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
#[allow(non_snake_case)]
pub struct PrioritizationFeeLamports {
    pub priorityLevelWithMaxLamports: PriorityLevelWithMaxLamports,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[tsync]
#[allow(non_snake_case)]
pub struct SwapTransactionPayload {
    pub quoteResponse: SwapQuoteResponse,
    pub userPublicKey: String,
    pub dynamicComputeUnitLimit: bool,
    pub dynamicSlippage: bool,
    pub prioritizationFeeLamports: PrioritizationFeeLamports,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
#[allow(non_snake_case)]
pub struct ComputeBudget {
    pub microLamports: u64,
    pub estimatedMicroLamports: u64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[tsync]
#[allow(non_snake_case)]
pub struct PrioritizationType {
    pub computeBudget: ComputeBudget,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[tsync]
#[allow(non_snake_case)]
pub struct DynamicSlippageReport {
    pub slippageBps: u64,
    pub otherAmount: u64,
    pub simulatedIncurredSlippageBps: i64,
    pub amplificationRatio: Option<String>,
    pub categoryName: String,
    pub heuristicMaxSlippageBps: Option<u64>,
    pub rtseSlippageBps: Option<u64>,
    pub failedTxnEstSlippage: Option<u64>,
    pub emaEstSlippage: Option<u64>,
    pub useIncurredSlippageForQuoting: Option<bool>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[tsync]
#[allow(non_snake_case)]
pub struct SwapTransactionResponse {
    pub swapTransaction: String,
    pub lastValidBlockHeight: u64,
    pub prioritizationFeeLamports: u64,
    pub computeUnitLimit: u64,
    pub prioritizationType: PrioritizationType,
    pub simulationSlot: Option<u64>,
    pub dynamicSlippageReport: DynamicSlippageReport,
    pub simulationError: Option<String>,
    pub addressesByLookupTableAddress: Option<Vec<String>>,
}
