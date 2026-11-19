import { cookies } from "next/headers";
import { connection } from "next/server";
import RankingsClient from "./RankingsClient";
import { CountdownGate } from "@/components/rankings/CountdownGate";
import { finalistCategories } from "@/components/rankings/finalists";
import {
  getRevealStatus,
  getServerNow,
} from "@/components/rankings/revealSchedule";
import {
  hasValidScoreCheckCookie,
  SCORE_CHECK_COOKIE,
} from "@/components/rankings/scoreCheckServer";

export default async function RankingsPage() {
  await connection();
  const serverNow = getServerNow();
  const { isRevealed } = getRevealStatus(serverNow);

  // Data finalis tidak dikirim ke browser sebelum jam reveal.
  if (!isRevealed) {
    return <CountdownGate initialServerNow={serverNow} />;
  }

  const cookieStore = await cookies();
  const initialHasChecked = hasValidScoreCheckCookie(
    cookieStore.get(SCORE_CHECK_COOKIE)?.value
  );

  return (
    <RankingsClient
      initialServerNow={serverNow}
      initialHasChecked={initialHasChecked}
      categories={finalistCategories}
    />
  );
}
