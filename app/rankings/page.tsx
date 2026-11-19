"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/landing/navbar";
import { useScoreGate } from "@/components/rankings/ScoreGateProvider";
import { finalistCategories as categories } from "@/components/rankings/finalists";
import { getAdminWhatsAppUrl } from "@/components/rankings/adminWhatsapp";
import { useRevealGate } from "@/components/rankings/revealGate";
import { useScoreCheckFlag } from "@/components/rankings/scoreCheckFlag";
import { RevealLock } from "@/components/rankings/RevealLock";
import styles from "./rankings.module.css";

const PLACEHOLDER_NAME = "Waiting for teams..";
const PLACEHOLDER_DESCRIPTION = "Waiting for you to be the finalist";
const PLACEHOLDER_SCORE = "??";

const NIM_REQUIRED_MESSAGE = "Wajib isi NIM untuk checking nilai tim.";

export default function RankingsPage() {
  const { openScoreGate } = useScoreGate();
  const { isRevealed, remainingMs, ready } = useRevealGate();
  const { hasChecked, markChecked } = useScoreCheckFlag();
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [isVisible, setIsVisible] = useState(false);
  const [rankingsVisible, setRankingsVisible] = useState(false);
  const [nim, setNim] = useState("");
  const [nimError, setNimError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const rankingsRef = useRef<HTMLElement>(null);
  const category = categories.find((item) => item.id === activeCategory) ?? categories[0];
  const hideRanks = category.id === "innovation";
  const visibleFinalists = category.finalists;

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
  }, [isRevealed, hasChecked]);

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
      { rootMargin: "0px 0px -15% 0px", threshold: 0 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isRevealed, hasChecked]);

  // True on the server and on the first client render alike, so the block ships
  // hidden and React has nothing to reconcile. It is only dropped once the
  // section has scrolled into view and the reveal animation starts.
  const isPending = !rankingsVisible;

  const handleNimChange = (value: string) => {
    setNim(value);
    if (nimError) setNimError("");
  };

  const handleScoreCheck = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNim = nim.trim();

    if (!trimmedNim) {
      setNimError(NIM_REQUIRED_MESSAGE);
      inputRef.current?.focus();
      return;
    }

    setNimError("");
    markChecked();
    // The gate lives above the router, so the countdown and the drop keep
    // playing while the score page is loaded behind them.
    openScoreGate(trimmedNim);
  };

  // Seluruh halaman dikunci sampai waktu reveal. Server dan render pertama
  // klien sama-sama memakai kondisi ini, jadi tidak ada hydration mismatch.
  if (!ready || !isRevealed) return <RevealLock remainingMs={remainingMs} />;

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

        <section className={styles.scoreSection} aria-labelledby="score-check-title">
          <div className={styles.panelContent}>
            <Image className={`${styles.panelOrnament} ${styles.panelOrnamentLeft}`} src="/landing/vertical-decor.svg" alt="" width={390} height={756} />
            <Image className={`${styles.panelOrnament} ${styles.panelOrnamentRight}`} src="/landing/vertical-decor.svg" alt="" width={390} height={756} />
            <h2 id="score-check-title">Check Your Team&apos;s Score</h2>
            <p>All Participants Can View Their Detailed Scores And Judges&apos; Feedback, Whether They Qualified For The Final Or Not.</p>
            <form
              className={styles.searchForm}
              onSubmit={handleScoreCheck}
              noValidate
            >
              <label
                className={`${styles.searchInput} ${nimError ? styles.searchInputError : ""}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span className={styles.srOnly}>NIM ketua tim</span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  name="nim"
                  placeholder="Masukkan NIM ketua"
                  value={nim}
                  onChange={(event) => handleNimChange(event.target.value)}
                  aria-required="true"
                  aria-invalid={nimError ? "true" : "false"}
                  aria-describedby="score-check-result"
                />
              </label>
              <button type="submit">Cek Nilai</button>
            </form>
            <div
              className={`${styles.result} ${nimError ? styles.resultError : ""}`}
              id="score-check-result"
              aria-live="polite"
            >
              {nimError}
            </div>
          </div>
        </section>

        {hasChecked ? (
          <section
            ref={rankingsRef}
            className={`${styles.rankingsSection} ${
              isPending ? styles.rankingsPending : ""
            } ${rankingsVisible ? styles.rankingsVisible : ""}`}
            aria-labelledby="ranking-list-title"
          >
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
                <h2 id="ranking-list-title">Finalis {category.label}</h2>
                <div className={styles.cardList} role="tabpanel">
                  {visibleFinalists.length > 0
                    ? visibleFinalists.map((entry, index) => (
                        <article
                          className={`${styles.rankingCard} ${hideRanks ? styles.noRankCard : ""}`}
                          key={entry.teamId}
                        >
                          {!hideRanks && (
                            <div className={styles.rank}>{entry.rank ?? index + 1}</div>
                          )}
                          <div className={styles.teamInfo}>
                            <h3>{entry.teamName}</h3>
                            {entry.description && <p>{entry.description}</p>}
                          </div>
                          <div className={styles.score}>
                            <strong>
                              {typeof entry.score === "number"
                                ? Number.isInteger(entry.score)
                                  ? entry.score
                                  : entry.score.toFixed(2)
                                : "—"}
                            </strong>
                            <span>
                              {typeof entry.score === "number"
                                ? entry.scoreLabel ?? "Final Score"
                                : "Finalist"}
                            </span>
                          </div>
                        </article>
                      ))
                    : Array.from({ length: 5 }, (_, index) => (
                        <article
                          className={`${styles.rankingCard} ${styles.placeholderCard} ${
                            hideRanks ? styles.noRankCard : ""
                          }`}
                          key={`placeholder-${category.id}-${index}`}
                        >
                          {!hideRanks && <div className={styles.rank}>{index + 1}</div>}
                          <div className={styles.teamInfo}>
                            <h3>{PLACEHOLDER_NAME}</h3>
                            <p>{PLACEHOLDER_DESCRIPTION}</p>
                          </div>
                          <div className={styles.score}>
                            <strong>{PLACEHOLDER_SCORE}</strong>
                            <span>Final Score</span>
                          </div>
                        </article>
                      ))}
                </div>

                {visibleFinalists.length > 0 && (
                  <div className={styles.ctaPanel}>
                    <div className={styles.ctaText}>
                      <h3>Registrasi Ulang Finalis</h3>
                      <p>
                        Finalis wajib melakukan registrasi ulang. Pastikan nama ketua
                        tim dan nama tim telah diisi sebelum pesan dikirimkan ke
                        contact person.
                      </p>
                    </div>
                    <a
                      className={styles.ctaButton}
                      href={getAdminWhatsAppUrl(category.label)}
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
            </div>
          </section>
        ) : (
          <section className={styles.lockedRankings} aria-labelledby="ranking-list-title">
            <p>Cek nilai tim terlebih dahulu untuk membuka daftar finalis.</p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
