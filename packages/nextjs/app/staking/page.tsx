"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { BucketCountdown } from "~~/components/oracle/BucketCountdown";
import { BuyOraWidget } from "~~/components/oracle/BuyOraWidget";
import { NodesTable } from "~~/components/oracle/NodesTable";
import { PriceWidget } from "~~/components/oracle/PriceWidget";
import { TotalSlashedWidget } from "~~/components/oracle/TotalSlashedWidget";
import { GameCard, GameHero, GameShell, HowToPlay, PayoffCards } from "~~/components/oracle/games/GameUI";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

/** Formats an 18-decimal token amount, e.g. 100000000000000000000n -> "100". */
const ora = (value: bigint | undefined, fallback: string) => (value === undefined ? fallback : formatEther(value));

const StakingPage: NextPage = () => {
  const [selectedBucket, setSelectedBucket] = useState<bigint | "current">("current");

  const { data: minimumStake } = useScaffoldReadContract({
    contractName: "StakingOracle",
    functionName: "MINIMUM_STAKE",
  });
  const { data: rewardPerReport } = useScaffoldReadContract({
    contractName: "StakingOracle",
    functionName: "REWARD_PER_REPORT",
  });
  const { data: inactivityPenalty } = useScaffoldReadContract({
    contractName: "StakingOracle",
    functionName: "INACTIVITY_PENALTY",
  });
  const { data: misreportPenalty } = useScaffoldReadContract({
    contractName: "StakingOracle",
    functionName: "MISREPORT_PENALTY",
  });
  const { data: maxDeviationBps } = useScaffoldReadContract({
    contractName: "StakingOracle",
    functionName: "MAX_DEVIATION_BPS",
  });
  const { data: slasherPercent } = useScaffoldReadContract({
    contractName: "StakingOracle",
    functionName: "SLASHER_REWARD_PERCENTAGE",
  });
  const { data: bucketWindow } = useScaffoldReadContract({
    contractName: "StakingOracle",
    functionName: "BUCKET_WINDOW",
  });

  const minStake = ora(minimumStake, "100");
  const deviation = maxDeviationBps !== undefined ? Number(maxDeviationBps) / 100 : 10;
  const cut = slasherPercent !== undefined ? Number(slasherPercent) : 10;
  const blocks = bucketWindow !== undefined ? Number(bucketWindow) : 24;

  return (
    <GameShell game="stakes">
      <GameHero
        label="Game 02 · Staking oracle"
        title="Skin in the Game"
        aside={
          <GameCard title="Get chips">
            <p className="og-soft" style={{ margin: "0 0 12px" }}>
              You need at least <strong>{minStake} ORA</strong> to take a seat at the table.
            </p>
            <BuyOraWidget />
          </GameCard>
        }
      >
        Anyone can pull up a chair by putting {minStake} ORA chips on the table. Every round, players call out the
        price. Stay close to the crowd and you earn. Shout something wild and{" "}
        <strong>anyone can call you out and grab your chips</strong>.
      </GameHero>

      <HowToPlay
        steps={[
          { title: "Take a seat", body: `Stake at least ${minStake} ORA.` },
          { title: "Call the price", body: `Once per round. A round lasts ${blocks} blocks.` },
          { title: "Score the round", body: "Anyone can record the round’s middle price once it ends." },
          { title: "Busted or paid", body: `More than ${deviation}% off the middle? You can be slashed.` },
        ]}
      />

      <PayoffCards
        title="What happens to your chips"
        items={[
          {
            label: "Stay close",
            amount: `+${ora(rewardPerReport, "1")} ORA`,
            body: "For every round you report. Collect it with Claim Rewards.",
            tone: "good",
          },
          {
            label: "Go quiet",
            amount: `−${ora(inactivityPenalty, "1")} ORA`,
            body: "For every round you skip. Your stack slowly melts.",
            tone: "warn",
          },
          {
            label: "Shout something wild",
            amount: `−${ora(misreportPenalty, "100")} ORA`,
            body: `More than ${deviation}% off? Whoever calls you out pockets ${cut}% of it.`,
            tone: "bad",
          },
        ]}
      />

      <section aria-label="This round" className="og-row">
        <div className="og-card og-grow-1" style={{ padding: 0, overflow: "hidden" }}>
          <PriceWidget contractName="StakingOracle" />
        </div>
        <div className="og-card og-grow-1" style={{ padding: 0, overflow: "hidden" }}>
          <BucketCountdown />
        </div>
        <div className="og-card og-grow-1 og-tone-accent" style={{ padding: 0, overflow: "hidden" }}>
          <TotalSlashedWidget />
        </div>
      </section>

      <section className="og-stack">
        <h2 className="og-display og-h2">The table</h2>
        <p className="og-soft" style={{ margin: 0 }}>
          Pick a round to see everyone’s call. Spot one more than {deviation}% off the middle? Call them out and earn{" "}
          {cut}% of their penalty.
        </p>
        <div className="og-card og-scroll" style={{ padding: 12 }}>
          <NodesTable selectedBucket={selectedBucket} onBucketChange={setSelectedBucket} />
        </div>
      </section>
    </GameShell>
  );
};

export default StakingPage;
