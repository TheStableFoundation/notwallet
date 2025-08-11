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

export interface OnboardingCreateWallet {
  seed: string;
  keypair: SolanaWallet;
}

/** The Stable Foundation */
export const THE_STABLE_FOUNDATION_ADDRESS = "9DWkPYFKcjpGVjwCjgAnYM8T6H4hssEnW27rLDtfU8y5";

export const THE_STABLE_FOUNDATION_TREASURY_ADDRESS = "3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3";

export const BACH_MINT_ACCOUNT = "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf";

export const BACH_DECIMALS = 12;

/** Solana */
export const SOLANA_MINT_ACCOUNT = "So11111111111111111111111111111111111111112";

export const SOL_DECIMALS = 9;

export const SPL_TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

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
