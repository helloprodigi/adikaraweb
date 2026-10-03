export const YEARS = [2025, 2026];

export const PLACEHOLDER = "???";

export type StatValue = number | null;

export type SummaryStat = {
  label: string;
  value: StatValue;
  caption: string;
  featured?: boolean;
};

export type CategoryStat = {
  name: string;
  registrations: StatValue;
  participants: StatValue;
};

export type DetailItem = {
  label: string;
  value: StatValue;
};

export type YearData = {
  summary: SummaryStat[];
  categories: CategoryStat[];
  gender: { male: StatValue; female: StatValue };
  batch: DetailItem[];
  studyProgram: DetailItem[];
};

const emptySummary: SummaryStat[] = [
  {
    label: "Total Form",
    value: null,
    caption: "Individuals and Teams",
  },
  {
    label: "Form Individu",
    value: null,
    caption: "Individuals and Teams",
  },
  {
    label: "Form Tim",
    value: null,
    caption: "Individuals and Teams",
  },
  {
    label: "Estimasi Peserta",
    value: null,
    caption: "Individuals and Teams",
    featured: true,
  },
];

const emptyCategories: CategoryStat[] = [
  { name: "Innovations", registrations: null, participants: null },
  { name: "Competitive Programming", registrations: null, participants: null },
  { name: "Cyber Security", registrations: null, participants: null },
  { name: "Entrepreneurship", registrations: null, participants: null },
  { name: "Data Mining", registrations: null, participants: null },
];

const emptyDetails: DetailItem[] = [
  { label: "-", value: null },
  { label: "-", value: null },
  { label: "-", value: null },
  { label: "-", value: null },
];

const statsByYear: Record<number, YearData> = {
  2025: {
    summary: [
      {
        label: "Total Form",
        value: 644,
        caption: "Individuals and Teams",
      },
      {
        label: "Form Individu",
        value: 298,
        caption: "Individuals and Teams",
      },
      {
        label: "Form Tim",
        value: 346,
        caption: "Individuals and Teams",
      },
      {
        label: "Estimasi Peserta",
        value: 1145,
        caption: "Individuals and Teams",
        featured: true,
      },
    ],
    categories: [
      { name: "Innovations", registrations: 162, participants: 405 },
      { name: "Competitive Programming", registrations: 160, participants: 160 },
      { name: "Cyber Security", registrations: 138, participants: 138 },
      { name: "Entrepreneurship", registrations: 116, participants: 270 },
      { name: "Data Mining", registrations: 68, participants: 172 },
    ],
    gender: { male: 927, female: 218 },
    batch: [
      { label: "2025", value: 381 },
      { label: "2024", value: 143 },
      { label: "2023", value: 110 },
      { label: "2022", value: 10 },
    ],
    studyProgram: [
      { label: "S1 Informatika", value: 422 },
      { label: "S1 Sains Data", value: 100 },
      { label: "S1 Rekayasa Perangkat Lunak", value: 61 },
      { label: "S1 Teknologi Informasi", value: 61 },
    ],
  },
  2026: {
    summary: emptySummary,
    categories: emptyCategories,
    gender: { male: null, female: null },
    batch: emptyDetails,
    studyProgram: emptyDetails,
  },
};

export function getYearData(year: number): YearData {
  return statsByYear[year] ?? statsByYear[2026];
}
