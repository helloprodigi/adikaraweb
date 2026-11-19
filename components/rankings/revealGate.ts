"use client";

import { useSyncExternalStore } from "react";

// Testing: 15:25 WIB. Jadwal asli pengumuman tetap 18:00 WIB.
// Untuk testing lokal, ubah sementara dua konstanta ini lalu kembalikan.
export const REVEAL_HOUR = 15;
export const REVEAL_MINUTE = 25;

export type RevealStatus = {
  isRevealed: boolean;
  remainingMs: number;
};

export function getRevealStatus(now = new Date()): RevealStatus {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).formatToParts(now);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((item) => item.type === type)?.value ?? 0);

  const current = part("hour") * 3600 + part("minute") * 60 + part("second");
  const target = REVEAL_HOUR * 3600 + REVEAL_MINUTE * 60;

  if (current >= target) return { isRevealed: true, remainingMs: 0 };
  return { isRevealed: false, remainingMs: (target - current) * 1000 };
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

// Sentinel: -1 berarti "belum pernah dibaca di klien". Dipakai supaya SSR dan
// render pertama klien identik, lalu langsung diganti pada subscribe.
const INITIAL_STATUS: RevealStatus = { isRevealed: false, remainingMs: -1 };
// Bypass QC: buka /rankings?unlock=1 tanpa mengubah jadwal 18:00.
const UNLOCKED_STATUS: RevealStatus = { isRevealed: true, remainingMs: 0 };
let currentStatus = INITIAL_STATUS;
const listeners = new Set<() => void>();
let timer: number | null = null;

function refresh() {
  currentStatus = getRevealStatus();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined" && timer === null) {
    refresh();
    timer = window.setInterval(refresh, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot() {
  if (
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("unlock")
  ) {
    return UNLOCKED_STATUS;
  }
  return currentStatus;
}

function getServerSnapshot() {
  return INITIAL_STATUS;
}

export function useRevealGate(): RevealStatus & { ready: boolean } {
  const status = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { ...status, ready: status.remainingMs >= 0 };
}
