import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Presentational building blocks for the Oracle Games redesign.
 * They hold no contract logic, so each page can wrap the existing
 * Scaffold-ETH components (tables, widgets, modals) in the new look.
 * Styles live in styles/oracle-games.css.
 */

export type Game = "home" | "council" | "stakes" | "bluff";
export type Tone = "good" | "warn" | "bad" | "muted" | "accent";

export const GameShell = ({ game, children }: { game: Game; children: ReactNode }) => (
  <div className={`og-page og-${game}`}>{children}</div>
);

type GameHeroProps = {
  label: string;
  title: string;
  children: ReactNode;
  aside?: ReactNode;
};

export const GameHero = ({ label, title, children, aside }: GameHeroProps) => (
  <section className="og-row">
    <div className="og-grow-1" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
      <span className="og-sticker">{label}</span>
      <h1 className="og-display og-h1">{title}</h1>
      <div className="og-lead">{children}</div>
    </div>
    {aside && <div className="og-grow-1">{aside}</div>}
  </section>
);

export type Step = { title: string; body: string };

export const HowToPlay = ({ steps }: { steps: Step[] }) => (
  <section aria-label="How to play" className="og-steps">
    {steps.map((step, i) => (
      <div key={step.title} className="og-card-flat og-step">
        <span className="og-step-num" aria-hidden="true">
          {i + 1}
        </span>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>{step.title}</p>
          <p className="og-soft" style={{ margin: "2px 0 0", fontSize: 15 }}>
            {step.body}
          </p>
        </div>
      </div>
    ))}
  </section>
);

type GameCardProps = {
  title: string;
  header?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** A white card with an optional coloured header strip in the game's accent. */
export const GameCard = ({ title, header, children, className = "" }: GameCardProps) => (
  <section className={`og-card ${className}`} aria-label={title}>
    <div className="og-card-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span className="og-pixel" style={{ fontSize: 15 }}>
        {title}
      </span>
      {header}
    </div>
    {children}
  </section>
);

export type Payoff = { label: string; amount: string; body: string; tone: Tone };

export const PayoffCards = ({ title, items }: { title: string; items: Payoff[] }) => (
  <section className="og-stack">
    <h2 className="og-display og-h2">{title}</h2>
    <div className="og-steps">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`og-card og-tone-${item.tone} ${i % 2 === 0 ? "og-tilt-l" : "og-tilt-r"}`}
          style={{ flex: "1 1 240px", padding: 20, boxShadow: "4px 4px 0 var(--og-ink)" }}
        >
          <span className="og-pixel" style={{ fontSize: 13 }}>
            {item.label}
          </span>
          <p className="og-display" style={{ fontSize: 36, margin: "6px 0" }}>
            {item.amount}
          </p>
          <p style={{ margin: 0, fontWeight: 600 }}>{item.body}</p>
        </div>
      ))}
    </div>
  </section>
);

type PlotTwistProps = { title: string; children: ReactNode; link?: { href: string; label: string } };

export const PlotTwist = ({ title, children, link }: PlotTwistProps) => (
  <aside className="og-card og-tone-warn og-tilt-r og-stack" style={{ gap: 12 }}>
    <span className="og-pixel" style={{ fontSize: 13 }}>
      Plot twist
    </span>
    <h2 className="og-display" style={{ fontSize: 26 }}>
      {title}
    </h2>
    <div>{children}</div>
    {link && (
      <Link href={link.href} className="og-link">
        {link.label} →
      </Link>
    )}
  </aside>
);

type LaneProps = { title: string; hint: string; count: number; tone: Tone; children: ReactNode };

/** One column of the Call the Bluff board. */
export const Lane = ({ title, hint, count, tone, children }: LaneProps) => (
  <section className={`og-lane og-tone-${tone}`} aria-label={title}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <h3 className="og-display" style={{ fontSize: 22 }}>
        {title}
      </h3>
      <span className="og-chip" aria-label={`${count} questions`}>
        {count}
      </span>
    </div>
    <p className="og-soft" style={{ margin: 0, fontSize: 14 }}>
      {hint}
    </p>
    <div className="og-card-flat og-scroll" style={{ padding: 8 }}>
      {children}
    </div>
  </section>
);

export type GamePitch = {
  num: string;
  vibe: string;
  title: string;
  pitch: string;
  body: string;
  win: string;
  lose: string;
  href: string;
  cta: string;
  game: Exclude<Game, "home">;
};

export const GamePitchCard = ({ game }: { game: GamePitch }) => (
  <article
    className={`og-card og-${game.game}`}
    style={{ flex: "1 1 320px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}
  >
    <div className="og-card-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span className="og-pixel" style={{ fontSize: 14 }}>
        {game.num}
      </span>
      <span className="og-chip">{game.vibe}</span>
    </div>
    <div className="og-stack" style={{ gap: 6 }}>
      <h2 className="og-display" style={{ fontSize: 32 }}>
        {game.title}
      </h2>
      <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{game.pitch}</p>
      <p className="og-soft" style={{ margin: 0 }}>
        {game.body}
      </p>
    </div>
    <div className="og-stack" style={{ gap: 8 }}>
      <p className="og-card-flat og-tone-good" style={{ margin: 0, padding: "10px 12px" }}>
        <span className="og-pixel" style={{ fontSize: 13, marginRight: 10 }}>
          Win
        </span>
        <strong>{game.win}</strong>
      </p>
      <p className="og-card-flat og-tone-bad" style={{ margin: 0, padding: "10px 12px" }}>
        <span className="og-pixel" style={{ fontSize: 13, marginRight: 10 }}>
          Lose
        </span>
        <strong>{game.lose}</strong>
      </p>
    </div>
    <Link
      href={game.href}
      className="og-btn og-btn-dark"
      style={{ marginTop: "auto", boxShadow: "4px 4px 0 var(--og-accent)" }}
    >
      {game.cta} →
    </Link>
  </article>
);
