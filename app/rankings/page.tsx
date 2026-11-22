import { connection } from "next/server";
import RankingsClient from "./RankingsClient";
import { CountdownGate } from "@/components/rankings/CountdownGate";
import { finalistCategories } from "@/components/rankings/finalists";
import {
  getDataMiningRevealStatus,
  getRevealStatus,
  getServerNow,
} from "@/components/rankings/revealSchedule";

export default async function RankingsPage() {
  await connection();
  const serverNow = getServerNow();
  const { isRevealed } = getRevealStatus(serverNow);

  // Data finalis tidak dikirim ke browser sebelum jam reveal umum.
  if (!isRevealed) {
    return <CountdownGate initialServerNow={serverNow} />;
  }

  // Data Mining punya jadwal sendiri. Sebelum jamnya, daftar finalisnya sengaja
  // tidak ikut dikirim supaya tidak bisa dibuka lewat response/server HTML.
  const dataMiningRevealed = getDataMiningRevealStatus(serverNow).isRevealed;
  const categories = finalistCategories.map((category) =>
    category.id === "data-mining" && !dataMiningRevealed
      ? { ...category, finalists: [] }
      : category
  );

  return (
    <RankingsClient
      initialServerNow={serverNow}
      categories={categories}
      dataMiningRevealed={dataMiningRevealed}
    />
  );
}
