import type { TeamScoreRecord } from "../teamScores";

type Row = [
  rank: number,
  nim: string,
  team: string,
  teamId: string,
  rmsle: number,
  hp: string,
];

// Finalis Data Mining (peringkat 1-10). Nomor HP hanya dipakai di server dan
// dibuang oleh /api/team-score sebelum response dikirim ke browser.
const rows: Row[] = [
  [1, "103012340199", "Suwandi", "TM-2026-017", 132.459, "08117291111"],
  [2, "103012530049", "fortis fortuna adihidayat", "TM-2026-039", 132.59, "081360289891"],
  [3, "103012530053", "When yh jadi sepuh data mining", "TM-2026-023", 132.71, "081336762216"],
  [4, "103012400159", "Datadataan", "TM-2026-008", 133.025, "082287667967"],
  [5, "103032400085", "Enter your team name", "TM-2026-054", 133.447, "08990918767"],
  [6, "103012400155", "kebersamaan", "TM-2026-029", 133.461, "081222392174"],
  [7, "103032600169", "AGERA", "TM-2026-007", 133.532, "085385757855"],
  [8, "103032600146", "Raket Nyamuk", "TM-2026-010", 133.605, "0895342288460"],
  [9, "103012500230", "Abis ini ke WDP", "TM-2026-065", 133.646, "082145107685"],
  [10, "103012400157", "wo ya boleh wong ditawarin", "TM-2026-062", 133.718, "081916451200"],
];

export const dataMiningRecords: TeamScoreRecord[] = rows.map(
  ([rank, nim, teamName, teamId, rmsle, hp]) => ({
    nim,
    teamName,
    teamId,
    category: "Data Mining",
    totalScore: rmsle,
    totalLabel: "RMSLE",
    rank,
    isFinalist: true,
    hp,
    criteria: [{ title: "RMSLE", score: rmsle.toFixed(3) }],
  })
);
