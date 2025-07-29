export interface Activity {
  amount: number;
  date: string;
  type: "received" | "sent" | "airdrop";
  coin: string;
  id: string;
}

export const activities: Activity[] = [
  {
    amount: 10.9345,
    date: "Jun 9, 2025",
    type: "airdrop",
    coin: "BACH",
    id: "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf",
  },
  {
    amount: 100.0,
    date: "Jun 10, 2025",
    type: "received",
    coin: "BACH",
    id: "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf",
  },
  {
    amount: 50.0,
    date: "Jun 11, 2025",
    type: "sent",
    coin: "BACH",
    id: "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf",
  },
  {
    amount: 25.0,
    date: "Jun 12, 2025",
    type: "received",
    coin: "BACH",
    id: "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf",
  },
  {
    amount: 10.0,
    date: "Jun 13, 2025",
    type: "sent",
    coin: "BACH",
    id: "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf",
  },
  {
    amount: 5.0,
    date: "Jun 14, 2025",
    type: "received",
    coin: "USDC",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    amount: 2.5,
    date: "Jun 15, 2025",
    type: "sent",
    coin: "USDC",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    amount: 1.25,
    date: "Jun 16, 2025",
    type: "received",
    coin: "USDC",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    amount: 0.625,
    date: "Jun 17, 2025",
    type: "sent",
    coin: "USDC",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    amount: 0.3125,
    date: "Jun 18, 2025",
    type: "received",
    coin: "USDC",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    amount: 0.15625,
    date: "Jun 19, 2025",
    type: "sent",
    coin: "USDC",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
];

export const activitiesTestnet: Activity[] = [
  {
    amount: 100.0,
    date: "Jun 10, 2025",
    type: "received",
    coin: "BACH",
    id: "A6a2s9LTZcYZQgxrDatLHYfvHhJEfb5ZWuFENhHtxJtR",
  },
  {
    amount: 50.0,
    date: "Jun 11, 2025",
    type: "sent",
    coin: "BACH",
    id: "A6a2s9LTZcYZQgxrDatLHYfvHhJEfb5ZWuFENhHtxJtR",
  },
  {
    amount: 25.0,
    date: "Jun 12, 2025",
    type: "received",
    coin: "BACH",
    id: "A6a2s9LTZcYZQgxrDatLHYfvHhJEfb5ZWuFENhHtxJtR",
  },
  {
    amount: 10.0,
    date: "Jun 13, 2025",
    type: "sent",
    coin: "BACH",
    id: "A6a2s9LTZcYZQgxrDatLHYfvHhJEfb5ZWuFENhHtxJtR",
  },
  {
    amount: 5.0,
    date: "Jun 14, 2025",
    type: "received",
    coin: "USDC",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    amount: 2.5,
    date: "Jun 15, 2025",
    type: "sent",
    coin: "USDC",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    amount: 1.25,
    date: "Jun 16, 2025",
    type: "received",
    coin: "USDC",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    amount: 0.625,
    date: "Jun 17, 2025",
    type: "sent",
    coin: "USDC",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    amount: 0.3125,
    date: "Jun 18, 2025",
    type: "received",
    coin: "USDC",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    amount: 0.15625,
    date: "Jun 19, 2025",
    type: "sent",
    coin: "USDC",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
];
