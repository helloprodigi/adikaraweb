import { Suspense } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { TeamScore } from "@/components/team-score/TeamScore";
import {
  isDataMiningCompetition,
  isScoreCompetitionId,
} from "@/components/rankings/scoreCompetition";
import { DataMiningCountdownGate } from "@/components/rankings/DataMiningCountdownGate";
import { RevealGate } from "@/components/rankings/RevealGate";
import { getDataMiningRevealStatus, getServerNow } from "@/components/rankings/revealSchedule";
import {
  getValidCheckedScore,
  SCORE_CHECK_COOKIE,
} from "@/components/rankings/scoreCheckServer";
import { findCompetitionsByNim } from "@/components/team-score/teamScores";

function firstString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TeamScorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await connection();
  const serverNow = getServerNow();
  const [params, cookieStore] = await Promise.all([searchParams, cookies()]);
  const queryNim = (firstString(params.nim) ?? firstString(params.id) ?? "").trim();
  const rawCompetition = firstString(params.competition);
  const available = findCompetitionsByNim(queryNim);
  const competition = isScoreCompetitionId(rawCompetition)
    ? rawCompetition
    : (available.find((id) => !isDataMiningCompetition(id)) ?? available[0]);
  const checked = getValidCheckedScore(
    cookieStore.get(SCORE_CHECK_COOKIE)?.value
  );
  const authorized = Boolean(
    checked &&
      queryNim &&
      competition &&
      checked.nim === queryNim &&
      checked.competition === competition
  );

  // Keputusan ini dibuat di server, bukan dari jam/penyimpanan browser dan tidak
  // bisa dibypass dengan mengubah param URL atau cookie: sebelum jam 16:00 tidak
  // ada data tim Data Mining yang dirender maupun dikirim ke klien.
  const dataMiningLocked = Boolean(
    competition &&
      isDataMiningCompetition(competition) &&
      !getDataMiningRevealStatus(serverNow).isRevealed
  );

  return (
    <RevealGate initialServerNow={serverNow} authorized={authorized}>
      <Suspense fallback={null}>
        {dataMiningLocked ? (
          <DataMiningCountdownGate initialServerNow={serverNow} />
        ) : (
          <TeamScore />
        )}
      </Suspense>
    </RevealGate>
  );
}
