import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finalis ADIKARA 2026",
  description:
    "Lihat daftar finalis ADIKARA 2026 per kategori: Innovation, Competitive Programming, Cyber Security, Data Mining, dan Entrepreneurship. Cek skor tim kamu di halaman score check.",
  alternates: {
    canonical: "/rankings",
  },
  openGraph: {
    title: "Finalis ADIKARA 2026",
    description:
      "Daftar finalis ADIKARA 2026 per kategori beserta skor dan detail evaluasi tim.",
    url: "/rankings",
  },
};

export default function RankingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
