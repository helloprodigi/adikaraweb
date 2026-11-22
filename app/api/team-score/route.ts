import { cookies } from "next/headers";
import { connection } from "next/server";
import {
  isDataMiningCompetition,
  isScoreCompetitionId,
} from "@/components/rankings/scoreCompetition";
import {
  DATA_MINING_REVEAL_AT_MS,
  getDataMiningRevealStatus,
  getRevealStatus,
  getServerNow,
} from "@/components/rankings/revealSchedule";
import {
  getValidCheckedScore,
  SCORE_CHECK_COOKIE,
} from "@/components/rankings/scoreCheckServer";
import {
  findCompetitionsByNim,
  findTeamByNim,
} from "@/components/team-score/teamScores";

export async function GET(request: Request) {
  await connection();
  const serverNow = getServerNow();
  const url = new URL(request.url);
  const nim = url.searchParams.get("nim")?.trim() ?? "";
  const rawCompetition = url.searchParams.get("competition");
  // Link lama tanpa param tetap membuka lomba non-Data Mining jika ada.
  const available = findCompetitionsByNim(nim);
  const competition = isScoreCompetitionId(rawCompetition)
    ? rawCompetition
    : (available.find((id) => !isDataMiningCompetition(id)) ?? available[0]);

  const cookieStore = await cookies();
  const checked = getValidCheckedScore(
    cookieStore.get(SCORE_CHECK_COOKIE)?.value
  );
  const authorized = Boolean(
    nim &&
      competition &&
      checked &&
      checked.nim === nim &&
      checked.competition === competition
  );

  if (!getRevealStatus(serverNow).isRevealed && !authorized) {
    return Response.json({ error: "locked" }, { status: 403 });
  }
  if (!nim) {
    return Response.json({ error: "nim required" }, { status: 400 });
  }
  if (!competition) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  // Data Mining dicek terlebih dahulu dan tidak bisa dibuka dengan cookie mana
  // pun: sebelum jamnya response tidak boleh membocorkan field tim sama sekali.
  if (
    isDataMiningCompetition(competition) &&
    !getDataMiningRevealStatus(serverNow).isRevealed
  ) {
    return Response.json(
      {
        error: "locked",
        locked: "data-mining",
        revealAt: DATA_MINING_REVEAL_AT_MS,
        remainingMs: Math.max(0, DATA_MINING_REVEAL_AT_MS - serverNow),
      },
      {
        status: 423,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  const record = findTeamByNim(nim, competition);
  if (!record) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  // HP hanya bagian dari database server, tidak dikirim ke browser.
  const publicRecord = { ...record };
  delete publicRecord.hp;

  return Response.json(publicRecord, {
    headers: { "Cache-Control": "no-store" },
  });
}
