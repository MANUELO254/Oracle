"use client";

import { Address } from "@scaffold-ui/components";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { PriceWidget } from "~~/components/oracle/PriceWidget";
import { GameCard, GameHero, GameShell, HowToPlay, PlotTwist } from "~~/components/oracle/games/GameUI";
import { WhitelistTable } from "~~/components/oracle/whitelist/WhitelistTable";
import { useScaffoldReadContract, useTargetNetwork } from "~~/hooks/scaffold-eth";

const WhitelistPage: NextPage = () => {
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  const { data: owner } = useScaffoldReadContract({
    contractName: "WhitelistOracle",
    functionName: "owner",
  });

  const { data: staleWindow } = useScaffoldReadContract({
    contractName: "WhitelistOracle",
    functionName: "STALE_DATA_WINDOW",
  });

  const seconds = staleWindow !== undefined ? Number(staleWindow) : 24;
  const youAreOwner = !!address && !!owner && address.toLowerCase() === owner.toLowerCase();

  return (
    <GameShell game="council">
      <GameHero
        label="Game 01 · Whitelist oracle"
        title="The Council"
        aside={
          <GameCard title="The council says">
            <PriceWidget contractName="WhitelistOracle" />
          </GameCard>
        }
      >
        A hand-picked panel shouts out the price. We line up their answers and take the{" "}
        <strong>one in the middle</strong>, so a single wild guess can’t steer it. Go quiet for {seconds} seconds and
        you’re out of the vote.
      </GameHero>

      <HowToPlay
        steps={[
          { title: "Everyone shouts a price", body: "Each council member posts what they think it is." },
          { title: "Quiet ones sit out", body: `Answers older than ${seconds} seconds don’t count.` },
          { title: "The middle wins", body: "Line them up, pick the one in the middle." },
        ]}
      />

      <section className="og-row" style={{ alignItems: "flex-start" }}>
        <div className="og-grow-2 og-stack">
          <h2 className="og-display og-h2">The council</h2>
          <div className="og-card og-scroll" style={{ padding: 12 }}>
            <WhitelistTable />
          </div>
        </div>

        <div className="og-grow-1">
          <PlotTwist
            title="Who picked the council?"
            link={{ href: "/staking", label: "Don’t like trusting one owner? Try Skin in the Game" }}
          >
            <p style={{ margin: "0 0 12px" }}>
              One owner decides who sits here. If that wallet gets hacked, or just goes rogue, it can pack the council
              with friends and set any price it likes.
            </p>
            <div className="og-card-flat" style={{ padding: "10px 12px", fontSize: 14 }}>
              <span style={{ display: "block", marginBottom: 4 }}>Owner{youAreOwner ? " (that’s you)" : ""}</span>
              <Address address={owner} chain={targetNetwork} />
            </div>
          </PlotTwist>
        </div>
      </section>
    </GameShell>
  );
};

export default WhitelistPage;
