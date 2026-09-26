"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/landing/navbar";
import { RandomAmbientGlow } from "@/components/team-score/RandomAmbientGlow";
import styles from "./rankings.module.css";

type RankingEntry = {
  teamId: string;
  teamName: string;
  description: string;
  score: number;
};

type RankingCategory = {
  id: string;
  label: string;
  rankings: RankingEntry[];
};

const categories: RankingCategory[] = [
  {
    id: "innovation",
    label: "Innovation",
    rankings: [
      { teamId: "CATERWISE-01", teamName: "Tim Mas Asix", description: "Prediksi Food Waste Pada Warung", score: 91.4 },
      { teamId: "ADA-02", teamName: "Telkom Cantik", description: "Platform Jual Beli Telur Untuk Memangkas Tengklak", score: 91.39 },
      { teamId: "FINJOB-03", teamName: "Bismillah Juara", description: "Loker Dan Pembuatan CV Secara Otomatis", score: 60.78 },
      { teamId: "CATERWISE2-04", teamName: "Telkom Cantik2", description: "Bangun Aplikasi Inovasi Baru", score: 57.55 },
      { teamId: "CATERWISE3-05", teamName: "Tim Mas Asix2", description: "Bangun Aplikasi Inovasi Terbaru", score: 10.19 },
    ],
  },
  {
    id: "competitive-programming",
    label: "Competitive Programming",
    rankings: [
      { teamId: "CP-101", teamName: "Zero Judgement", description: "Competitive Programming Finalist", score: 94.82 },
      { teamId: "CP-102", teamName: "Segitiga Emas", description: "Competitive Programming Finalist", score: 92.15 },
      { teamId: "CP-103", teamName: "Stack Overflow", description: "Competitive Programming Finalist", score: 88.64 },
      { teamId: "CP-104", teamName: "Recursion", description: "Competitive Programming Finalist", score: 84.31 },
      { teamId: "CP-105", teamName: "Binary Star", description: "Competitive Programming Finalist", score: 79.95 },
    ],
  },
  {
    id: "cyber-security",
    label: "Cyber Security",
    rankings: [
      { teamId: "CS-201", teamName: "Firewall", description: "Cyber Security Finalist", score: 93.18 },
      { teamId: "CS-202", teamName: "Cipher Squad", description: "Cyber Security Finalist", score: 89.73 },
      { teamId: "CS-203", teamName: "Secure Bytes", description: "Cyber Security Finalist", score: 86.4 },
      { teamId: "CS-204", teamName: "Null Pointer", description: "Cyber Security Finalist", score: 82.22 },
      { teamId: "CS-205", teamName: "Root Access", description: "Cyber Security Finalist", score: 78.09 },
    ],
  },
  {
    id: "data-mining",
    label: "Data Mining",
    rankings: [
      { teamId: "DM-301", teamName: "Data Forge", description: "Data Mining Finalist", score: 90.77 },
      { teamId: "DM-302", teamName: "Mining Minds", description: "Data Mining Finalist", score: 88.5 },
      { teamId: "DM-303", teamName: "Big Data", description: "Data Mining Finalist", score: 85.29 },
      { teamId: "DM-304", teamName: "Data Diva", description: "Data Mining Finalist", score: 81.43 },
      { teamId: "DM-305", teamName: "Pattern Seekers", description: "Data Mining Finalist", score: 76.88 },
    ],
  },
  {
    id: "entrepreneurship",
    label: "Entrepreneurship",
    rankings: [
      { teamId: "EP-401", teamName: "Startup Spirit", description: "Entrepreneurship Finalist", score: 92.34 },
      { teamId: "EP-402", teamName: "Growth Hackers", description: "Entrepreneurship Finalist", score: 87.91 },
      { teamId: "EP-403", teamName: "Business Mind", description: "Entrepreneurship Finalist", score: 84.57 },
      { teamId: "EP-404", teamName: "Market Makers", description: "Entrepreneurship Finalist", score: 80.16 },
      { teamId: "EP-405", teamName: "Value Creators", description: "Entrepreneurship Finalist", score: 75.42 },
    ],
  },
];

export default function RankingsPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [isVisible, setIsVisible] = useState(false);
  const [rankingsVisible, setRankingsVisible] = useState(false);
  const pageRef = useRef<HTMLElement>(null);
  const rankingsRef = useRef<HTMLElement>(null);
  const category = categories.find((item) => item.id === activeCategory) ?? categories[0];

  useEffect(() => {
    const element = pageRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = rankingsRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRankingsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main ref={pageRef} className={`${styles.page} ${isVisible ? styles.pageVisible : ""}`}>
        <section className={styles.hero} aria-labelledby="rankings-title">
          <Image className={`${styles.sideWing} ${styles.leftWing}`} src="/landing/hero/hero-decor.svg" alt="" width={448} height={590} />
          <Image className={`${styles.sideWing} ${styles.rightWing}`} src="/landing/hero/hero-decor.svg" alt="" width={448} height={590} />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>ADIKARA 2026</p>
            <h1 id="rankings-title">Finalis ADIKARA 2026</h1>
            <p>Congratulations To The Teams Advancing To The Final Round Of ADIKARA 2026.</p>
            <p>View Your Team&apos;s Detailed Evaluation On The Score Check Page.</p>
          </div>
        </section>

        <section
          ref={rankingsRef}
          className={`${styles.rankingsSection} ${rankingsVisible ? styles.rankingsVisible : ""}`}
          aria-labelledby="ranking-list-title"
        >
          <RandomAmbientGlow />
          <div className={styles.content}>
            <div className={styles.tabs} role="tablist" aria-label="Ranking categories">
              {categories.map((item) => (
                <button
                  className={`${styles.tab} ${item.id === activeCategory ? styles.activeTab : ""}`}
                  key={item.id}
                  onClick={() => setActiveCategory(item.id)}
                  role="tab"
                  type="button"
                  aria-selected={item.id === activeCategory}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className={styles.rankings}>
              <h2 id="ranking-list-title">Top 5 {category.label}</h2>
              <div className={styles.cardList} role="tabpanel">
                {category.rankings.map((entry, index) => (
                  <article className={styles.rankingCard} key={entry.teamId}>
                    <div className={styles.rank}>{index + 1}</div>
                    <div className={styles.teamInfo}>
                      <h3>{entry.teamName}</h3>
                      <p>{entry.description}</p>
                    </div>
                    <div className={styles.score}>
                      <strong>{entry.score.toFixed(2)}</strong>
                      <span>Final Score</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.scoreSection} aria-labelledby="score-check-title">
          <div className={styles.panelContent}>
            <Image className={`${styles.panelOrnament} ${styles.panelOrnamentLeft}`} src="/landing/vertical-decor.svg" alt="" width={390} height={756} />
            <Image className={`${styles.panelOrnament} ${styles.panelOrnamentRight}`} src="/landing/vertical-decor.svg" alt="" width={390} height={756} />
            <h2 id="score-check-title">Check Your Team&apos;s Score</h2>
            <p>All Participants Can View Their Detailed Scores And Judges&apos; Feedback, Whether They Qualified For The Final Or Not.</p>
            <form className={styles.searchForm} action="/team-score" method="get">
              <label className={styles.searchInput}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span className={styles.srOnly}>NIM atau ID tim</span>
                <input
                  type="search"
                  name="id"
                  placeholder="Masukkan NIM ketua"
                />
              </label>
              <button type="submit">Cek Nilai</button>
            </form>
            <div className={styles.result} aria-live="polite" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
