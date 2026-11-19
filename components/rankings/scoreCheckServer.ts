import { createHmac, timingSafeEqual } from "node:crypto";

export const SCORE_CHECK_COOKIE = "adikara_score_checked";

const SECRET =
  process.env.ADIKARA_REVEAL_SECRET ?? "adikara-2026-strict-reveal-fallback";

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function createScoreCheckValue(nim: string) {
  const issuedAt = Date.now().toString();
  const payload = `${nim}.${issuedAt}`;
  return `${payload}.${sign(payload)}`;
}

export function hasValidScoreCheckCookie(value: string | undefined) {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;

  const [nim, issuedAt, signature] = parts;
  if (!nim || !issuedAt || !signature) return false;

  const expected = sign(`${nim}.${issuedAt}`);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(actualBuffer, expectedBuffer);
}
