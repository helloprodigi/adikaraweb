import { Suspense } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { TeamScore } from "@/components/team-score/TeamScore";
import { RevealGate } from "@/components/rankings/RevealGate";
import { getServerNow } from "@/components/rankings/revealSchedule";
import {
  getValidCheckedNim,
  SCORE_CHECK_COOKIE,
} from "@/components/rankings/scoreCheckServer";

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
  const checkedNim = getValidCheckedNim(
    cookieStore.get(SCORE_CHECK_COOKIE)?.value
  );
  const authorized = Boolean(checkedNim && queryNim && checkedNim === queryNim);

  return (
    <RevealGate initialServerNow={serverNow} authorized={authorized}>
      <Suspense fallback={null}>
        <TeamScore />
      </Suspense>
    </RevealGate>
  );
}
