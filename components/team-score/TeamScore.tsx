"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/landing/navbar";
import { findTeamByNim, type Criterion } from "./teamScores";
import { TeamNotFound } from "./TeamNotFound";
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

  const fullFeedback = criterion.feedback;

  useEffect(() => {
    if (!start) return;

    const startTimer = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [start, delay]);

  useEffect(() => {
    if (!isStarted) return;

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
  }, [isStarted, fullFeedback]);

  return (
    <article className={styles.criterion}>
      <div className={styles.criterionMain}>
        <h3>{criterion.title}</h3>
        <span className={styles.weight}>{criterion.weight}</span>
        <strong
          className={`${styles.judgeScore} ${
            isStarted ? styles.judgeScoreVisible : styles.judgeScoreHidden
          }`}
        >
          {isStarted ? criterion.score : ""}
        </strong>
      </div>
      <div className={styles.feedback}>
        <span>JURY FEEDBACK</span>
        <p>{typedFeedback}</p>
      </div>
    </article>
  );
}

export function TeamScore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const heroRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isFinalScoreDone, setIsFinalScoreDone] = useState(false);

  const nimQuery = (searchParams.get("nim") ?? searchParams.get("id"))?.trim() ?? "";
  const record = useMemo(() => findTeamByNim(nimQuery), [nimQuery]);

  // Nothing to look up without a NIM, so send the visitor back to the form
  // instead of rendering an empty score page.
  useEffect(() => {
    if (!nimQuery) {
      router.replace("/rankings");
    }
  }, [nimQuery, router]);

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

  if (!record) {
    if (!nimQuery) return null;
    return <TeamNotFound nim={nimQuery} />;
  }

  const { teamName, category, criteria } = record;

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
              <div>
                <h1 id="team-score-title">{teamName}</h1>
                <p>{category}</p>
              </div>
              <div className={styles.finalScore}>
                <span>Final Score</span>
                <strong>{animatedScore.toFixed(2)}</strong>
              </div>
            </article>

            <section className={styles.evaluation} aria-labelledby="evaluation-title">
              <h2 id="evaluation-title" className={styles.srOnly}>Evaluation Criteria</h2>
              <div className={styles.tableHeader}>
                <span>Evaluation Criteria</span>
                <span>Weight</span>
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
                <strong>100%</strong>
                <strong>{animatedScore.toFixed(2)}</strong>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}