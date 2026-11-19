import { cookies } from "next/headers";
import { findTeamByNim } from "@/components/team-score/teamScores";
import {
  createScoreCheckValue,
  SCORE_CHECK_COOKIE,
} from "@/components/rankings/scoreCheckServer";

export async function POST(request: Request) {
  let nim = "";
  try {
    const body = (await request.json()) as { nim?: unknown };
    if (typeof body.nim === "string") nim = body.nim.trim();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!nim || !findTeamByNim(nim)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SCORE_CHECK_COOKIE, createScoreCheckValue(nim), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return Response.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
