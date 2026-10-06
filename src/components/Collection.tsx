import { suits, type SuitId } from "../data/reefy";
import { LoopVideo } from "./LoopVideo";

type CollectionProps = {
  onOpen: (id: SuitId) => void;
};

export function Collection({ onOpen }: CollectionProps) {
  return (
    <section id="gallery" className="bg-space py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1831px] px-4 sm:px-8 lg:px-12">
        <div className="mb-12 flex flex-col gap-10 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-grotesk text-[32px] uppercase leading-[0.95] text-cream sm:text-[42px] md:text-[52px] lg:text-[60px]">
            The crew
            <span className="mt-2 block ml-12 md:ml-24 lg:ml-32">
              <span className="font-condiment normal-case text-neon">Reefy</span> vello nymo
            </span>
          </h2>

          <a href="#suits" className="inline-flex w-fit flex-col text-cream">
            <span className="flex items-center gap-3">
              <span className="font-grotesk text-[32px] uppercase leading-none sm:text-[42px] md:text-[52px] lg:text-[60px]">
                See
              </span>
              <span className="flex flex-col font-grotesk text-[20px] uppercase leading-[0.9] sm:text-[26px] md:text-[30px] lg:text-[36px]">
                <span>All</span>
                <span>Creators</span>
              </span>
            </span>
            <span className="mt-2 h-[6px] w-full bg-neon sm:h-2 lg:h-[10px]" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suits.map((piece) => (
            <article
              key={piece.id}
              className="liquid-glass rounded-[32px] p-[18px] transition hover:bg-white/10"
            >
              <div className="relative w-full overflow-hidden rounded-[24px] pb-[100%]">
                <LoopVideo
                  src={piece.video}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              <div className="absolute inset-x-[30px] bottom-[30px] z-10">
                <div className="liquid-glass flex items-center justify-between gap-3 overflow-visible rounded-[20px] px-5 py-4">
                  <p className="font-grotesk text-[20px] uppercase leading-none text-cream">{piece.name}</p>
                  <button
                    type="button"
                    aria-label={`Open ${piece.name}`}
                    onClick={() => onOpen(piece.id)}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] shadow-lg shadow-purple-500/50 transition hover:scale-110"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M5 12h12M13 6l6 6-6 6"
                        stroke="white"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
