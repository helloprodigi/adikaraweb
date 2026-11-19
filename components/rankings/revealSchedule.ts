// Waktu reveal absolut: 19 Nov 2026 16:10 WIB = 09:10 UTC.
// Memakai UTC timestamp supaya tidak bergantung pada jam device pengguna.
export const REVEAL_AT_MS = Date.UTC(2026, 10, 19, 9, 10, 0);

export type RevealStatus = {
  isRevealed: boolean;
  remainingMs: number;
};

export function getServerNow() {
  return Date.now();
}

export function getRevealStatus(nowMs = getServerNow()): RevealStatus {
  const remainingMs = Math.max(0, REVEAL_AT_MS - nowMs);
  return { isRevealed: remainingMs === 0, remainingMs };
}

export function formatRevealCountdown(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}
