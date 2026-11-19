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

export function getValidCheckedNim(value: string | undefined) {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;

  const [nim, issuedAt, signature] = parts;
  if (!nim || !issuedAt || !signature) return null;

  const expected = sign(`${nim}.${issuedAt}`);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  return nim;
}

export function hasValidScoreCheckCookie(value: string | undefined) {
  return getValidCheckedNim(value) !== null;
}
