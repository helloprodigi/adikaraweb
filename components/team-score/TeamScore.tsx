"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/landing/navbar";
import type { Criterion, TeamScoreRecord } from "./teamScores";
import { getAdminWhatsAppUrl } from "@/components/rankings/adminWhatsapp";
import { isScoreCompetitionId } from "@/components/rankings/scoreCompetition";
import { TeamNotFound } from "./TeamNotFound";
import { JordanEasterEgg } from "@/components/easter-egg/JordanEasterEgg";
import styles from "./TeamScore.module.css";

function AnimatedCriterionRow({
  criterion,
  start,
  delay,
}: {
  criterion: Criterion;
  start: boolean;
  delay: number;
}) {
  const [isStarted, setIsStarted] = useState(false);
  const [typedFeedback, setTypedFeedback] = useState("");

  const fullFeedback = criterion.feedback ?? "";
  // Komentar juri bisa sangat panjang. Animasi ketik hanya untuk feedback
  // pendek supaya halaman tidak terasa "hang".
  const shouldType = fullFeedback.length > 0 && fullFeedback.length <= 240;

  useEffect(() => {
    if (!start) return;

    const startTimer = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [start, delay]);

  useEffect(() => {
    if (!isStarted || !shouldType) return;

    let index = 0;
    const speed = 18;

    const typeInterval = setInterval(() => {
      index++;
      setTypedFeedback(fullFeedback.slice(0, index));

      if (index >= fullFeedback.length) {
        clearInterval(typeInterval);
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [isStarted, fullFeedback, shouldType]);

  const displayedFeedback = shouldType ? typedFeedback : fullFeedback;

  return (
    <article className={styles.criterion}>
      <div className={styles.criterionMain}>
        <h3>{criterion.title}</h3>
        <strong
          className={`${styles.judgeScore} ${
            isStarted ? styles.judgeScoreVisible : styles.judgeScoreHidden
          }`}
        >
          {isStarted ? criterion.score : ""}
        </strong>
      </div>
      {fullFeedback && (
        <div className={styles.feedback}>
          <span>JURY FEEDBACK</span>
          <p>{isStarted ? displayedFeedback : ""}</p>
        </div>
      )}
    </article>
  );
}

function formatScore(value: number) {
  return value.toFixed(2);
}

export function TeamScore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const heroRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isFinalScoreDone, setIsFinalScoreDone] = useState(false);

  const nimQuery = (searchParams.get("nim") ?? searchParams.get("id"))?.trim() ?? "";
  const rawCompetition = searchParams.get("competition");
  const competition = isScoreCompetitionId(rawCompetition) ? rawCompetition : null;
  const lookupKey = `${competition ?? "default"}:${nimQuery}`;
  const [loaded, setLoaded] = useState<{
    key: string;
    record: TeamScoreRecord | null;
  } | null>(null);
  const record = loaded?.key === lookupKey ? loaded.record : null;
  const isLoading = loaded?.key !== lookupKey;

  const outcomeMessage = useMemo(() => {
    if (!record) return "";
    const { teamName, isFinalist } = record;
    return isFinalist
      ? `Selamat kepada Tim ${teamName} yang berhasil melaju ke Final ADIKARA 2026! Terus berikan yang terbaik dan tunjukkan potensi kalian. See you at the Final Round!`
      : `Terima kasih telah menjadi bagian dari ADIKARA 2026, Tim ${teamName}! Setiap usaha dan pengalaman adalah bagian dari proses untuk berkembang. Keep growing and never give up!`;
  }, [record]);
  const [typedOutcome, setTypedOutcome] = useState("");

  useEffect(() => {
    if (!isVisible || !outcomeMessage) return;

    let typeInterval: number | undefined;
    const startTimer = window.setTimeout(() => {
      let index = 0;
      typeInterval = window.setInterval(() => {
        index += 1;
        setTypedOutcome(outcomeMessage.slice(0, index));
        if (index >= outcomeMessage.length) window.clearInterval(typeInterval);
      }, 16);
    }, 550);

    return () => {
      window.clearTimeout(startTimer);
      if (typeInterval) window.clearInterval(typeInterval);
    };
  }, [isVisible, outcomeMessage]);

  // Nothing to look up without a NIM, so send the visitor back to the form
  // instead of rendering an empty score page.
  useEffect(() => {
    if (!nimQuery) {
      router.replace("/rankings");
      return;
    }

    let cancelled = false;
    fetch(
      `/api/team-score?nim=${encodeURIComponent(nimQuery)}${
        competition ? `&competition=${competition}` : ""
      }`,
      { cache: "no-store" }
    )
      .then((response) =>
        response.ok ? (response.json() as Promise<TeamScoreRecord>) : null
      )
      .then((data) => {
        if (!cancelled) setLoaded({ key: lookupKey, record: data });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ key: lookupKey, record: null });
      });

    return () => {
      cancelled = true;
    };
  }, [nimQuery, competition, lookupKey, router]);

  useEffect(() => {
    const element = heroRef.current;
    if (!element || !record) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [record]);

  useEffect(() => {
    if (!isVisible || !record) return;

    const targetScore = record.totalScore;
    const duration = 2000;
    let startTimestamp: number | null = null;
    let animId: number;

    const easeOutQuint = (x: number): number => 1 - Math.pow(1 - x, 5);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setAnimatedScore(easeOutQuint(progress) * targetScore);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setIsFinalScoreDone(true);
      }
    };

    const timer = setTimeout(() => {
      animId = requestAnimationFrame(step);
    }, 350);

    return () => {
      clearTimeout(timer);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isVisible, record]);

  if (nimQuery === "jorgenjorbigjor123") {
    return <JordanEasterEgg />;
  }

  if (!record) {
    if (!nimQuery || isLoading) return null;
    return <TeamNotFound nim={nimQuery} />;
  }

  const {
    nim,
    teamName,
    leaderName,
    division,
    category,
    criteria,
    totalLabel,
    isFinalist,
  } = record;
  // Cadangkan ruang untuk angka animasi supaya lebar kartu tidak berubah-ubah
  // saat hitungan berjalan (nama tim panjang jadi tidak berpindah-pindah).
  const scoreSlotWidth = `${record.totalScore.toFixed(2).length + 1}ch`;
  const meta = [
    leaderName ? `Ketua: ${leaderName}` : null,
    `NIM: ${nim}`,
    division ? `Divisi: ${division}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <section
          ref={heroRef}
          className={`${styles.hero} ${isVisible ? styles.heroVisible : ""}`}
          aria-labelledby="team-score-title"
        >
          <div className={styles.pattern} aria-hidden="true" />
          <Image className={`${styles.wing} ${styles.leftWing}`} src="/landing/hero/hero-decor.svg" alt="" width={448} height={590} />
          <Image className={`${styles.wing} ${styles.rightWing}`} src="/landing/hero/hero-decor.svg" alt="" width={448} height={590} />
          <Image className={`${styles.sideDecor} ${styles.sideDecorLeft}`} src="/landing/vertical-decor.svg" alt="" width={390} height={756} />
          <Image className={`${styles.sideDecor} ${styles.sideDecorRight}`} src="/landing/vertical-decor.svg" alt="" width={390} height={756} />
          <div className={styles.content}>
            <Link className={styles.backLink} href="/rankings">
              <span aria-hidden="true">‹</span>
              <span className={styles.backText}>Back To Rankings</span>
            </Link>
            <article className={styles.scoreCard}>
              <div className={styles.scoreCardText}>
                <h1 id="team-score-title">{teamName}</h1>
                <p>{category}</p>
                <p className={styles.teamMeta}>{meta}</p>
              </div>
              <div className={styles.finalScore}>
                <div className={styles.statusDisplay}>
                  <span>Status</span>
                  <strong>{isFinalist ? "Finalist" : "Non-Finalist"}</strong>
                </div>
                <span>{totalLabel ?? "Final Score"}</span>
                <strong style={{ minWidth: scoreSlotWidth }}>{formatScore(animatedScore)}</strong>
              </div>
            </article>

            <div
              className={`${styles.outcomeCard} ${
                isFinalist ? styles.outcomeFinalist : styles.outcomeNotFinalist
              }`}
              role="status"
            >
              <h2>{isFinalist ? "Congratulations!" : "Thank You, Participants."}</h2>
              <p aria-label={outcomeMessage}>{typedOutcome}</p>

              {isFinalist && (
                <div className={styles.outcomeCta}>
                  <div className={styles.outcomeCtaText}>
                    <p>
                      Finalis wajib melakukan registrasi ulang. Pastikan nama ketua
                      tim dan nama tim telah diisi sebelum pesan dikirimkan ke
                      contact person.
                    </p>
                  </div>
                  <a
                    className={styles.outcomeCtaButton}
                    href={getAdminWhatsAppUrl(category)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M20.52 3.449A11.815 11.815 0 0 0 11.999 0C5.373 0 .001 5.373.001 11.999c0 2.117.553 4.184 1.604 6.005L0 24l6.132-1.605a11.94 11.94 0 0 0 5.866 1.533h.005c6.625 0 11.998-5.373 11.998-11.999 0-3.206-1.249-6.219-3.48-8.48zM11.999 21.785h-.004a9.87 9.87 0 0 1-5.03-1.378l-.36-.214-3.741.98 1-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c0-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.002 5.45-4.437 9.886-9.888 9.886z" />
                    </svg>
                    Hubungi Admin WA
                  </a>
                </div>
              )}
            </div>

            <section className={styles.evaluation} aria-labelledby="evaluation-title">
              <h2 id="evaluation-title" className={styles.srOnly}>Evaluation Criteria</h2>
              <div className={styles.tableHeader}>
                <span>Evaluation Criteria</span>
                <span>Judge Score</span>
              </div>
              {criteria.map((criterion, index) => (
                <AnimatedCriterionRow
                  key={criterion.title}
                  criterion={criterion}
                  start={isFinalScoreDone}
                  delay={index * 450}
                />
              ))}
              <div className={styles.totalRow}>
                <strong>Total</strong>
                <strong>{formatScore(animatedScore)}</strong>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}