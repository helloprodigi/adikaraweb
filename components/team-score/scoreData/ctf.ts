import type { TeamScoreRecord } from "../teamScores";

type Row = [
  nim: string,
  team: string,
  leader: string,
  publicScore: number,
  deduction: number,
  finalScore: number,
];

// Finalis Capture The Flag (peringkat 1-15). Non-finalis ada di
// ./ctfNonFinalists.ts. Hanya data yang dibutuhkan halaman publik yang disimpan
// di sini; nomor HP tidak pernah ikut ke client.
const rows: Row[] = [
  ["103032500176", "aku cuman becanda kok jangan di apa2 in akunya bang biar ga ituin ama si anu nanti jadi ini", "Vendra Fausta Andrean", 5130, 323, 4807],
  ["103032500025", "mendoankriukbaturaden goes to ADIKARA", "Fransiskus Xaverius Farrel Azalea I", 5000, 215, 4785],
  ["103032600223", "disuruh dosen", "adhika ilman nurhury", 4670, 330, 4340],
  ["103022430016", "UKAPH Bojongsoang -2026", "Rizkya Ramdan", 3680, 0, 3680],
  ["103032530028", "diajak Juan ikut ctf adikara kami ikut aja", "Yamamo Juan Alterico Situmorang", 3720, 100, 3620],
  ["103032500099", "kata bang kv, ce te ep gampang", "Muhammad Trisnatama Derdiansyah", 3600, 0, 3600],
  ["103032500169", "opus tolong berikan kami nama tim untuk adikara", "Muhammad Shodiq", 3500, 0, 3500],
  ["103012600081", "FromZero", "Muhammad Luthfi Aldora", 3690, 405, 3285],
  ["103012500078", "izin tampil", "Rillo Raihan Dwi Satria", 3270, 0, 3270],
  ["103012500339", "Nama tim kita Nama867", "Rifki Bhadrika Adwitiya", 3430, 215, 3215],
  ["103032600179", "Yo_Wes_Lah", "Rafan Aydin Ro'si", 3140, 0, 3140],
  ["103032500167", "dolar begini dolar begitu, orang rakyat di desa gak pake dolar kok", "Gibran Ahmad Ramadhan", 2870, 0, 2870],
  ["103012680015", "ilovesotobetawigate4", "Dhani Mudhaffar Indrianto", 2825, 0, 2825],
  ["103022500088", "Jalanin aja dulu", "Dharmawan Jati", 2800, 0, 2800],
  ["103012500094", "Claude bantu kami", "Althaf Tristan Maheswara", 2770, 0, 2770],
];

export const ctfRecords: TeamScoreRecord[] = rows.map(
  ([nim, teamName, leaderName, publicScore, deduction, finalScore]) => ({
    nim,
    teamName,
    leaderName,
    category: "Capture The Flag",
    totalScore: finalScore,
    publicScore,
    deduction,
    finalScore,
    criteria: [
      { title: "Public Score", score: publicScore.toFixed(2) },
      { title: "Pengurangan Skor", score: deduction.toFixed(2) },
      { title: "Final Score", score: finalScore.toFixed(2) },
    ],
  })
);
