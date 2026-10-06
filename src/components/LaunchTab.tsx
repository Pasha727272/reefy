import { useEffect, useRef, useState, type FormEvent } from "react";
import { suitById, suits, type Launch, type SuitId } from "../data/reefy";
import { LoopVideo } from "./LoopVideo";

type LaunchTabProps = {
  suitId: SuitId;
  wallet: string | null;
  launches: Launch[];
  onSuit: (id: SuitId) => void;
  onLaunch: (launch: Launch) => void;
};

function linkHref(value: string, kind: "x" | "site") {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (kind === "x") {
    const handle = trimmed.replace(/^@/, "").replace(/^(www\.)?(x|twitter)\.com\//i, "");
    if (!handle || handle.includes("/")) return handle.includes(".") ? `https://${trimmed}` : "";
    return `https://x.com/${handle}`;
  }
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

const fieldClass =
  "mt-2 w-full rounded-[20px] border-2 border-cream/80 bg-[#162044] px-4 py-4 font-mono text-[14px] uppercase text-cream outline-none transition placeholder:text-cream/70 focus:border-neon focus:bg-[#1c2852]";

export function LaunchTab({ suitId, wallet, onSuit, onLaunch }: LaunchTabProps) {
  const suit = suitById(suitId);
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");
  const [x, setX] = useState("");
  const [site, setSite] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [toast, setToast] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  function showAuthToast() {
    setToast(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setToast(false), 7000);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setNotice("");

    if (!wallet) {
      setError("");
      showAuthToast();
      return;
    }

    const cleanName = name.trim();
    const cleanTicker = ticker.replace(/[^a-zA-Z]/g, "").toUpperCase();
    const cleanDescription = description.trim();
    const cleanX = linkHref(x, "x");
    const cleanSite = linkHref(site, "site");

    if (x.trim() && !cleanX) {
      setError("X link needs a handle or a url.");
      return;
    }
    if (site.trim() && !cleanSite) {
      setError("Website needs a domain or a url.");
      return;
    }

    if (cleanName.length < 2) {
      setError("Name needs at least 2 characters.");
      return;
    }
    if (cleanTicker.length < 2 || cleanTicker.length > 8) {
      setError("Ticker is 2–8 letters.");
      return;
    }
    if (cleanDescription.length < 8) {
      setError("Tell the suit what this coin is about.");
      return;
    }

    setError("");
    onLaunch({
      id: crypto.randomUUID(),
      name: cleanName,
      ticker: cleanTicker,
      description: cleanDescription,
      suitId,
      anchor: "",
      x: cleanX,
      site: cleanSite,
      createdAt: Date.now(),
    });
    setName("");
    setTicker("");
    setDescription("");
    setX("");
    setSite("");
    setNotice(`$${cleanTicker} is sewn to ${suit.name}. Saved in this browser only. Nothing was sent onchain.`);
  }

  const shownTicker = ticker.replace(/[^a-zA-Z]/g, "").toUpperCase() || "TOKEN";

  return (
    <>
    <section className="mx-auto grid max-w-[1831px] gap-10 px-4 pb-16 pt-2 sm:px-8 sm:pb-20 sm:pt-3 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-12 lg:pb-24">
      <form onSubmit={handleSubmit} className="min-w-0">
        <h1 className="font-grotesk text-[32px] uppercase leading-[0.95] text-cream sm:text-[42px] md:text-[52px] lg:text-[60px]">
          Launch a
          <span className="mt-2 block ml-12 md:ml-24 lg:ml-32">
            <span className="font-condiment normal-case text-neon">coin</span> with a suit
          </span>
        </h1>
        <p className="mt-6 max-w-[420px] font-mono text-[14px] uppercase leading-relaxed text-cream sm:text-[16px]">
          One signature. Fixed supply. Pool against SOL. Liquidity locked. The fee wallet is this coin's chest, not yours.
        </p>

        <fieldset className="mt-10">
          <legend className="font-grotesk text-[22px] uppercase text-cream sm:text-[28px]">1 The coin</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
            <label className="block">
              <span className="font-mono text-[12px] uppercase text-cream">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={32}
                placeholder="My token"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="font-mono text-[12px] uppercase text-cream">Ticker</span>
              <input
                value={ticker}
                onChange={(event) => setTicker(event.target.value.toUpperCase())}
                maxLength={8}
                placeholder="TOKEN"
                className={fieldClass}
              />
            </label>
          </div>
          <label className="mt-3 block">
            <span className="font-mono text-[12px] uppercase text-cream">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={240}
              placeholder="What is this coin about?"
              className={`${fieldClass} resize-none`}
            />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[12px] uppercase text-cream">X</span>
              <input
                value={x}
                onChange={(event) => setX(event.target.value)}
                maxLength={120}
                placeholder="x.com/reefy"
                inputMode="url"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="font-mono text-[12px] uppercase text-cream">Website</span>
              <input
                value={site}
                onChange={(event) => setSite(event.target.value)}
                maxLength={160}
                placeholder="reefy.xyz"
                inputMode="url"
                className={fieldClass}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="mt-10">
          <legend className="font-grotesk text-[22px] uppercase text-cream sm:text-[28px]">2 Its suit</legend>
          <p className="mt-2 max-w-xl font-mono text-[12px] uppercase leading-relaxed text-cream/60">
            The choice is permanent. Under each helmet: the buff, and the day it is weak.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {suits.map((item) => {
              const selected = item.id === suitId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSuit(item.id)}
                  aria-pressed={selected}
                  className={`rounded-[28px] text-left transition ${selected ? "ring-2 ring-neon" : ""}`}
                >
                  <article className="liquid-glass rounded-[28px] p-3 transition hover:bg-white/10">
                    <div className="relative overflow-hidden rounded-[20px] pb-[100%]">
                      <LoopVideo src={item.video} className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <p className="mt-3 font-grotesk text-[20px] uppercase text-cream">{item.name}</p>
                    <p className="font-condiment text-[22px] text-neon">{item.buff}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase leading-relaxed text-cream/60">
                      {item.weakness}
                    </p>
                  </article>
                </button>
              );
            })}
          </div>
        </fieldset>

        {error ? (
          <p className="mt-6 font-mono text-[12px] uppercase text-[#ffb4b4]" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="mt-6 font-mono text-[12px] uppercase text-neon" role="status">
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          className="liquid-glass group mt-8 inline-flex items-center gap-5 rounded-[28px] bg-[#162044] px-6 py-4 text-cream transition hover:bg-[#1c2852]"
        >
          <span className="flex items-baseline gap-3">
            <span className="font-grotesk text-[32px] uppercase leading-none sm:text-[40px]">Launch</span>
            <span className="font-condiment text-[36px] normal-case leading-none text-neon sm:text-[44px]">coin</span>
          </span>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neon text-space shadow-lg shadow-neon/30 transition group-hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h12M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </form>

      <aside className="h-fit lg:sticky lg:top-28">
        <div className="liquid-glass rounded-[32px] p-[18px]">
          <div className="relative overflow-hidden rounded-[24px] pb-[100%]">
            <LoopVideo src={suit.video} className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="px-2 pb-2 pt-4">
            <p className="font-mono text-[11px] uppercase text-cream/50">Your coin</p>
            <p className="mt-1 font-grotesk text-[40px] uppercase leading-none text-cream">${shownTicker}</p>
            <p className="mt-3 font-condiment text-[28px] text-neon">
              {suit.name} · {suit.buff}
            </p>
            <p className="mt-2 font-mono text-[12px] uppercase leading-relaxed text-cream/70">
              {suit.summary}
            </p>
            <div className="mt-3 flex flex-col gap-1 font-mono text-[12px] uppercase">
              {linkHref(x, "x") ? (
                <a href={linkHref(x, "x")} target="_blank" rel="noreferrer" className="text-neon hover:underline">
                  X · {x.trim()}
                </a>
              ) : null}
              {linkHref(site, "site") ? (
                <a href={linkHref(site, "site")} target="_blank" rel="noreferrer" className="text-neon hover:underline">
                  Site · {site.trim()}
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="liquid-glass mt-4 rounded-[28px] p-5">
          <p className="font-grotesk text-[22px] uppercase text-cream">Where the fees go</p>
          <ol className="mt-4 space-y-3">
            {suit.fees.map((line, index) => (
              <li key={line} className="flex gap-3">
                <span className="font-mono text-[12px] text-neon">0{index + 1}</span>
                <span className="font-mono text-[12px] uppercase leading-relaxed text-cream/70">{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </section>
      {toast ? (
        <div
          role="status"
          className="toast-rise fixed bottom-6 right-6 z-50 w-[min(320px,calc(100%-2rem))] rounded-[20px] border border-white/25 bg-space px-5 py-4 shadow-lg"
        >
          <p className="font-grotesk text-[20px] uppercase leading-none text-cream">Launch coin</p>
          <p className="mt-3 font-mono text-[12px] uppercase leading-relaxed text-cream/85">
            To launch a coin, authorize on the site.
          </p>
        </div>
      ) : null}
    </>
  );
}
