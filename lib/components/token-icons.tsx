import Image from "next/image";
import { BACH_TOKEN, JUPITER, SOLANA } from "../crate/generated";
export const AssetIcon = ({
  id,
  size = 24,
  name,
}: {
  id: string;
  size?: number;
  name?: string;
}) => {
  let logoUrl = assetLogoMap[id];
  if (!logoUrl) {
    logoUrl = "/images/spl-token.png";
  }
  return (
    <Image
      src={logoUrl}
      width={size}
      height={size}
      alt={name || "Asset"}
      style={{ borderRadius: "50%" }}
    />
  );
};

// map id with logo url
const assetLogoMap: Record<string, string> = {};
assetLogoMap[SOLANA] = "/images/solana-coin.svg";
assetLogoMap[BACH_TOKEN] =
  "https://raw.githubusercontent.com/solana-labs/token-list/badd1dbe8c2d1e38c4f77b77f1d5fd5c60d3cccb/assets/mainnet/CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf/bach-token-logo-Est.2022.png";
assetLogoMap[JUPITER] = "/images/jlp.png";
