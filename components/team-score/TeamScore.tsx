"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/landing/navbar";
import styles from "./TeamScore.module.css";

const criteria = [
  {
    title: "Format dan Structure of Writing",
    weight: "5%",
    score: "92.5",
    feedback: "The structure is well-organized and easy to follow. However, there are a few parts that could be more concise and focused on the main points.",
  },
  {
    title: "Problem Urgency",
    weight: "25%",
    score: "88.0",
    feedback: "The problem is clearly identified and the proposed solution addresses an important need.",
  },
  {
    title: "Creativity and Innovation",
    weight: "30%",
    score: "93.5",
    feedback: "The idea presents a fresh approach and demonstrates strong product thinking.",
  },
  {
    title: "Video Demo",
    weight: "20%",
    score: "91.0",
    feedback: "The demo is clear, smooth, and communicates the core value of the solution effectively.",
  },
];

function AnimatedCriterionRow({
  criterion,
  start,
  delay,
}: {
  criterion: {
    title: string;
    weight: string;
    score: string;
    feedback: string;
  };
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
  const heroRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isFinalScoreDone, setIsFinalScoreDone] = useState(false);

  useEffect(() => {
    const element = heroRef.current;
    if (!element) return;

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
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const targetScore = 91.4;
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
  }, [isVisible]);

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
                <h1 id="team-score-title">Mas Asix</h1>
                <p>Innovation</p>
                <p className={styles.teamMeta}>Tim Mas Asix - Finalis ADIKARA 2026</p>
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
