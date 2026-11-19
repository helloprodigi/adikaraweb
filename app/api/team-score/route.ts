import { cookies } from "next/headers";
import { connection } from "next/server";
import {
  getRevealStatus,
  getServerNow,
} from "@/components/rankings/revealSchedule";
import {
  getValidCheckedNim,
  SCORE_CHECK_COOKIE,
} from "@/components/rankings/scoreCheckServer";
import { findTeamByNim } from "@/components/team-score/teamScores";

export async function GET(request: Request) {
  await connection();
  const serverNow = getServerNow();
  const nim = new URL(request.url).searchParams.get("nim")?.trim() ?? "";
  const cookieStore = await cookies();
  const checkedNim = getValidCheckedNim(
    cookieStore.get(SCORE_CHECK_COOKIE)?.value
  );
  const authorized = Boolean(nim && checkedNim === nim);

  if (!getRevealStatus(serverNow).isRevealed && !authorized) {
    return Response.json({ error: "locked" }, { status: 403 });
  }
  if (!nim) {
    return Response.json({ error: "nim required" }, { status: 400 });
  }

  const record = findTeamByNim(nim);
  if (!record) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  return Response.json(record, {
    headers: { "Cache-Control": "no-store" },
  });
}
