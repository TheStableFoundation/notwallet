/* This file is generated and managed by tsync */

export const STRIPE_PUBLISHABLE_KEY = "your_stripe_publishable_key";

export const ONRAMPER_KEY = "your_onramper_key";

export const ONRAMPER_SIGNER_KEY = "your_onramper_signer_key";

/**
 * Generate:
 * tsync -i src-tauri/src/ crates/wallet-kit/src/ -o lib/crate/generated.ts
 */
export const STORE = ".notwallet.dat";

export const STORE_KEYPAIRS = "keypairs";

export const STORE_SEEDS = "seeds";

export const STORE_ACTIVE_KEYPAIR = "activeKeypair";

export const STORE_PASSWORD = "password";

/**
 * Legacy store for the wallet.
 * This is used to store the wallet in the old format.
 */
export const STORE_WALLET = "wallet.json";

/**
 * Legacy wallet key.
 * This is used to store the wallet in the old format.
 */
export const WALLET_0 = "wallet_0";

export interface CheckPubkeyResponse {
  exists: boolean;
  user_id?: number;
}

export interface SolanaWallet {
  /**
   * The unique identifier for the wallet, typically a UUID.
   * This ID is used to reference the wallet in various operations.
   */
  id: string;
  /** The unique username of the wallet that is human-readable. */
  username?: string;
  /**
   * The name of the wallet, which is a human-readable identifier.
   * This can be used to differentiate between multiple wallets.
   */
  name: string;
  /**
   * The account index for the wallet, typically used in Solana to differentiate between multiple accounts.
   * This is usually 0 for the first account.
   * In the context of Solana, this is often referred to as the \"account\" index.
   */
  account: number;
  /**
   * The public key of the wallet, represented as a base58-encoded string.
   * This key is used to receive funds and is shared publicly.
   * In Solana, this is often referred to as the \"public key\" or \"address\".
   */
  pubkey: string;
  /**
   * The private key of the wallet, represented as a base58-encoded string.
   * This key is used to sign transactions and should be kept secret.
   * In Solana, this is often referred to as the \"private key
   */
  privkey: string;
  /** The UUID of the seed that this keypair is derived from. */
  seed_id: string;
}

export interface OnrampSession {
  id: string;
  client_secret: string;
}

/** Error type for Stripe operations */
export type StripeError =
  | { "RequestError": Error }
  | {
      "InvalidApiKey": {
        [key: PropertyKey]: never;
      }
    }
  | { "ApiError": string };

export interface Seed {
  id: string;
  phrase: string;
  seed_type: SeedType;
}

export type SeedType =
  | {
      "Created": {
        timestamp: Date;
      }
    }
  | {
      "Imported": {
        timestamp: Date;
      }
    };

export type AirdropEnvironment =
  | "development" | "production";

export type XlpEnvironment =
  | "development" | "production";

export interface OnboardingCreateWallet {
  seed: string;
  keypair: SolanaWallet;
}

export const KEY_AIRDROP_ENVIRONMENT = "airdrop_environment";

export const KEY_XLP_ENVIRONMENT = "xlp_environment";

export const SOLANA = "So11111111111111111111111111111111111111112";

export const SOL_DECIMALS = 9;

export const BACH_DECIMALS = 12;

export const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const USDT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

export const USDG = "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH";

export const EURC = "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr";

export const JUPITER = "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN";

export const MEW = "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5";

export const PAYPAY_USD = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";

export const BONK = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";

export const USDS = "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA";

export const OFFICIAL_TRUMP = "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN";

export const COINBASE_WRAPPED_BTC = "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij";

export const MELANIA_MEME = "FUAfBo2jgks6gB4Z4LfZkqSZgzNucisEHqnNebaRxM1P";

export const JITO_STAKED_SOL = "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn";

export const ZBTC = "zBTCug3er3tLyffELcvDNrKkCymbPWysGcWihESYfLg";

export const USD1 = "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB";

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  logo_url: string;
}

export interface AssetBalance {
  id: string;
  balance: number;
}

export interface SwapInfo {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
}

export interface RoutePlan {
  swapInfo: SwapInfo;
  percent: number;
}

export interface SwapQuoteResponse {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: PlatformFee;
  priceImpactPct: string;
  routePlan: Array<RoutePlan>;
  contextSlot: number;
  timeTaken: number;
  swapUsdValue?: string;
  simplerRouteUsed?: boolean;
  mostReliableAmmsQuoteReport?: MostReliableAmmsQuoteReportInfo;
  useIncurredSlippageForQuoting?: boolean;
  otherRoutePlans?: Array<RoutePlan>;
  aggregatorVersion?: string;
}

export interface MostReliableAmmsQuoteReportInfo {
  info: Record<string, string>;
}

export interface PriorityLevelWithMaxLamports {
  maxLamports: number;
  priorityLevel: string;
}

export interface PlatformFee {
  amount: string;
  feeBps: number;
}

export interface PrioritizationFeeLamports {
  priorityLevelWithMaxLamports: PriorityLevelWithMaxLamports;
}

export interface SwapTransactionPayload {
  quoteResponse: SwapQuoteResponse;
  userPublicKey: string;
  dynamicComputeUnitLimit: boolean;
  dynamicSlippage: boolean;
  prioritizationFeeLamports: PrioritizationFeeLamports;
}

export interface ComputeBudget {
  microLamports: number;
  estimatedMicroLamports: number;
}

export interface PrioritizationType {
  computeBudget: ComputeBudget;
}

export interface DynamicSlippageReport {
  slippageBps: number;
  otherAmount: number;
  simulatedIncurredSlippageBps: number;
  amplificationRatio?: string;
  categoryName: string;
  heuristicMaxSlippageBps?: number;
  rtseSlippageBps?: number;
  failedTxnEstSlippage?: number;
  emaEstSlippage?: number;
  useIncurredSlippageForQuoting?: boolean;
}

export interface SwapTransactionResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
  computeUnitLimit: number;
  prioritizationType: PrioritizationType;
  simulationSlot?: number;
  dynamicSlippageReport: DynamicSlippageReport;
  simulationError?: string;
  addressesByLookupTableAddress?: Array<string>;
}

export const ADDRESS_SOL = "So11111111111111111111111111111111111111112";

export const ADDRESS_BACH_TOKEN = "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf";

export const ADDRESS_JUPITER = "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN";

export const ADDRESS_USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const ADDRESS_USDT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";

export const ADDRESS_USDG = "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH";

export const ADDRESS_USDS = "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA";

export const ADDRESS_USD1 = "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB";

export const ADDRESS_EURC = "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr";

export const ADDRESS_ZBTC = "zBTCug3er3tLyffELcvDNrKkCymbPWysGcWihESYfLg";

/** The Stable Foundation */
export const THE_STABLE_FOUNDATION_ADDRESS = "9DWkPYFKcjpGVjwCjgAnYM8T6H4hssEnW27rLDtfU8y5";

export const THE_STABLE_FOUNDATION_TREASURY_ADDRESS = "3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3";

export const SPL_TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

export interface Metadata {
  address: string;
  name: string;
  symbol: string;
  decimal: number;
  logo_uri: string;
}

export interface BalanceV1 {
  meta: Metadata;
  /**
   * Balance in its smallest nomimal. For example, a 0.01 SOL balance will return 10000000,
   * 0.010000000 * 1_000_000_000.
   */
  balance: number;
  /** Balance in its easy-to-read form. For example, a 0.01 SOL. */
  ui_amount: number;
}
