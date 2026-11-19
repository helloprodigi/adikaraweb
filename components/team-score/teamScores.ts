export type Criterion = {
  title: string;
  weight?: string;
  score: string;
  feedback?: string;
};

export type TeamScoreRecord = {
  nim: string;
  teamName: string;
  leaderName?: string;
  division?: string;
  category: string;
  totalScore: number;
  totalLabel?: string;
  criteria: Criterion[];
};

import { ctfRecords } from "./scoreData/ctf";
import { cpRecords } from "./scoreData/cp";
import { entrepreneurshipRecords } from "./scoreData/entrepreneurship";
import { innovationRecords } from "./scoreData/innovation";

function normalizeNim(nim: string): string {
  return nim.replace(/[\s-]/g, "").toUpperCase();
}

// Satu NIM hanya boleh muncul sekali supaya pencarian tidak mengembalikan data
// dari submission lama.
const seenNims = new Set<string>();

export const teamScores: TeamScoreRecord[] = [
  ...ctfRecords,
  ...cpRecords,
  ...entrepreneurshipRecords,
  ...innovationRecords,
].filter((record) => {
  const key = normalizeNim(record.nim);
  if (seenNims.has(key)) return false;
  seenNims.add(key);
  return true;
});

export function findTeamByNim(nim: string | null | undefined): TeamScoreRecord | null {
  if (!nim) return null;

  const normalized = normalizeNim(nim.trim());
  if (!normalized) return null;

  return (
    teamScores.find((record) => normalizeNim(record.nim) === normalized) ?? null
  );
}
