import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration Statistics",
  description:
    "Realtime registration statistics for ADIKARA 2026: participant distribution, gender breakdown, faculty data, and detailed registration overview by year.",
  alternates: {
    canonical: "/statistics",
  },
  openGraph: {
    title: "Registration Statistics - ADIKARA 2026",
    description:
      "Realtime registration statistics for ADIKARA 2026 including participant distribution and faculty breakdown.",
    url: "/statistics",
  },
};

export default function StatisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
