import { createHmac, timingSafeEqual } from "node:crypto";
import { REVEAL_AT_MS } from "./revealSchedule";

export const SCORE_CHECK_COOKIE = "adikara_score_checked";

const SECRET =
  process.env.ADIKARA_REVEAL_SECRET ?? "adikara-2026-strict-reveal-fallback";

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function createScoreCheckValue(nim: string) {
  const issuedAt = Date.now().toString();
  const payload = `${nim}.${issuedAt}.${REVEAL_AT_MS}`;
  return `${payload}.${sign(payload)}`;
}

export function getValidCheckedNim(value: string | undefined) {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 4) return null;

  const [nim, issuedAt, revealAt, signature] = parts;
  if (!nim || !issuedAt || !revealAt || !signature) return null;
  if (revealAt !== String(REVEAL_AT_MS)) return null;

  const issuedAtMs = Number(issuedAt);
  if (!Number.isFinite(issuedAtMs) || issuedAtMs < REVEAL_AT_MS) return null;

  const expected = sign(`${nim}.${issuedAt}.${revealAt}`);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  return nim;
}

export function hasValidScoreCheckCookie(value: string | undefined) {
  return getValidCheckedNim(value) !== null;
}
