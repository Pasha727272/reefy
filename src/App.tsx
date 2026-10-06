import { useEffect, useState } from "react";
import { About } from "./components/About";
import { BoardTab } from "./components/BoardTab";
import { Collection } from "./components/Collection";
import { Cta } from "./components/Cta";
import { Hero } from "./components/Hero";
import { LaunchTab } from "./components/LaunchTab";
import { SiteHeader, type View } from "./components/SiteNav";
import { SuitsTab } from "./components/SuitsTab";
import { loadLaunches, saveLaunches, type Launch, type SuitId } from "./data/reefy";

function readView(): View {
  const hash = window.location.hash;
  if (hash === "#suits") return "suits";
  if (hash === "#launch") return "launch";
  if (hash === "#board") return "board";
  return "home";
}

export default function App() {
  const [view, setView] = useState<View>(readView);
  const [hash, setHash] = useState(() => window.location.hash || "#home");
  const [suitId, setSuitId] = useState<SuitId>("reefy");
  const [describedId, setDescribedId] = useState<SuitId | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [launches, setLaunches] = useState<Launch[]>(() => loadLaunches());

  useEffect(() => {
    const onHash = () => {
      setView(readView());
      setHash(window.location.hash || "#home");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (view !== "home") {
      window.scrollTo(0, 0);
      return;
    }
    const id = (window.location.hash || "#home").replace("#", "");
    if (!id || id === "home") {
      window.scrollTo(0, 0);
      return;
    }
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [view, hash]);

  function show(next: View, nextHash: string) {
    if (next !== "suits") setDescribedId(null);
    if (window.location.hash === nextHash) {
      setView(next);
      setHash(nextHash);
      return;
    }
    window.location.hash = nextHash;
  }

  function openSuit(id: SuitId) {
    setDescribedId(id);
    setSuitId(id);
    show("suits", "#suits");
  }

  function launchWith(id: SuitId) {
    setSuitId(id);
    show("launch", "#launch");
  }

  function addLaunch(launch: Launch) {
    const next = [launch, ...launches];
    setLaunches(next);
    saveLaunches(next);
  }

  return (
    <div className="min-h-svh bg-space text-cream">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-8 sm:pt-6 lg:px-12">
        <div className="pointer-events-auto mx-auto max-w-[1831px]">
          <SiteHeader
            current={view}
            hash={hash}
            onNavigate={show}
            wallet={wallet}
            onConnect={setWallet}
            onDisconnect={() => setWallet(null)}
          />
        </div>
      </div>
      {view === "home" ? (
        <main>
          <Hero />
          <About />
          <Collection onOpen={openSuit} />
          <Cta />
        </main>
      ) : (
        <main className="pt-24 sm:pt-28">
          {view === "suits" ? (
            <SuitsTab describedId={describedId} onDescribe={setDescribedId} onLaunch={launchWith} />
          ) : view === "board" ? (
            <BoardTab launches={launches} />
          ) : (
            <LaunchTab
              suitId={suitId}
              wallet={wallet}
              launches={launches}
              onSuit={setSuitId}
              onLaunch={addLaunch}
            />
          )}
        </main>
      )}
    </div>
  );
}
