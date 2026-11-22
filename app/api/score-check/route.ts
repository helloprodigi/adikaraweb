import { cookies } from "next/headers";
import { isScoreCompetitionId } from "@/components/rankings/scoreCompetition";
import {
  DATA_MINING_REVEAL_AT_MS,
  getDataMiningRevealStatus,
  getRevealStatus,
  getServerNow,
} from "@/components/rankings/revealSchedule";
import { findTeamByNim } from "@/components/team-score/teamScores";
import {
  createScoreCheckValue,
  SCORE_CHECK_COOKIE,
} from "@/components/rankings/scoreCheckServer";

export async function POST(request: Request) {
  // Check nilai hanya bisa dipanggil setelah reveal. Sebelum jam pengumuman,
  // tidak ada jalan untuk mendapat cookie bertanda tangan dari sisi klien.
  const serverNow = getServerNow();
  if (!getRevealStatus(serverNow).isRevealed) {
    return Response.json({ ok: false }, { status: 403 });
  }

  let nim = "";
  let competition: unknown;
  try {
    const body = (await request.json()) as {
      nim?: unknown;
      competition?: unknown;
    };
    if (typeof body.nim === "string") nim = body.nim.trim();
    competition = body.competition;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!nim || !isScoreCompetitionId(competition)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Kompetisi yang dipilih ikut menentukan record yang dicari, jadi NIM yang
  // mengikuti beberapa lomba tidak bisa membuka kategori yang tidak dipilih.
  const record = findTeamByNim(nim, competition);
  if (!record) {
    return Response.json(
      { ok: false, error: "not found" },
      {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  // Data Mining belum diumumkan. Jangan terbitkan cookie, dan jangan kirim
  // data tim sama sekali — hanya status terkunci + jadwalnya.
  if (
    competition === "data-mining" &&
    !getDataMiningRevealStatus(serverNow).isRevealed
  ) {
    return Response.json(
      {
        ok: false,
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

  const cookieStore = await cookies();
  cookieStore.set(SCORE_CHECK_COOKIE, createScoreCheckValue(nim, competition), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return Response.json(
    { ok: true, competition },
    { headers: { "Cache-Control": "no-store" } }
  );
}
