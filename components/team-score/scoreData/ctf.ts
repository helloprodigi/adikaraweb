import type { TeamScoreRecord } from "../teamScores";

type Row = [
  nim: string,
  team: string,
  leader: string,
  publicScore: number,
  deduction: number,
  finalScore: number,
];

// Peserta Capture The Flag (finalis maupun non-finalis). Hanya NIM, nama tim,
// nama ketua, dan skor yang disimpan — nomor HP tidak pernah ikut ke client.
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
  ["103012500339", "Nama tim kita Nama867", "Rifqi Bhadrika Adwitiya", 3430, 215, 3215],
  ["103032600179", "Yo_Wes_Lah", "Rafan Aydin Ro'si", 3140, 0, 3140],
  ["103032500167", "dolar begini dolar begitu, orang rakyat di desa gak pake dolar kok", "Gibran Ahmad Ramadhan", 2870, 0, 2870],
  ["103012680015", "ilovesotobetawigate4", "Dhani Mudhaffar Indrianto", 2825, 0, 2825],
  ["103022500088", "Jalanin aja dulu", "Dharmawan Jati", 2800, 0, 2800],
  ["103012500094", "Claude bantu kami", "Althaf Tristan Maheswara", 2770, 0, 2770],
  ["103012600137", "Bismillah doa ibu menyertai mu nak", "Nabil Hafizh Afriandri", 2700, 0, 2700],
  ["103032600086", 'kata ketua saya "Masih pemula jangan digalakkin"', "Sebastiano Van Mora Hasugian", 2700, 0, 2700],
  ["103012400193", "Bismillah Ga Wacana", "Akbar Saputra Hardian", 2680, 0, 2680],
  ["103012600453", "Presensinya dijaga boskuh", "Tengku Faisya Ramadhan", 2610, 50, 2560],
  ["103012630015", "SUMUR PRODUKSI", "Muhammad Ilham Hizam", 2550, 0, 2550],
  ["103012630034", "windows enjoyer", "Tsabit Fissabilillah", 2730, 190, 2540],
  ["103012500050", "BISMILLAH KE SWISSS", "Alif Zaidan Zidna Fann", 2470, 0, 2470],
  ["103012600079", "CyberBismillah.amin.id", "Panggih Sajana", 200, 0, 200],
  ["103032600077", "birb brain", "Dimas Pradipta Mulya", 200, 0, 200],
  ["103012600368", "bibit unggul", "muhammad nabil satrio", 200, 0, 200],
  ["103032500192", "Alter Ego", "Gandrung Margi Gusti", 200, 0, 200],
  ["103032630006", "Anak Kemaren Sore", "Muhammad Ighfirli Fadhillah", 200, 0, 200],
  ["103012600156", 'Ketua TIm Cuma Mau "U2FsdGVkX18NXwPrPdd02xUKNGRlFcHAhzcS1OruBg4="', "Sigit Ardis Admaja", 100, 0, 100],
  ["103032500153", "fazman", "Fazli Baktiadi", 100, 0, 100],
  ["103012300406", "Juragan Sawit", "Rizal Gabe Hawali", 100, 0, 100],
  ["103032400011", "Aku mau ctf", "Raditya Vihandika Bari Jabran", 100, 0, 100],
  ["103012600346", "ASSA", "Jovial Malik Akbar", 100, 0, 100],
];

export const ctfRecords: TeamScoreRecord[] = rows.map(
  ([nim, teamName, leaderName, publicScore, deduction, finalScore]) => ({
    nim,
    teamName,
    leaderName,
    category: "Capture The Flag",
    totalScore: finalScore,
    criteria: [
      { title: "Public Score", score: String(publicScore) },
      { title: "Pengurangan Skor", score: String(deduction) },
      { title: "Final Score", score: String(finalScore) },
    ],
  })
);
