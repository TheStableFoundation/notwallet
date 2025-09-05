/**
 * Configuration file for verified assets
 * Add new verified tokens to this list to display the verification badge
 */

export interface VerifiedAsset {
  address: string;
  symbol: string;
  name: string;
  verified: boolean;
}

export const VERIFIED_ASSETS: VerifiedAsset[] = [
  {
    address: "So11111111111111111111111111111111111111112", // Native SOL
    symbol: "SOL",
    name: "Solana",
    verified: true,
  },
  {
    address: "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf", // BACH Token
    symbol: "BACH",
    name: "Bach Token",
    verified: true,
  },
];

/**
 * Check if an asset is verified by its token address
 * @param address The token mint address to check
 * @returns boolean indicating if the asset is verified
 */
export const isAssetVerified = (address: string): boolean => {
  return VERIFIED_ASSETS.some(
    (asset) =>
      asset.address.toLowerCase() === address.toLowerCase() && asset.verified,
  );
};

/**
 * Get verified asset information by token address
 * @param address The token mint address
 * @returns VerifiedAsset object or undefined if not found
 */
export const getVerifiedAsset = (
  address: string,
): VerifiedAsset | undefined => {
  return VERIFIED_ASSETS.find(
    (asset) => asset.address.toLowerCase() === address.toLowerCase(),
  );
};

/**
 * Get verified asset information by symbol (fallback method)
 * Note: Symbols are not unique, so this should only be used when address is not available
 * @param symbol The token symbol
 * @returns VerifiedAsset object or undefined if not found
 */
export const getVerifiedAssetBySymbol = (
  symbol: string,
): VerifiedAsset | undefined => {
  return VERIFIED_ASSETS.find(
    (asset) => asset.symbol.toLowerCase() === symbol.toLowerCase(),
  );
};
