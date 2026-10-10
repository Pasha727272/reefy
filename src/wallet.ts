export type SolanaProvider = {
  isPhantom?: boolean;
  publicKey?: { toString(): string } | null;
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string } }>;
  disconnect?: () => Promise<void>;
};

export function getPhantomSolana(): SolanaProvider | null {
  const browser = window as Window & {
    solana?: SolanaProvider;
    phantom?: { solana?: SolanaProvider };
  };
  const fromPhantom = browser.phantom?.solana;
  if (fromPhantom?.isPhantom) return fromPhantom;
  if (browser.solana?.isPhantom) return browser.solana;
  return null;
}

export function shortAddress(address: string) {
  if (address.length < 12) return address;
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}
