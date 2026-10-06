export type SuitId = "vello" | "reefy" | "nymo";

export type Suit = {
  id: SuitId;
  name: string;
  score: string;
  video: string;
  buff: string;
  role: string;
  summary: string;
  description: string;
  weakness: string;
  tide: string;
  fees: [string, string, string];
};

export type Anchor = {
  id: string;
  label: string;
};

export type Launch = {
  id: string;
  name: string;
  ticker: string;
  description: string;
  suitId: SuitId;
  anchor: string;
  x: string;
  site: string;
  createdAt: number;
};

/** Solana mint shown in the header. Swap this for the deployed mint before sharing the link. */
export const CONTRACT_ADDRESS = "ReefyMintPlaceholder11111111111111111";

export const suits: Suit[] = [
  {
    id: "reefy",
    name: "REEFY",
    score: "8.7/10",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4",
    buff: "Amber",
    role: "Dip shield",
    summary: "Cheapens buys under the launch price. Buys back on a red day.",
    description:
      "Amber visor, eyes shut, red button on the chest. This is the suit on the first screen. Fees fill this coin's chest, not the launcher's pocket. While the coin sits under its launch average, the chest pays part of the pool fee so a buy is cheaper. The chest itself buys back only on a red day. On a green day REEFY stays quiet and saves. Once each tide, if the chest is full, anyone can press the red button and open one short buyback window.",
    weakness: "In a parabola REEFY is almost useless. He is about fear, not hype.",
    tide: "While REEFY holds the tide, the chest also buys back on a flat day.",
    fees: [
      "Every trade pays this coin's chest, not the launcher.",
      "The chest cheapens buys while price is under the launch average.",
      "A red close on the coin is what arms the buyback.",
    ],
  },
  {
    id: "vello",
    name: "VELLO",
    score: "9/10",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4",
    buff: "Reef",
    role: "Thicker book",
    summary: "Adds fees back into the pool. Pays wallets that did not sell.",
    description:
      "Fuzzy helmet, antenna, open smile. A share of every fee is poured back into the pool, so the book gets thicker and one order moves the price less. The antenna counts wallets that have not sold since the last tide. They get a drip from the chest, sized by how long they held. A sale resets that streak. Above the normal fee, a seller pays a thin toll, and it goes to the wallets that stayed.",
    weakness: "In the first hour there is nobody to pay. Rarity 9/10 is a late strength.",
    tide: "While VELLO holds the tide, the drip doubles.",
    fees: [
      "Every trade pays this coin's chest, not the launcher.",
      "Part of the chest deepens the pool.",
      "The rest drips to wallets that held through the tide.",
    ],
  },
  {
    id: "nymo",
    name: "NYMO",
    score: "8.2/10",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4",
    buff: "Thrust",
    role: "New wallets",
    summary: "Burns the chest for each new buyer. Repeat wallets do not count.",
    description:
      "Smooth face, lit eyes and mouth, thrusters on the back. Each new unique buyer in a tide burns a slice of the chest. The same wallet buying again does not count. On the tape a coin's place is unique traders, and NYMO multiplies that count. If SOL gaps up, the burn per new buyer is stronger until the next tide ends. There is no dip shield and no pay for a long hold.",
    weakness: "When new people stop arriving, NYMO goes dark.",
    tide: "While NYMO holds the tide, the burn per new buyer doubles.",
    fees: [
      "Every trade pays this coin's chest, not the launcher.",
      "A new wallet burns a slice of that chest.",
      "An up-gap on SOL makes the next burn stronger.",
    ],
  },
];

export const anchors: Anchor[] = [{ id: "SOL", label: "SOL" }];

export const fleets: { id: SuitId; traders: number }[] = [
  { id: "reefy", traders: 214 },
  { id: "vello", traders: 128 },
  { id: "nymo", traders: 96 },
];

export function tideHolder(): SuitId {
  return fleets.reduce((best, row) => (row.traders > best.traders ? row : best)).id;
}

export function suitById(id: SuitId): Suit {
  const suit = suits.find((item) => item.id === id);
  if (!suit) throw new Error(`Unknown suit ${id}`);
  return suit;
}

const STORAGE_KEY = "reefy.launches";

function isLaunch(value: unknown): value is Launch {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<Launch>;
  return (
    typeof row.id === "string" &&
    typeof row.name === "string" &&
    typeof row.ticker === "string" &&
    typeof row.description === "string" &&
    (row.suitId === "vello" || row.suitId === "reefy" || row.suitId === "nymo") &&
    typeof row.anchor === "string" &&
    typeof row.createdAt === "number"
  );
}

export function loadLaunches(): Launch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isLaunch).map((row) => ({
      ...row,
      x: typeof row.x === "string" ? row.x : "",
      site: typeof row.site === "string" ? row.site : "",
    }));
  } catch {
    return [];
  }
}

export function saveLaunches(launches: Launch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(launches));
}
