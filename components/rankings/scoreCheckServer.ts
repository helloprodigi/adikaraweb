import { createHmac, timingSafeEqual } from "node:crypto";
import {
  isScoreCompetitionId,
  type ScoreCompetitionId,
} from "./scoreCompetition";
import { REVEAL_AT_MS } from "./revealSchedule";

export const SCORE_CHECK_COOKIE = "adikara_score_checked";

const SECRET =
  process.env.ADIKARA_REVEAL_SECRET ?? "adikara-2026-strict-reveal-fallback";

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export type CheckedScore = {
  nim: string;
  competition: ScoreCompetitionId;
};

// Cookie diikat ke NIM *dan* lomba yang dipilih. Mengubah param competition di
// URL tidak cukup untuk membuka hasil lomba lain.
export function createScoreCheckValue(
  nim: string,
  competition: ScoreCompetitionId
) {
  const issuedAt = Date.now().toString();
  const payload = `${nim}.${competition}.${issuedAt}.${REVEAL_AT_MS}`;
  return `${payload}.${sign(payload)}`;
}

export function getValidCheckedScore(
  value: string | undefined
): CheckedScore | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 5) return null;

  const [nim, competition, issuedAt, revealAt, signature] = parts;
  if (!nim || !issuedAt || !revealAt || !signature) return null;
  if (!isScoreCompetitionId(competition)) return null;
  if (revealAt !== String(REVEAL_AT_MS)) return null;

  const issuedAtMs = Number(issuedAt);
  if (!Number.isFinite(issuedAtMs) || issuedAtMs < REVEAL_AT_MS) return null;

  const expected = sign(`${nim}.${competition}.${issuedAt}.${revealAt}`);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(actualBuffer, expectedBuffer)) return null;

  return { nim, competition };
}
