import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Your Team's Score",
  description:
    "Check your ADIKARA 2026 team score and detailed jury evaluation. View criteria scores, judge weights, and feedback for every finalist team.",
  alternates: {
    canonical: "/team-score",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Check Your Team's Score - ADIKARA 2026",
    description:
      "Detailed jury evaluation and final score for ADIKARA 2026 finalist teams.",
    url: "/team-score",
  },
};

export default function TeamScoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
