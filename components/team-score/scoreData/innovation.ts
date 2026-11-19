import type { TeamScoreRecord } from "../teamScores";
import { innovationNonFinalistRecords } from "./innovationNonFinalists";

type Row = [
  nim: string,
  team: string,
  leader: string,
  division: string,
  total: number,
  feedback: string,
];

// Finalis Innovation. Non-finalis ada di innovationNonFinalists.ts dan tetap
// dapat dicari lewat NIM tanpa ditampilkan di halaman /rankings.
const rows: Row[] = [
  [
    "103012600266",
    "(STRAYKIDZ)SKZ",
    "Salsabila Zaskia Amrullah",
    "Gamedev",
    93.4,
    "Proposal disusun dengan sangat - sangat baik, effort banget gaes good job, detail, bertahap, jelas, dan urgensinya juga ada.\n\nIntinya tentang seorang pahlawan yang menyelamatkan warga - warga yang kena banjir akibat tsunami.\n\nMeskipun menggunakan platformer, pixel, tapi ceritanya menarik. Good lah\n\nInovasi unik, menyelesaikan masalah dengan tepat, Metodologi tepat,Dapat direalisasikan",
  ],
  [
    "103022400069",
    "Perceng Berani",
    "Muhammad Rizqie Sufiawan",
    "Gamedev",
    90.06,
    "Gamenya sangat menarik, beda dari yang lain, urgensinya besar yaitu gimana caranya untuk membuat energi di seluruh indonesia.\n\nGameplaynya juga beda sendiri. Tampilannya jelas, cara mainnya gampang untuk manage 1 indonesia.\n\n- Dari sisi konsep dan teknis gamenya sangat matang\n- terlebih lagi gamenya gampang dimainkan dan pesannya juga tersampaikan",
  ],
  [
    "103012400056",
    "STAND ALONE",
    "Daffandri Faiz Zhafransyah",
    "Softdev",
    89.45,
    "Penulisan sudah sangat proper dan rapih, masalah yang diangkat juga urgent buat melindungi masyarakat dari potensi penipuan investasi. dari segi ideation, gagasan menyilangkan obrolan ajakan beli di grup telegram dengan data laporan kepemilikan publik untuk melacak pihak yang diam-diam memainkan harga, jujur kreatif & out-of-the-box, video nya juga sangat proper",
  ],
  [
    "103032400002",
    "TAKHunter",
    "Muhammad Faiz Ghiffari",
    "Softdev",
    88.2,
    "aplikasi fungsional. permasalahan nyata. perlu dicek ulang apakah cukup hanya menggunakan citra satelit dan prakiraan cuaca, karena bisa jadi asap hadir karena angin dari daerah lain.",
  ],
  [
    "103012400384",
    "THIS IS A REQUIRED QUESTION",
    "RAFI SYAPUTRA",
    "Softdev",
    87.8,
    "Penulisan proposal sangat rapih dan proper dengan sitasi yang jelas, masalah inklusivitas komunikasi penyandang disabilitas rungu di layanan loket juga sangat relevan dan didukung data kuat. solusi komunikasi dua arah tanpa menyimpan video cukup menarik",
  ],
  [
    "103012630030",
    "KakPlsAkuMauMasukProdigi",
    "Naufal Qathafa Rasya Hidayat",
    "Softdev",
    87.38,
    "permasalahan yang diselesaikan nyata dan sudah didukung data survei siswa maupun wawancara guru. aplikasi fungsional dengan fitur yang matang dan lengkap",
  ],
  [
    "103022600101",
    "sayaAkanMenang",
    "Alyaa Nur Hanifah",
    "UI/UX",
    87.25,
    "- Format dan struktur proposal sudah tersusun sangat lengkap dan rapi, bahkan sudah dilengkapi dengan lampiran surat izin penelitian.\n- Urgensi masalah yang diangkat pada aplikasi Kendali sudah kuat karena didukung oleh data yang jelas serta selaras dengan SDGs dan Asta Cita.\n- Inovasinya sangat solutif dengan menghadirkan fitur safe space untuk menjaga privasi pengguna, penerapan standar aksesibilitas WCAG.\n- Penerapan Design Thinking sudah berjalan dengan pas dan matang, terutama karena didukung riset langsung yang melibatkan mahasiswa Tel-U serta pihak Satgas PPKPT.\n- Rancangan prototype-nya sudah terlihat sangat menarik (attractive), clean design, dan rapi secara visual.\n- Video sebaiknya tidak hanya berupa rekaman presentasi lewat Google Meet saja, tetapi bisa dilengkapi dengan PPT atau aset visual yang lebih kreatif serta rekaman demo penggunaan prototype aplikasinya secara langsung.",
  ],
  [
    "103032530022",
    "NitanRen",
    "Yuhen Aditya Gunawan",
    "IoT",
    86.83,
    "- Ide menarik, memeriksa panas bawah permukaan gambut setelah pemadaman dengan dua probe kedalaman berbeda\n- Referensi ilmiah (GAMBUT) disitasi dengan baik, latar belakang kuat\n- Template rapi, alur proses jelas, batasan ditulis jujur\n- Prototype ada dan ada video demonstrasi, tetapi UPS belum berfungsi (masih power bank) dan satu probe rusak\n- Pengujian pada media cocopeat dan sekam masih rencana, belum ada data hasil\n- Unsur IoT masih lemah karena LoRa baru rencana",
  ],
  [
    "103012330386",
    "Pikselin",
    "Axel Davin Lazar Panenggak",
    "UI/UX",
    84.9,
    "WattKita menawarkan solusi yang relevan dengan kebutuhan penghuni kos melalui transparansi pemakaian dan pembagian tagihan listrik. Kekuatan karya terletak pada proses riset pengguna yang diterjemahkan menjadi fitur serta diuji melalui usability testing. Namun, metode pembagian berdasarkan perangkat masih berupa estimasi sehingga akurasi dan keadilannya perlu divalidasi lebih lanjut menggunakan data konsumsi listrik aktual. video perlu dijelaskan dengan voice, deisgn ui/ux cukup eye catching",
  ],
  [
    "103012600475",
    "SouthStudio",
    "Hairun Dzakwan Ahmar",
    "IoT",
    80.28,
    "- Ide menarik\n- Template Bagus\n- Banyak typo penulisan\n- Prototype cukup baik\n- Integrasi IoT AI Website",
  ],
  [
    "103052300118",
    "Es Teh Tawar",
    "Muhammad Fikri Hanif",
    "IoT",
    75.98,
    "- Ide yang disampaikan cukup menarik\n- Referensi Ilmiah cukup banyak\n- Template rapi\n- Alur proses nya jelas\n- Tidak terdapat bukti prototype jadi tidak bisa menilai konektivitas perangkat",
  ],
  [
    "103022600006",
    "NereidForce",
    "Mutasyakiroh Al Fatha",
    "IoT",
    74.33,
    "- Tidak ada referensi yang mendukung pernyataan\n- Template kurang rapi\n- Ide menarik dan baru\n- Daftar Isi tidak ada",
  ],
  [
    "103012630020",
    "LogicX",
    "Yafi Maulana Hakim",
    "IoT",
    72.13,
    "- Ide sangat menarik dan baru, memadukan spektroskopi fluoresensi UV dan sensor bio-dielektrik untuk audit keamanan pangan MBG\n- Referensi ilmiah banyak dan disitasi ke dalam pembahasan, latar belakang kuat\n- Pengujian masih berupa simulasi sampel, belum ada data uji nyata\n- Penjelasan sangat panjang dan padat sehingga beberapa bagian sulit diikuti",
  ],
];

const finalistRecords: TeamScoreRecord[] = rows.map(
  ([nim, teamName, leaderName, division, totalScore, feedback]) => ({
    nim,
    teamName,
    leaderName,
    division,
    category: "Innovation",
    totalScore,
    criteria: [
      {
        title: "Nilai Akhir",
        score: totalScore.toFixed(2),
        feedback: feedback || undefined,
      },
    ],
  })
);

export const innovationRecords: TeamScoreRecord[] = [
  ...finalistRecords,
  ...innovationNonFinalistRecords,
];
