import { LoopVideo } from "./LoopVideo";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden rounded-b-[32px]">
      <LoopVideo src={HERO_VIDEO} className="absolute inset-0 h-full w-full object-cover" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1831px] flex-col justify-center px-4 pb-16 sm:px-8 lg:px-12">
        <div className="relative max-w-[780px] -translate-y-16 lg:ml-32">
          <h1 className="font-grotesk text-[40px] uppercase leading-[1.05] text-cream sm:text-[60px] md:text-[75px] md:leading-[1] lg:text-[90px]">
            <span className="hero-line">This is reefy</span>
            <span className="hero-line hero-line-late">the suit on the coin</span>
          </h1>
          <span className="hero-script pointer-events-none absolute right-0 top-[38%] font-condiment text-[24px] text-neon mix-blend-exclusion sm:text-[32px] md:text-[40px] lg:text-[48px]">
            Keeps the fee
          </span>
        </div>
      </div>
    </section>
  );
}
