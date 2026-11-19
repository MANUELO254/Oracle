"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { type GamePitch, GamePitchCard, GameShell } from "~~/components/oracle/games/GameUI";

const games: GamePitch[] = [
  {
    game: "council",
    num: "Game 01",
    vibe: "Trust the panel",
    title: "The Council",
    pitch: "Ask the experts, take the middle.",
    body: "An owner appoints a panel of reporters. The answer is the middle of what they say, so one wild guess can’t drag it far.",
    win: "Get appointed, stay chatty",
    lose: "Go quiet for 24 seconds",
    href: "/whitelist",
    cta: "Meet the council",
  },
  {
    game: "stakes",
    num: "Game 02",
    vibe: "Bet your chips",
    title: "Skin in the Game",
    pitch: "Put your money where your mouth is.",
    body: "Lock up ORA to take a seat. Report close to everyone else and earn. Report something wild and anyone can grab a chunk of your chips.",
    win: "Earn ORA for honest reports",
    lose: "Get slashed for wild ones",
    href: "/staking",
    cta: "Take a seat",
  },
  {
    game: "bluff",
    num: "Game 03",
    vibe: "Spot the liar",
    title: "Call the Bluff",
    pitch: "Innocent until challenged.",
    body: "Ask any yes/no question. Someone answers and bets on it. If nobody calls their bluff in time, the answer stands.",
    win: "Be right (or catch a liar)",
    lose: "Get caught bluffing",
    href: "/optimistic",
    cta: "Ask a question",
  },
];

const cheatSheet = [
  { q: "Who answers?", a: "Hand-picked reporters", b: "Anyone who stakes ORA", c: "Anyone willing to bet" },
  { q: "Why believe them?", a: "They mostly agree", b: "Lying costs them chips", c: "Nobody called the bluff" },
  { q: "What stops a liar?", a: "The middle ignores outliers", b: "Slashing", c: "A challenger takes their bet" },
  { q: "How fast?", a: "Instant", b: "Every round (24 blocks)", c: "After the challenge window" },
];

const Home: NextPage = () => {
  return (
    <GameShell game="home">
      <section className="og-stack" style={{ gap: 18 }}>
        <span className="og-sticker">Speedrun Ethereum · Oracles</span>
        <h1 className="og-display og-h1" style={{ maxWidth: 760 }}>
          Three games. One question: who do you believe?
        </h1>
        <p className="og-lead" style={{ maxWidth: 620 }}>
          Smart contracts can’t peek outside the blockchain, so someone has to tell them things, like a price or whether
          it rained. Every oracle is a little game for making sure that someone tells the truth. Pick one and play.
        </p>
      </section>

      <section aria-label="The three games" className="og-row">
        {games.map(game => (
          <GamePitchCard key={game.title} game={game} />
        ))}
      </section>

      <section className="og-stack" style={{ gap: 20 }}>
        <h2 className="og-display og-h2">Cheat sheet</h2>
        <div className="og-card og-scroll" style={{ padding: 0 }}>
          <table style={{ width: "100%", minWidth: 760, borderCollapse: "collapse", fontSize: 16 }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th scope="col" style={{ padding: "16px 20px" }}>
                  <span className="sr-only">Question</span>
                </th>
                <th scope="col" style={{ padding: "16px 20px" }}>
                  <span className="og-chip" style={{ background: "var(--og-council)" }}>
                    The Council
                  </span>
                </th>
                <th scope="col" style={{ padding: "16px 20px" }}>
                  <span className="og-chip" style={{ background: "var(--og-stakes)" }}>
                    Skin in the Game
                  </span>
                </th>
                <th scope="col" style={{ padding: "16px 20px" }}>
                  <span className="og-chip" style={{ background: "var(--og-bluff)" }}>
                    Call the Bluff
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {cheatSheet.map(row => (
                <tr key={row.q} style={{ borderTop: "2px dashed #b7d3cc" }}>
                  <th scope="row" style={{ padding: "16px 20px", textAlign: "left" }}>
                    {row.q}
                  </th>
                  <td style={{ padding: "16px 20px" }}>{row.a}</td>
                  <td style={{ padding: "16px 20px" }}>{row.b}</td>
                  <td style={{ padding: "16px 20px" }}>{row.c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="og-soft" style={{ margin: 0 }}>
        Want to poke the contracts directly? Use the{" "}
        <Link href="/debug" className="og-link">
          Debug Contracts
        </Link>{" "}
        tab.
      </p>
    </GameShell>
  );
};

export default Home;
