import { useEffect, useRef } from "react";
import { suits, type SuitId } from "../data/reefy";
import { LoopVideo } from "./LoopVideo";

type SuitsTabProps = {
  describedId: SuitId | null;
  onDescribe: (id: SuitId | null) => void;
  onLaunch: (id: SuitId) => void;
};

export function SuitsTab({ describedId, onDescribe, onLaunch }: SuitsTabProps) {
  const panelRef = useRef<HTMLElement>(null);
  const described = suits.find((suit) => suit.id === describedId) ?? null;

  useEffect(() => {
    if (!described) return;
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [described]);

  return (
    <section className="mx-auto max-w-[1831px] px-4 pb-16 pt-2 sm:px-8 sm:pb-20 sm:pt-3 lg:px-12 lg:pb-24">
      <div className="mb-6 flex flex-col gap-10 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="font-grotesk text-[32px] uppercase leading-[0.95] text-cream sm:text-[42px] md:text-[52px] lg:text-[60px]">
          One crew
          <span className="mt-2 block ml-12 md:ml-24 lg:ml-32">
            <span className="font-condiment normal-case text-neon">Three</span> suits
          </span>
        </h1>
        <p className="max-w-[266px] font-mono text-[14px] uppercase leading-relaxed text-cream sm:text-[16px]">
          Press a suit. The rule under the helmet is what the coin keeps after launch.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suits.map((suit) => {
          const open = suit.id === describedId;
          return (
            <button
              key={suit.id}
              type="button"
              onClick={() => onDescribe(open ? null : suit.id)}
              aria-expanded={open}
              aria-controls="suit-description"
              className={`rounded-[32px] text-left transition ${open ? "ring-2 ring-neon" : ""}`}
            >
              <article className="liquid-glass relative rounded-[32px] p-[18px] transition hover:bg-white/10">
                <div className="relative w-full overflow-hidden rounded-[24px] pb-[100%]">
                  <LoopVideo src={suit.video} className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="absolute inset-x-[30px] bottom-[30px] z-10">
                  <div className="liquid-glass flex items-center justify-between gap-3 overflow-visible rounded-[20px] px-5 py-4">
                    <p className="font-grotesk text-[20px] uppercase leading-none text-cream">{suit.name}</p>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] shadow-lg shadow-purple-500/50">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M5 12h12M13 6l6 6-6 6"
                          stroke="white"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            </button>
          );
        })}
      </div>

      <div id="suit-description" className="mt-6" aria-live="polite">
        {described ? (
          <article ref={panelRef} className="liquid-glass rounded-[32px] p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="font-condiment text-[28px] text-neon sm:text-[36px]">{described.buff}</p>
                <h2 className="mt-1 font-grotesk text-[32px] uppercase leading-[0.95] text-cream sm:text-[48px]">
                  {described.name}
                </h2>
                <p className="mt-4 font-mono text-[14px] uppercase leading-relaxed text-cream sm:text-[16px]">
                  {described.description}
                </p>
                <p className="mt-4 font-mono text-[14px] uppercase leading-relaxed text-cream/70">
                  Weak day: {described.weakness}
                </p>
                <p className="mt-3 font-mono text-[14px] uppercase leading-relaxed text-cream/70">
                  {described.tide}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onLaunch(described.id)}
                className="inline-flex w-fit shrink-0 flex-col text-cream"
              >
                <span className="flex items-center gap-3">
                  <span className="font-grotesk text-[32px] uppercase leading-none sm:text-[42px]">Launch</span>
                  <span className="flex flex-col font-grotesk text-[20px] uppercase leading-[0.9] sm:text-[26px]">
                    <span>With</span>
                    <span>{described.name}</span>
                  </span>
                </span>
                <span className="mt-2 h-[6px] w-full bg-neon sm:h-2" />
              </button>
            </div>
            <ol className="mt-8 grid gap-3 sm:grid-cols-3">
              {described.fees.map((line, index) => (
                <li key={line} className="rounded-[20px] bg-white/5 px-4 py-4">
                  <p className="font-mono text-[11px] uppercase text-neon">0{index + 1}</p>
                  <p className="mt-2 font-mono text-[12px] uppercase leading-relaxed text-cream/80">{line}</p>
                </li>
              ))}
            </ol>
          </article>
        ) : (
          <p className="rounded-[32px] border border-dashed border-white/15 px-6 py-10 text-center font-mono text-[14px] uppercase text-cream/50">
            Press a suit to open its rule.
          </p>
        )}
      </div>
    </section>
  );
}
