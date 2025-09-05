import Avatar from "@mui/material/Avatar";
import { AssetIcon } from "@/lib/components/token-icons";
import { BACH_TOKEN, SOLANA } from "@/lib/crate/generated";

interface TokenIconProps {
  symbol: string;
  size?: number;
}

export const TokenIcon = ({ symbol, size = 24 }: TokenIconProps) => {
  const getTokenIcon = () => {
    switch (symbol.toUpperCase()) {
      case "SOL":
        return <AssetIcon id={SOLANA} size={size} />;
      case "BACH":
        return <AssetIcon id={BACH_TOKEN} size={size} />;
      case "USDC":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#2775ca",
              fontSize: size * 0.4,
              fontWeight: "bold",
            }}
          >
            $
          </Avatar>
        );
      case "PYUSD":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#0066cc",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            P
          </Avatar>
        );
      case "WSOL":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#9945ff",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            W
          </Avatar>
        );
      case "EURC":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#003399",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            €
          </Avatar>
        );
      case "USDT":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#26a17b",
              fontSize: size * 0.4,
              fontWeight: "bold",
            }}
          >
            ₮
          </Avatar>
        );
      case "MEW":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#ff6b9d",
              fontSize: size * 0.3,
              fontWeight: "bold",
            }}
          >
            🐱
          </Avatar>
        );
      case "TRUMP":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#ff0000",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            T
          </Avatar>
        );
      case "CBBTC":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#f7931a",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            ₿
          </Avatar>
        );
      case "BONK":
      case "Bonk":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#ff6b35",
              fontSize: size * 0.3,
              fontWeight: "bold",
            }}
          >
            🐕
          </Avatar>
        );
      case "MELANIA":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#ff69b4",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            M
          </Avatar>
        );
      case "USDS":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#1e40af",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            S
          </Avatar>
        );
      case "JITOSOL":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#00d4aa",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            J
          </Avatar>
        );
      case "USDG":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#059669",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            G
          </Avatar>
        );

      case "PEPE":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#0d9488",
              fontSize: size * 0.3,
              fontWeight: "bold",
            }}
          >
            🐸
          </Avatar>
        );
      case "WIF":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#8b5cf6",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            W
          </Avatar>
        );
      case "RAY":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#00d4aa",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            R
          </Avatar>
        );
      case "JUP":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#ff8c42",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            J
          </Avatar>
        );
      case "ORCA":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#00c2ff",
              fontSize: size * 0.3,
              fontWeight: "bold",
            }}
          >
            🐋
          </Avatar>
        );
      case "POPCAT":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#f59e0b",
              fontSize: size * 0.3,
              fontWeight: "bold",
            }}
          >
            🐱
          </Avatar>
        );
      case "BOME":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#10b981",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            B
          </Avatar>
        );
      case "MEME":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#ef4444",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            M
          </Avatar>
        );
      case "FLOKI":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#f97316",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            F
          </Avatar>
        );
      case "SHIB":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#f59e0b",
              fontSize: size * 0.3,
              fontWeight: "bold",
            }}
          >
            🐕
          </Avatar>
        );
      case "DOGE":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#eab308",
              fontSize: size * 0.3,
              fontWeight: "bold",
            }}
          >
            🐶
          </Avatar>
        );
      case "SRM":
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#6366f1",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            S
          </Avatar>
        );
      default:
        return (
          <Avatar
            sx={{
              width: size,
              height: size,
              bgcolor: "#6b7280",
              fontSize: size * 0.35,
              fontWeight: "bold",
            }}
          >
            {symbol.charAt(0)}
          </Avatar>
        );
    }
  };

  return getTokenIcon();
};
