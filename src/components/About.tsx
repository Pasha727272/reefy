import { useEffect, useRef, useState, type ReactNode } from "react";
import { LoopVideo } from "./LoopVideo";

const ABOUT_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4";

const HOOK =
  "A launchpad on Solana. One suit is sewn to the coin and never comes off.";

const CHAPTERS: { title: string; body: string }[] = [
  {
    title: "The coin",
    body: "You name the coin, set the ticker, and pick one suit. One signature. Supply stays fixed. The pool is against SOL. Liquidity is locked.",
  },
  {
    title: "The chest",
    body: "Trading fees do not pay the person who launched. They fill this coin's chest. The suit is the only thing allowed to spend it. No volume, the chest is empty and the suit sleeps.",
  },
  {
    title: "Reefy",
    body: "Amber visor, eyes shut, red button on the chest. While the coin is under its launch price, his chest cheapens a buy. The red button opens one short buyback when the chest is full. In a straight run up he only saves.",
  },
  {
    title: "Vello",
    body: "Fuzzy helmet with the antenna. Part of the fee goes back into the pool, so one order moves the price less. Wallets that have not sold since the last tide get a drip. A sale resets the streak.",
  },
  {
    title: "Nymo",
    body: "Smooth face, lit eyes, thrusters. Each new wallet in a tide burns a slice of the chest. The same wallet buying again does not count. When new people stop arriving, Nymo goes dark.",
  },
  {
    title: "The tide",
    body: "Once a day the tide is counted: whichever suit has more unique traders buffs every coin that wears it until the next day.",
  },
];

function RiseCard({ delay, children }: { delay: number; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.28 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`story-frame liquid-glass h-full rounded-[20px] bg-space/80 px-5 py-4 transition-[transform,opacity] duration-700 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      {children}
    </article>
  );
}

export function About() {
  return (
    <section id="about" className="relative min-h-screen">
      <LoopVideo src={ABOUT_VIDEO} className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-space/35" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1831px] flex-col px-4 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative w-fit pr-16">
            <h2 className="font-grotesk text-[32px] uppercase leading-[0.95] text-cream sm:text-[42px] md:text-[52px] lg:text-[60px]">
              The chest
              <br />
              spends it
            </h2>
            <span className="pointer-events-none absolute bottom-1 right-0 font-condiment text-[36px] leading-none text-neon mix-blend-exclusion -rotate-6 sm:text-[48px] md:text-[58px] lg:text-[68px]">
              Reefy
            </span>
          </div>

          <p className="max-w-[280px] font-mono text-[13px] uppercase leading-relaxed text-cream sm:text-[15px] lg:text-right">
            {HOOK}
          </p>
        </div>

        <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2 lg:mt-10 lg:gap-5">
          {CHAPTERS.map((chapter, index) => (
            <RiseCard key={chapter.title} delay={Math.floor(index / 2) * 160 + (index % 2) * 90}>
              <p className="font-condiment text-[26px] leading-none text-neon">{chapter.title}</p>
              <p className="mt-2 font-mono text-[12px] uppercase leading-relaxed text-cream/90 sm:text-[13px]">
                {chapter.body}
              </p>
            </RiseCard>
          ))}
        </div>
      </div>
    </section>
  );
}
