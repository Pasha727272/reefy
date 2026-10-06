export type WalletKind = "metamask" | "phantom";

type SolanaProvider = {
  isPhantom?: boolean;
  publicKey?: { toString(): string } | null;
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string } }>;
};

type WalletAccount = {
  address: string;
};

type StandardWallet = {
  name: string;
  features: {
    "standard:connect"?: {
      connect: () => Promise<{ accounts: readonly WalletAccount[] }>;
    };
  };
};

const INSTALL: Record<WalletKind, string> = {
  phantom: "https://phantom.com/download",
  metamask: "https://metamask.io/download/",
};

function phantomProvider(): SolanaProvider | null {
  const browser = window as Window & {
    solana?: SolanaProvider;
    phantom?: { solana?: SolanaProvider };
  };
  return browser.phantom?.solana ?? (browser.solana?.isPhantom ? browser.solana : null);
}

function findMetaMask(): Promise<StandardWallet | null> {
  return new Promise((resolve) => {
    let match: StandardWallet | null = null;
    const onRegister = (event: Event) => {
      const announce = (event as CustomEvent<(api: { register: (wallet: StandardWallet) => void }) => void>).detail;
      if (typeof announce !== "function") return;
      announce({
        register: (wallet) => {
          if (/metamask/i.test(wallet.name) && wallet.features["standard:connect"]) match = wallet;
        },
      });
    };

    window.addEventListener("wallet-standard:register-wallet", onRegister);
    window.dispatchEvent(new Event("wallet-standard:app-ready"));
    window.setTimeout(() => {
      window.removeEventListener("wallet-standard:register-wallet", onRegister);
      resolve(match);
    }, 400);
  });
}

export async function connectWallet(kind: WalletKind): Promise<string> {
  if (kind === "phantom") {
    const provider = phantomProvider();
    if (!provider) {
      window.open(INSTALL.phantom, "_blank", "noopener,noreferrer");
      throw new Error("Install Phantom, then connect again.");
    }
    const response = await provider.connect();
    const account = response.publicKey?.toString() ?? provider.publicKey?.toString();
    if (!account) throw new Error("The wallet did not return an account.");
    return account;
  }

  const wallet = await findMetaMask();
  const connect = wallet?.features["standard:connect"]?.connect;
  if (!wallet || !connect) {
    window.open(INSTALL.metamask, "_blank", "noopener,noreferrer");
    throw new Error("Install MetaMask, then connect again.");
  }

  const { accounts } = await connect();
  const account = accounts[0]?.address;
  if (!account) throw new Error("Open a Solana account in MetaMask, then connect again.");
  return account;
}

export function shortAddress(address: string) {
  if (address.length < 12) return address;
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}
