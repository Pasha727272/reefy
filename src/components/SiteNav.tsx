import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS } from "../data/reefy";
import { connectWallet, shortAddress, type WalletKind } from "../wallet";

export type View = "home" | "suits" | "launch" | "board";

const links: { label: string; view: View; hash: string }[] = [
  { label: "Homepage", view: "home", hash: "#home" },
  { label: "Suits", view: "suits", hash: "#suits" },
  { label: "Launch", view: "launch", hash: "#launch" },
  { label: "FAQ", view: "home", hash: "#about" },
  { label: "Board", view: "board", hash: "#board" },
];

type SiteNavProps = {
  current: View;
  hash: string;
  onNavigate: (view: View, hash: string) => void;
};

type SiteHeaderProps = SiteNavProps & {
  wallet: string | null;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
};

export function SiteHeader({ current, hash, onNavigate, wallet, onConnect, onDisconnect }: SiteHeaderProps) {
  return (
    <header className="relative flex flex-wrap items-center gap-3">
      <div className="order-3 flex w-full justify-center lg:absolute lg:left-1/2 lg:top-1/2 lg:order-none lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2">
        <SiteNav current={current} hash={hash} onNavigate={onNavigate} />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ContractCopy />
        <ConnectButton wallet={wallet} onConnect={onConnect} onDisconnect={onDisconnect} />
      </div>
    </header>
  );
}

function ContractCopy() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="liquid-glass flex items-center gap-2 rounded-[20px] px-3 py-3 font-mono text-[11px] uppercase text-cream transition hover:bg-white/10 sm:px-4 sm:text-[12px]"
    >
      <span className="text-neon">CA</span>
      <span>{shortAddress(CONTRACT_ADDRESS)}</span>
      <span className="text-cream/70">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function ConnectButton({
  wallet,
  onConnect,
  onDisconnect,
}: {
  wallet: string | null;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<WalletKind | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function choose(kind: WalletKind) {
    setError("");
    setPending(kind);
    try {
      const address = await connectWallet(kind);
      onConnect(address);
      setOpen(false);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not connect.";
      if (!/user rejected|user denied/i.test(message)) setError(message);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          if (wallet) {
            onDisconnect();
            setOpen(false);
            return;
          }
          setOpen((value) => !value);
        }}
        className="liquid-glass rounded-[20px] px-4 py-3 font-grotesk text-[13px] uppercase text-cream transition hover:bg-white/10 sm:px-5"
      >
        {wallet ? shortAddress(wallet) : "Connect"}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-[20px] bg-space p-2 shadow-lg">
          <div className="liquid-glass rounded-[16px] p-2">
            <WalletChoice label="MetaMask" busy={pending === "metamask"} onClick={() => void choose("metamask")} />
            <WalletChoice label="Phantom" busy={pending === "phantom"} onClick={() => void choose("phantom")} />
            {error ? <p className="px-3 py-2 font-mono text-[11px] uppercase text-[#ffb4b4]">{error}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function WalletChoice({ label, busy, onClick }: { label: string; busy: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="block w-full rounded-[12px] px-3 py-3 text-left font-grotesk text-[14px] uppercase text-cream transition hover:bg-white/10 disabled:opacity-60"
    >
      {busy ? "Waiting…" : label}
    </button>
  );
}

export function SiteNav({ current, hash, onNavigate }: SiteNavProps) {
  const activeHash = hash === "" ? "#home" : hash;

  return (
    <nav className="liquid-glass max-w-full overflow-x-auto rounded-[28px] px-5 py-4 lg:px-[52px] lg:py-[24px]">
      <ul className="flex items-center gap-4 sm:gap-6 xl:gap-8">
        {links.map((link) => {
          const active = current === link.view && activeHash === link.hash;
          return (
            <li key={link.label}>
              <button
                type="button"
                onClick={() => onNavigate(link.view, link.hash)}
                className={`whitespace-nowrap font-grotesk text-[13px] uppercase transition hover:text-neon ${
                  active ? "text-neon" : "text-cream"
                }`}
              >
                {link.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
