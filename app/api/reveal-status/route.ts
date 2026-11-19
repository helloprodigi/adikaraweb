import { connection } from "next/server";
import {
  getRevealStatus,
  getServerNow,
  REVEAL_AT_MS,
} from "@/components/rankings/revealSchedule";

export async function GET() {
  await connection();
  const serverNow = getServerNow();

  return Response.json(
    {
      serverNow,
      revealAt: REVEAL_AT_MS,
      ...getRevealStatus(serverNow),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    }
  );
}
