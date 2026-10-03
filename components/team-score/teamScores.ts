export type Criterion = {
  title: string;
  weight: string;
  score: string;
  feedback: string;
};

export type TeamScoreRecord = {
  nim: string;
  teamName: string;
  category: string;
  totalScore: number;
  criteria: Criterion[];
};

const DEFAULT_CRITERIA: Criterion[] = [
  {
    title: "Format dan Structure of Writing",
    weight: "5%",
    score: "92.5",
    feedback:
      "The structure is well-organized and easy to follow. However, there are a few parts that could be more concise and focused on the main points.",
  },
  {
    title: "Problem Urgency",
    weight: "25%",
    score: "88.0",
    feedback:
      "The problem is clearly identified and the proposed solution addresses an important need.",
  },
  {
    title: "Creativity and Innovation",
    weight: "30%",
    score: "93.5",
    feedback:
      "The idea presents a fresh approach and demonstrates strong product thinking.",
  },
  {
    title: "Video Demo",
    weight: "20%",
    score: "91.0",
    feedback:
      "The demo is clear, smooth, and communicates the core value of the solution effectively.",
  },
];

// NIM Sovereign inserted here. Every NIM that is not listed is treated as
// unregistered, so the page can say the team does not exist instead of
// falling back to placeholder data.
export const teamScores: TeamScoreRecord[] = [
  {
    nim: "221063117",
    teamName: "Mas Asix",
    category: "Innovation",
    totalScore: 91.4,
    criteria: DEFAULT_CRITERIA,
  },
];

function normalizeNim(nim: string): string {
  return nim.replace(/[\s-]/g, "").toUpperCase();
}

export function findTeamByNim(nim: string | null | undefined): TeamScoreRecord | null {
  if (!nim) return null;

  const normalized = normalizeNim(nim.trim());
  if (!normalized) return null;

  return (
    teamScores.find((record) => normalizeNim(record.nim) === normalized) ?? null
  );
}
