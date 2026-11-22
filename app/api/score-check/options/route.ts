import { connection } from "next/server";
import {
  SCORE_COMPETITIONS,
  type ScoreCompetitionOption,
} from "@/components/rankings/scoreCompetition";
import {
  getRevealStatus,
  getServerNow,
} from "@/components/rankings/revealSchedule";
import { findCompetitionsByNim } from "@/components/team-score/teamScores";

// Hanya mengembalikan daftar lomba yang diikuti NIM — tidak ada nama tim,
// skor, atau data sensitif lain. Dipakai untuk memutuskan apakah card pilihan
// lomba perlu ditampilkan.
export async function GET(request: Request) {
  await connection();

  if (!getRevealStatus(getServerNow()).isRevealed) {
    return Response.json({ error: "locked" }, { status: 403 });
  }

  const nim = new URL(request.url).searchParams.get("nim")?.trim() ?? "";
  if (!nim) {
    return Response.json({ error: "nim required" }, { status: 400 });
  }

  const ids = findCompetitionsByNim(nim);
  if (ids.length === 0) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  const competitions: ScoreCompetitionOption[] = SCORE_COMPETITIONS.filter(
    (competition) => ids.includes(competition.id)
  ).map((competition) => ({ id: competition.id, label: competition.label }));

  return Response.json(
    { nim, competitions },
    { headers: { "Cache-Control": "no-store" } }
  );
}
