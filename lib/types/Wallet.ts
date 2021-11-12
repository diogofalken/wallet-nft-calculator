export type Wallet = {
  addr: string;
  "itn_reward": number;
  lovelaces: number;
  pool: string;
  reward: number;
  synched: number;
  tokens: {
    fingerprint: string;
    metadata: unknown;
    minted: number;
    name: string;
    policy: string;
    quantity: number;
  }[];
  utxos: number;
  "vote_reward": number;
  withdrawal: number;
};
