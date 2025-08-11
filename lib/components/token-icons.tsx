import Image from "next/image";

export const SolanaIcon = ({ size = 24 }: { size?: number }) => (
  <Image
    src="/images/solana-coin.svg"
    width={size}
    height={size}
    alt="Solana"
    style={{ borderRadius: "50%" }}
  />
);

export const BachIcon = ({ size = 24 }: { size?: number }) => (
  <Image
    src="https://raw.githubusercontent.com/solana-labs/token-list/badd1dbe8c2d1e38c4f77b77f1d5fd5c60d3cccb/assets/mainnet/CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf/bach-token-logo-Est.2022.png"
    width={size}
    height={size}
    alt="BACH Token"
    style={{ borderRadius: "50%" }}
  />
);
