import { LoopVideo } from "./LoopVideo";

const CTA_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4";

export function Cta() {
  return (
    <section id="contact" className="relative bg-space">
      <LoopVideo src={CTA_VIDEO} className="block h-auto w-full" />

      <div className="absolute inset-0 flex items-center justify-end lg:pl-[15%] lg:pr-[20%]">
        <div className="relative mr-4 w-fit max-w-[92%] translate-y-8 px-4 text-right sm:mr-8 sm:translate-y-12 sm:px-8 lg:mr-0 lg:translate-y-16 lg:px-0">
          <span className="pointer-events-none absolute left-0 top-0 -translate-y-full font-condiment text-[17px] leading-none text-neon mix-blend-exclusion sm:text-[32px] md:text-[48px] lg:text-[68px]">
            Reefy
          </span>
          <h2 className="font-grotesk text-[16px] uppercase leading-[0.92] text-cream sm:text-[28px] md:text-[42px] lg:text-[60px]">
            <span className="block">Sew the suit.</span>
            <span className="block">Fill the chest.</span>
            <span className="block">Hold the tide.</span>
          </h2>
        </div>
      </div>

    </section>
  );
}
