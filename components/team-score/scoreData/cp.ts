import type { TeamScoreRecord } from "../teamScores";

type Row = [nim: string, name: string, solved: number, penalty: number];

// Peserta Competitive Programming (finalis dan non-finalis).
const rows: Row[] = [
  ["103012640011", "Muhammad Rezky Eksatama", 6, 478],
  ["103052500054", "Gilbert Geraldo", 6, 529],
  ["103012500228", "Airlangga Rizkytama", 6, 581],
  ["103032400059", "Muhammad Farhan Hafiz Alkirami", 5, 359],
  ["103012500157", "Muhammad Wildan Al Fattah", 5, 359],
  ["103012500241", "MUHAMMAD FAUZI RAMADHAN", 5, 361],
  ["103022500043", "Muhammad Adlan Al-Ghifaari", 5, 426],
  ["103012530006", "Rifqi Nadra Fitriawan", 5, 430],
  ["103012400055", "Muhammad Huttaqi", 5, 476],
  ["103012630032", "Danial Al Hasya Ananto", 5, 558],
  ["103012600447", "Muhammad Daffa Ashiddiqi", 4, 339],
  ["103022600077", "Muhammad Alif Kusuma Alfaiz", 4, 498],
  ["103012400048", "Muhammad Reza Haffafi", 4, 527],
  ["103012600256", "Nadine Dara Boesoirie", 4, 592],
  ["103012630041", "Ihsan Anshary Dhiya'ulhaq", 4, 749],
  ["103012500364", "Rafa Al Fattah", 3, 221],
  ["103012600229", "Athaillah Ahmad Faishal", 3, 224],
  ["103012500053", "Hanifah Harnanda Tridianti", 3, 271],
  ["103012500347", "Zahro Khoirur Rohma", 3, 275],
  ["103012600284", "Tyan Syahru Showam", 3, 275],
  ["103012600291", "M Rafael Trisna Adiwiana", 3, 279],
  ["103022400083", "Muhammad Farhan Abdillah", 3, 340],
  ["103032530012", "Muhammad Ghassan Denaprinsyah", 3, 383],
  ["103012500085", "Kayla Sabrina Rayghita", 3, 655],
  ["103012600440", "M. Nauva Pratama", 2, 96],
  ["103012600070", "Dimas Aji Wicaksono", 2, 117],
  ["103012600201", "Teguh Dwi Ramadhan", 2, 121],
  ["103012630019", "Revan Ramadiyanto", 2, 236],
  ["103012600189", "Moh Ganjar Arif Muthakin", 0, 0],
  ["103012530015", "Muhammad Al Fayyadh", 0, 0],
  ["103012600465", "Muhammad Alief Baihaqie Fitanto Putra", 0, 0],
  ["103012500092", "Muhammad Dzaki Lukmanul Hakim", 0, 0],
  ["103012600238", "Muhammad Ibra Adly", 0, 0],
  ["103012600197", "Muhammad Satya Handaru", 0, 0],
  ["103012400336", "Rafi Dzaki Azhari", 0, 0],
  ["103012600213", "Rasya Febriansyah", 0, 0],
  ["103012600134", "Rayhan Hidayat", 0, 0],
  ["103012500099", "Samuel Dipta Yogi Taruna", 0, 0],
  ["103012600391", "Sulthan Taufiiqul Hakim Rofif Prijono", 0, 0],
  ["103012600186", "Syauqi Ahmad Nurulloh", 0, 0],
  ["103032640006", "Syesa Moazma Gardezi", 0, 0],
  ["103012600250", "Tasbir Furqon Muttaqien", 0, 0],
  ["103012600104", "Thalita Azka Kirana", 0, 0],
  ["103032530009", "Zhiya Fauzia Faiqa Dwijawarsitha", 0, 0],
];

export const cpRecords: TeamScoreRecord[] = rows.map(
  ([nim, teamName, solved, penalty]) => ({
    nim,
    teamName,
    leaderName: teamName,
    category: "Competitive Programming",
    totalScore: solved,
    totalLabel: "Problems Solved",
    criteria: [
      { title: "Solved", score: String(solved) },
      { title: "Time Penalty", score: String(penalty) },
    ],
  })
);
