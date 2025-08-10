/* This file is generated and managed by tsync */

/** Solana */
export const SOLANA_MINT_ACCOUNT = "So11111111111111111111111111111111111111112";

export const STRIPE_PUBLISHABLE_KEY = "your_stripe_publishable_key";

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

export interface SwapInfo {
  amm_key: string;
  label: string;
  input_mint: string;
  output_mint: string;
  in_amount: string;
  out_amount: string;
  fee_amount: string;
  fee_mint: string;
}

export interface RoutePlan {
  swap_info: SwapInfo;
  percent: number;
}

export interface SwapQuoteResponse {
  input_mint: string;
  in_amount: string;
  output_mint: string;
  out_amount: string;
  other_amount_threshold: string;
  swap_mode: string;
  slippage_bps: number;
  platform_fee?: string;
  price_impact_pct: string;
  route_plan: Array<RoutePlan>;
  context_slot: number;
  time_taken: number;
}

export interface PriorityLevelWithMaxLamports {
  max_lamports: number;
  priority_level: string;
}

export interface PrioritizationFeeLamports {
  priority_level_with_max_lamports: PriorityLevelWithMaxLamports;
}

export interface SwapTransactionPayload {
  quote_response: SwapQuoteResponse;
  user_public_key: string;
  dynamic_compute_unit_limit: boolean;
  dynamic_slippage: boolean;
  prioritization_fee_lamports: PrioritizationFeeLamports;
}

export interface ComputeBudget {
  micro_lamports: number;
  estimated_micro_lamports: number;
}

export interface PrioritizationType {
  compute_budget: ComputeBudget;
}

export interface DynamicSlippageReport {
  slippage_bps: number;
  other_amount: number;
  simulated_incurred_slippage_bps: number;
  amplification_ratio: string;
  category_name: string;
  heuristic_max_slippage_bps: number;
}

export interface SwapTransactionResponse {
  swap_transaction: string;
  last_valid_block_height: number;
  prioritization_fee_lamports: number;
  compute_unit_limit: number;
  prioritization_type: PrioritizationType;
  dynamic_slippage_report: DynamicSlippageReport;
  simulation_error?: string;
}
