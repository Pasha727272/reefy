import { useEffect, useState } from "react";
import { suitById, type Launch, type SuitId } from "../data/reefy";
import { shortAddress } from "../wallet";

type Sort = "new" | "volume" | "mine";

type ListedCoin = {
  id: string;
  ticker: string;
  suitId: SuitId;
  mcap: number;
  minutes: number;
  ca: string;
};

const SEEDS: { id: string; ticker: string; suitId: SuitId }[] = [
  { id: "red", ticker: "REDD", suitId: "reefy" },
  { id: "thrust", ticker: "THRS", suitId: "nymo" },
  { id: "drip", ticker: "DRIP", suitId: "vello" },
  { id: "drift", ticker: "DRFT", suitId: "reefy" },
  { id: "fuzz", ticker: "FUZZ", suitId: "vello" },
  { id: "night", ticker: "NYTE", suitId: "nymo" },
];

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const filters: { id: Sort; label: string }[] = [
  { id: "new", label: "New" },
  { id: "volume", label: "Volume" },
  { id: "mine", label: "My coin" },
];

function solanaMint() {
  const bytes = new Uint8Array(44);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => BASE58[byte % BASE58.length]).join("");
}

function openingMcap() {
  const value = 5000 + Math.random() * 13000;
  return Math.round(value * 100) / 100;
}

function minuteLabel(minutes: number) {
  return minutes === 1 ? "1 min" : `${minutes} min`;
}

function formatMcap(value: number) {
  return `MC $${(value / 1000).toFixed(2)}K`;
}

function makeBoard(): ListedCoin[] {
  return SEEDS.map((seed) => ({
    ...seed,
    mcap: openingMcap(),
    minutes: 1 + Math.floor(Math.random() * 5),
    ca: solanaMint(),
  }));
}

export function BoardTab({ launches }: { launches: Launch[] }) {
  const [sort, setSort] = useState<Sort>("new");
  const [coins, setCoins] = useState<ListedCoin[]>(makeBoard);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCoins((rows) =>
        rows.map((row) => {
          const delta = (Math.random() * 6 - 3) * 10;
          const next = Math.max(5000, Math.round((row.mcap + delta) * 100) / 100);
          return { ...row, mcap: next };
        }),
      );
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  const shown = [...coins].sort((a, b) => (sort === "volume" ? b.mcap - a.mcap : a.minutes - b.minutes));

  return (
    <section className="mx-auto max-w-[1831px] px-4 pb-16 pt-2 sm:px-8 sm:pb-20 sm:pt-3 lg:px-12 lg:pb-24">
      <div className="mb-6 flex flex-col gap-8 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="font-grotesk text-[32px] uppercase leading-[0.95] text-cream sm:text-[42px] md:text-[52px] lg:text-[60px]">
          The board
          <span className="mt-2 block ml-12 md:ml-24 lg:ml-32">
            <span className="font-condiment normal-case text-neon">Live</span> coins
          </span>
        </h1>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => {
            const active = sort === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSort(filter.id)}
                aria-pressed={active}
                className={`liquid-glass rounded-[20px] px-5 py-3 font-grotesk text-[16px] uppercase transition hover:bg-white/10 sm:text-[18px] ${
                  active ? "bg-[#162044] text-neon" : "text-cream"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {sort === "mine" ? (
        launches.length === 0 ? (
          <p className="rounded-[32px] border border-dashed border-white/15 px-6 py-16 text-center font-mono text-[14px] uppercase leading-relaxed text-cream/60 sm:text-[16px]">
            You have not created a coin yet.
          </p>
        ) : (
          <ul className="grid gap-3">
            {launches.map((launch) => {
              const suit = suitById(launch.suitId);
              return (
                <li key={launch.id} className="liquid-glass flex items-center gap-4 rounded-[24px] px-5 py-4 sm:px-6">
                  <p className="font-grotesk text-[26px] uppercase leading-none text-cream sm:text-[32px]">${launch.ticker}</p>
                  <p className="font-condiment text-[26px] leading-none text-neon sm:text-[30px]">{suit.name}</p>
                </li>
              );
            })}
          </ul>
        )
      ) : (
        <ul className="grid gap-3">
          {shown.map((coin) => {
            const suit = suitById(coin.suitId);
            return (
              <li key={coin.id} className="liquid-glass flex items-center justify-between gap-4 rounded-[24px] px-5 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <p className="shrink-0 font-grotesk text-[26px] uppercase leading-none text-cream sm:text-[32px]">
                    ${coin.ticker}
                  </p>
                  <p className="shrink-0 font-condiment text-[26px] leading-none text-neon sm:text-[30px]">{suit.name}</p>
                  <p className="truncate font-mono text-[12px] uppercase text-cream/70 sm:text-[13px]">
                    <span className="text-neon">CA</span> {shortAddress(coin.ca)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-[13px] text-cream">{formatMcap(coin.mcap)}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase text-cream/45">{minuteLabel(coin.minutes)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
