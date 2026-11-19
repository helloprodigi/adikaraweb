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
  rank?: number;
  isFinalist?: boolean;
  publicPlace?: number;
  teamId?: number | string;
  publicScore?: number;
  deduction?: number;
  finalScore?: number;
  finalPlace?: number;
  hp?: string;
  criteria: Criterion[];
};

import { finalistCategories } from "../rankings/finalists";
import { ctfRecords } from "./scoreData/ctf";
import { ctfNonFinalists } from "./scoreData/ctfNonFinalists";
import { cpRecords } from "./scoreData/cp";
import { entrepreneurshipRecords } from "./scoreData/entrepreneurship";
import { innovationRecords } from "./scoreData/innovation";

function normalizeNim(nim: string): string {
  return nim.replace(/[\s-]/g, "").toUpperCase();
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

// Satu NIM hanya boleh muncul sekali per kategori supaya pencarian tidak
// mengembalikan data dari submission lama. NIM yang sama lintas kategori
// dipertahankan karena datanya memang berbeda (misalnya peserta CP yang juga
// mengikuti Innovation).
const seenKeys = new Set<string>();

const mergedRecords: TeamScoreRecord[] = [
  ...ctfRecords,
  ...ctfNonFinalists,
  ...cpRecords,
  ...entrepreneurshipRecords,
  ...innovationRecords,
].filter((record) => {
  const key = `${record.category}:${normalizeNim(record.nim)}`;
  if (seenKeys.has(key)) return false;
  seenKeys.add(key);
  return true;
});

// Urutan resmi finalis adalah sumber peringkat yang paling akurat. Beberapa
// nama tim di data skor sudah dinormalisasi, jadi kalau nama tidak cocok kami
// pakai skor unik sebagai fallback.
type OfficialRanks = {
  byName: Map<string, number>;
  byScore: Map<number, number>;
};

const officialRanks = new Map<string, OfficialRanks>();

for (const category of finalistCategories) {
  const byName = new Map<string, number>();
  const byScore = new Map<number, number>();

  for (const finalist of category.finalists) {
    if (finalist.rank === undefined) continue;
    byName.set(normalizeName(finalist.teamName), finalist.rank);
    if (typeof finalist.score === "number" && !byScore.has(finalist.score)) {
      byScore.set(finalist.score, finalist.rank);
    }
  }

  officialRanks.set(category.label, { byName, byScore });
}

const scoreCounts = new Map<string, Map<number, number>>();

for (const record of mergedRecords) {
  const counts = scoreCounts.get(record.category) ?? new Map<number, number>();
  counts.set(record.totalScore, (counts.get(record.totalScore) ?? 0) + 1);
  scoreCounts.set(record.category, counts);
}

function compareByScore(a: TeamScoreRecord, b: TeamScoreRecord): number {
  if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;

  // CP: yang lebih sedikit penaltinya berada di depan saat solved sama.
  const penaltyA = Number(a.criteria.find((c) => c.title === "Time Penalty")?.score ?? 0);
  const penaltyB = Number(b.criteria.find((c) => c.title === "Time Penalty")?.score ?? 0);

  return penaltyA - penaltyB;
}

for (const category of new Set(mergedRecords.map((record) => record.category))) {
  const records = mergedRecords
    .filter((record) => record.category === category)
    .sort(compareByScore);
  const official = officialRanks.get(category);
  const counts = scoreCounts.get(category) ?? new Map<number, number>();

  records.forEach((record, index) => {
    const nameRank = official?.byName.get(normalizeName(record.teamName));
    const scoreRank = official?.byScore.get(record.totalScore);

    // Data non-finalis sudah membawa final_place resmi dari panitia.
    if (record.finalPlace !== undefined) {
      record.rank = nameRank ?? record.finalPlace;
      record.isFinalist = nameRank !== undefined;
      return;
    }

    let rank = index + 1;
    if (nameRank !== undefined) {
      rank = nameRank;
    } else if (scoreRank !== undefined && counts.get(record.totalScore) === 1) {
      rank = scoreRank;
    }

    // Penentuan finalis memakai kecocokan data resmi, bukan sekadar ada rank:
    // rank fallback juga diberikan ke peserta yang tidak lolos.
    record.isFinalist =
      nameRank !== undefined ||
      (scoreRank !== undefined && counts.get(record.totalScore) === 1);
    record.rank = rank;
  });
}

export const teamScores: TeamScoreRecord[] = mergedRecords;

export function findTeamByNim(nim: string | null | undefined): TeamScoreRecord | null {
  if (!nim) return null;

  const normalized = normalizeNim(nim.trim());
  if (!normalized) return null;

  return (
    teamScores.find((record) => normalizeNim(record.nim) === normalized) ?? null
  );
}
