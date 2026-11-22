// Daftar lomba yang bisa dipilih saat mengecek nilai. Satu NIM bisa mengikuti
// lebih dari satu lomba, jadi pilihannya memakai ID lomba yang spesifik.
export const SCORE_COMPETITIONS = [
  { id: "innovation", label: "Innovation", category: "Innovation" },
  {
    id: "cp",
    label: "Competitive Programming",
    category: "Competitive Programming",
  },
  { id: "ctf", label: "Capture The Flag", category: "Capture The Flag" },
  { id: "data-mining", label: "Data Mining", category: "Data Mining" },
  {
    id: "entrepreneurship",
    label: "Entrepreneurship",
    category: "Entrepreneurship",
  },
] as const;

export type ScoreCompetitionId = (typeof SCORE_COMPETITIONS)[number]["id"];

export type ScoreCompetitionOption = {
  id: ScoreCompetitionId;
  label: string;
};

export function isScoreCompetitionId(
  value: unknown
): value is ScoreCompetitionId {
  return SCORE_COMPETITIONS.some((competition) => competition.id === value);
}

export function getCompetition(id: ScoreCompetitionId) {
  return SCORE_COMPETITIONS.find((competition) => competition.id === id);
}

export function isDataMiningCompetition(id: ScoreCompetitionId) {
  return id === "data-mining";
}
