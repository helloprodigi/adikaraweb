import { connection } from "next/server";
import RankingsClient from "./RankingsClient";
import { CountdownGate } from "@/components/rankings/CountdownGate";
import { finalistCategories } from "@/components/rankings/finalists";
import {
  getRevealStatus,
  getServerNow,
} from "@/components/rankings/revealSchedule";

export default async function RankingsPage() {
  await connection();
  const serverNow = getServerNow();
  const { isRevealed } = getRevealStatus(serverNow);

  // Data finalis tidak dikirim ke browser sebelum jam reveal.
  if (!isRevealed) {
    return <CountdownGate initialServerNow={serverNow} />;
  }

  return (
    <RankingsClient
      initialServerNow={serverNow}
      categories={finalistCategories}
    />
  );
}
