"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useReadContracts } from "wagmi";
import { GameCard, GameHero, GameShell, HowToPlay, Lane, PayoffCards } from "~~/components/oracle/games/GameUI";
import { AssertedTable } from "~~/components/oracle/optimistic/AssertedTable";
import { AssertionModal } from "~~/components/oracle/optimistic/AssertionModal";
import { DisputedTable } from "~~/components/oracle/optimistic/DisputedTable";
import { ExpiredTable } from "~~/components/oracle/optimistic/ExpiredTable";
import { ProposedTable } from "~~/components/oracle/optimistic/ProposedTable";
import { SettledTable } from "~~/components/oracle/optimistic/SettledTable";
import { SubmitAssertionButton } from "~~/components/oracle/optimistic/SubmitAssertionButton";
import { useDeployedContractInfo, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useChallengeState } from "~~/services/store/challengeStore";

// Matches the State enum in OptimisticOracle.sol
const STATE = { Asserted: 1, Proposed: 2, Disputed: 3, Settled: 4, Expired: 5 } as const;

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]" role="status" aria-label="Loading questions">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--og-ink)] border-b-transparent"></div>
  </div>
);

const minutes = (seconds: bigint | undefined, fallback: number) =>
  seconds === undefined ? fallback : Math.max(1, Math.round(Number(seconds) / 60));

const OptimisticPage: NextPage = () => {
  const setRefetchAssertionStates = useChallengeState(state => state.setRefetchAssertionStates);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { data: nextAssertionId, isLoading: isLoadingNextAssertionId } = useScaffoldReadContract({
    contractName: "OptimisticOracle",
    functionName: "nextAssertionId",
    query: {
      placeholderData: (previousData: any) => previousData,
    },
  });

  const { data: disputeWindow } = useScaffoldReadContract({
    contractName: "OptimisticOracle",
    functionName: "DISPUTE_WINDOW",
  });

  const { data: deployedContractAddress, isLoading: isLoadingDeployedContract } = useDeployedContractInfo({
    contractName: "OptimisticOracle",
  });

  // One getState call per assertion, from 1 to nextAssertionId - 1
  const assertionContracts = nextAssertionId
    ? Array.from({ length: Number(nextAssertionId) - 1 }, (_, i) => ({
        address: deployedContractAddress?.address as `0x${string}`,
        abi: deployedContractAddress?.abi,
        functionName: "getState",
        args: [BigInt(i + 1)],
      })).filter(contract => contract.address && contract.abi)
    : [];

  const {
    data: assertionStates,
    refetch: refetchAssertionStates,
    isLoading: isLoadingAssertionStates,
  } = useReadContracts({
    contracts: assertionContracts,
    query: {
      placeholderData: (previousData: any) => previousData,
    },
  });

  useEffect(() => {
    if (refetchAssertionStates) {
      setRefetchAssertionStates(refetchAssertionStates);
    }
  }, [refetchAssertionStates, setRefetchAssertionStates]);

  const assertionStateMap =
    nextAssertionId && assertionStates
      ? Array.from({ length: Number(nextAssertionId) - 1 }, (_, i) => ({
          assertionId: i + 1,
          state: (assertionStates[i]?.result as number) || 0,
        }))
      : [];

  const inState = (state: number) => assertionStateMap.filter(assertion => assertion.state === state);
  const asserted = inState(STATE.Asserted);
  const proposed = inState(STATE.Proposed);
  const disputed = inState(STATE.Disputed);
  const settled = inState(STATE.Settled);
  const expired = inState(STATE.Expired);

  const isFirstLoading =
    isInitialLoading && (isLoadingNextAssertionId || isLoadingAssertionStates || isLoadingDeployedContract);

  useEffect(() => {
    if (isInitialLoading && !isLoadingNextAssertionId && !isLoadingDeployedContract && !isLoadingAssertionStates) {
      setIsInitialLoading(false);
    }
  }, [isInitialLoading, isLoadingNextAssertionId, isLoadingDeployedContract, isLoadingAssertionStates]);

  const challengeMinutes = minutes(disputeWindow, 3);

  return (
    <GameShell game="bluff">
      <GameHero
        label="Game 03 · Optimistic oracle"
        title="Call the Bluff"
        aside={
          <GameCard title="Ask the world">
            <div className="og-stack">
              <p style={{ margin: 0 }}>
                Post a yes/no question and put up a prize in ETH. Whoever answers must bet{" "}
                <strong>twice your prize</strong>. That’s what keeps them honest.
              </p>
              <SubmitAssertionButton />
            </div>
          </GameCard>
        }
      >
        Ask any yes-or-no question and put up a prize. Someone answers and <strong>bets on being right</strong>. Think
        they’re bluffing? Match their bet within {challengeMinutes} minutes and a judge settles it. Nobody objects? The
        answer stands.
      </GameHero>

      <HowToPlay
        steps={[
          { title: "Ask", body: "Post a yes/no question and a prize." },
          { title: "Answer & bet", body: "Someone answers and bets 2× the prize." },
          { title: "Call the bluff", body: `${challengeMinutes} minutes for anyone to match the bet and object.` },
          { title: "Judge rules", body: "Only if challenged. The loser’s bet pays the judge." },
        ]}
      />

      <section className="og-stack" style={{ gap: 16 }}>
        <h2 className="og-display og-h2">The board</h2>
        {isFirstLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="og-board">
            <Lane title="Waiting for an answer" hint="Answer to win the prize." count={asserted.length} tone="muted">
              <AssertedTable assertions={asserted} />
            </Lane>
            <Lane title="Answered · bluff?" hint="Disagree? Match the bet." count={proposed.length} tone="accent">
              <ProposedTable assertions={proposed} />
            </Lane>
            <Lane title="Called out" hint="The judge is deciding." count={disputed.length} tone="bad">
              <DisputedTable assertions={disputed} />
            </Lane>
            <Lane title="Settled" hint="The answer is final. Winners can collect." count={settled.length} tone="good">
              <SettledTable assertions={settled} />
            </Lane>
            <Lane title="Nobody answered" hint="The asker can take the prize back." count={expired.length} tone="warn">
              <ExpiredTable assertions={expired} />
            </Lane>
          </div>
        )}
      </section>

      <PayoffCards
        title="Who walks away with what"
        items={[
          { label: "Answer, nobody objects", amount: "+ prize", body: "Your bet comes back too.", tone: "good" },
          {
            label: "Challenged, you’re right",
            amount: "+ prize",
            body: "Your bet comes back. The loser’s bet pays the judge.",
            tone: "good",
          },
          {
            label: "Challenged, you’re wrong",
            amount: "− your bet",
            body: "The other side wins the prize. Only bet when you’re sure.",
            tone: "bad",
          },
        ]}
      />

      <AssertionModal />
    </GameShell>
  );
};

export default OptimisticPage;
