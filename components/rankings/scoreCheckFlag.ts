"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "adikara:scoreChecked";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(STORAGE_KEY) === "1";
}

function getServerSnapshot() {
  return false;
}

export function useScoreCheckFlag() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [justChecked, setJustChecked] = useState(false);

  const markChecked = useCallback(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Session storage bisa diblokir; state lokal tetap cukup untuk sesi ini.
    }
    setJustChecked(true);
  }, []);

  return { hasChecked: stored || justChecked, markChecked };
}
