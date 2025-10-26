import { Box } from "@mui/material";
import { ADDRESS_BACH_TOKEN, JUPITER, SOLANA } from "../crate/generated";

export const AssetIcon = ({
  id,
  size = 24,
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
    <Box
      component="img"
      sx={{
        height: size,
        width: size,
        maxHeight: { xs: size, md: 167 },
        maxWidth: { xs: size, md: 250 },
      }}
      alt="The house from the offer."
      src={logoUrl}
    />
  );
};

// map id with logo url
const assetLogoMap: Record<string, string> = {};
assetLogoMap[SOLANA] = "/images/solana-coin.svg";
assetLogoMap[ADDRESS_BACH_TOKEN] =
  "https://raw.githubusercontent.com/solana-labs/token-list/badd1dbe8c2d1e38c4f77b77f1d5fd5c60d3cccb/assets/mainnet/CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf/bach-token-logo-Est.2022.png";
assetLogoMap[JUPITER] = "/images/jlp.png";
