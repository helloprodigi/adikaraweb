"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";

const TOUR_STORAGE_KEY = "adikara-ranking-tour-dismissed";
// 300ms morph capsule -> lingkaran, lalu 900ms scale keluar.
const TOUR_EXIT_DURATION = 1200;
const MOBILE_MENU_BREAKPOINT = "(max-width: 768px)";
// Biarkan spotlight selesai membuka area sidebar sebelum sidebar ditutup,
// supaya jelas bahwa tautan Rankings ada di dalam sidebar.
const MOBILE_SIDEBAR_CLOSE_DELAY = 900;

const isMobileViewport = () =>
  typeof window !== "undefined" &&
  window.matchMedia(MOBILE_MENU_BREAKPOINT).matches;

type TourStage = "hidden" | "announcement" | "rankings" | "closing";

export function RankingTour() {
  const router = useRouter();
  const [stage, setStage] = useState<TourStage>("hidden");
  const [dontShowAgain, setDontShowAgain] = useState(false);
  // Dipakai supaya konten kartu tidak berubah mendadak saat stage closing,
  // dan supaya close dari pengumuman tidak memakai mask lingkaran spotlight.
  const [closingFrom, setClosingFrom] = useState<"announcement" | "rankings" | null>(null);
  const stageRef = useRef<TourStage>("hidden");
  const sidebarCloseTimer = useRef<number | null>(null);
  const [spotlight, setSpotlight] = useState({
    top: 24,
    left: 0,
    width: 120,
    height: 48,
  });

  const persistDismissal = useCallback(() => {
    if (dontShowAgain) {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
    }
  }, [dontShowAgain]);

  const closeTour = useCallback((navigateToRankings = false) => {
    setClosingFrom(stageRef.current === "rankings" ? "rankings" : "announcement");
    persistDismissal();
    if (isMobileViewport()) {
      if (sidebarCloseTimer.current !== null) {
        window.clearTimeout(sidebarCloseTimer.current);
      }
      sidebarCloseTimer.current = window.setTimeout(() => {
        window.dispatchEvent(new Event("adikara:closeMobileMenu"));
        sidebarCloseTimer.current = null;
      }, MOBILE_SIDEBAR_CLOSE_DELAY);
    }
    setStage("closing");
    window.setTimeout(() => {
      setStage("hidden");
      setClosingFrom(null);
      document.body.style.overflow = "";
      if (navigateToRankings) router.push("/rankings");
    }, TOUR_EXIT_DURATION);
  }, [persistDismissal, router]);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(
    () => () => {
      if (sidebarCloseTimer.current !== null) {
        window.clearTimeout(sidebarCloseTimer.current);
      }
    },
    []
  );

  useEffect(() => {
    if (localStorage.getItem(TOUR_STORAGE_KEY) === "true") return;

    let started = false;
    const beginTour = () => {
      if (started) return;
      started = true;
      setStage("announcement");
      document.body.style.overflow = "hidden";
    };

    const fallbackTimer = window.setTimeout(beginTour, 3300);
    window.addEventListener("curtainDone", beginTour, { once: true });
    return () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("curtainDone", beginTour);
    };
  }, []);

  useEffect(() => {
    if (stage !== "rankings") return;

    const updateSpotlight = () => {
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>('[data-tour="rankings-link"]')
      );
      const target =
        targets.find((element) => {
          const rect = element.getBoundingClientRect();
          const inViewport =
            rect.right > 0 &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.top < window.innerHeight;
          return rect.width > 0 && rect.height > 0 && inViewport;
        }) ?? null;

      if (!target) return;

      const rect = target.getBoundingClientRect();
      const next = {
        top: rect.top - 8,
        left: rect.left - 8,
        width: rect.width + 16,
        height: rect.height + 16,
      };
      // Hindari re-render tiap frame saat sidebar masih bergerak.
      setSpotlight((prev) =>
        prev.top === next.top &&
        prev.left === next.left &&
        prev.width === next.width &&
        prev.height === next.height
          ? prev
          : next
      );
    };

    let followFrame = 0;
    const stopFollowing = () => {
      if (followFrame) cancelAnimationFrame(followFrame);
      followFrame = 0;
    };

    // Sidebar slide 350ms + link masuk 450ms dengan delay 150ms.
    // Dipakai juga saat pindah ke desktop untuk mengulang ukuran setelah
    // breakpoint baru benar-benar terpasang.
    const followTarget = (duration: number) => {
      stopFollowing();
      const start = performance.now();
      const step = () => {
        updateSpotlight();
        if (performance.now() - start < duration) {
          followFrame = requestAnimationFrame(step);
        } else {
          followFrame = 0;
        }
      };
      followFrame = requestAnimationFrame(step);
    };

    const syncViewport = (mobile: boolean) => {
      if (mobile) {
        // Di mobile tautan desktop disembunyikan: buka sidebar dulu, lalu
        // ikuti tautan Rankings di dalamnya sampai animasinya selesai.
        window.dispatchEvent(new Event("adikara:openMobileMenu"));
        updateSpotlight();
        followTarget(800);
      } else {
        stopFollowing();
        window.dispatchEvent(new Event("adikara:closeMobileMenu"));
        updateSpotlight();
        followTarget(400);
      }
    };

    syncViewport(isMobileViewport());

    const media = window.matchMedia(MOBILE_MENU_BREAKPOINT);
    const handleMediaChange = (event: MediaQueryListEvent) =>
      syncViewport(event.matches);
    media.addEventListener("change", handleMediaChange);

    window.addEventListener("resize", updateSpotlight);
    window.addEventListener("scroll", updateSpotlight, true);

    const handleRankingClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLElement>(
        '[data-tour="rankings-link"]'
      );
      if (!link) return;
      event.preventDefault();
      event.stopPropagation();
      closeTour(true);
    };

    document.addEventListener("click", handleRankingClick, true);
    return () => {
      stopFollowing();
      media.removeEventListener("change", handleMediaChange);
      window.removeEventListener("resize", updateSpotlight);
      window.removeEventListener("scroll", updateSpotlight, true);
      document.removeEventListener("click", handleRankingClick, true);
    };
  }, [stage, closeTour]);

  useEffect(() => {
    if (stage === "hidden") return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTour(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [stage, closeTour]);

  if (stage === "hidden") return null;

  const cardStage = stage === "closing" ? closingFrom ?? "announcement" : stage;

  return (
    <div
      className={[
        "ranking-tour",
        stage === "rankings" ? "is-rankings" : "",
        stage === "closing" ? "is-closing" : "",
        stage === "closing" && closingFrom === "rankings" ? "is-revealing" : "",
      ].join(" ").trim()}
      aria-live="polite"
    >
      <div className="ranking-tour-fullbackdrop" aria-hidden="true" />

      {(stage === "rankings" ||
        (stage === "closing" && closingFrom === "rankings")) && (
        <>
          <div
            className="ranking-tour-hole"
            style={
              {
                // Posisikan dari titik tengah supaya morph capsule -> lingkaran
                // tidak menggeser spotlight saat lebar/tinggi disamakan.
                left: spotlight.left + spotlight.width / 2,
                top: spotlight.top + spotlight.height / 2,
                width: spotlight.width,
                height: spotlight.height,
                "--hole-size": `${Math.max(spotlight.width, spotlight.height)}px`,
              } as CSSProperties
            }
            aria-hidden="true"
          />
        </>
      )}

      <div className="ranking-tour-card" role="dialog" aria-modal="true">
        {cardStage === "announcement" ? (
          <>
            <span className="ranking-tour-kicker">PENGUMUMAN ADIKARA 2026</span>
            <p>
              Halo, <strong>ProPeople!</strong> Pengumuman hasil dan finalist akan
              segera hadir hari ini (19/11/2026) pukul <strong>18.00 WIB!</strong>
            </p>
          </>
        ) : (
          <>
            <span className="ranking-tour-kicker">LANGKAH 2 DARI 2</span>
            <p>
              Klik pada bagian <strong>Rankings</strong> untuk melihat hasil.
            </p>
          </>
        )}

        <div className="ranking-tour-actions">
          <label className="ranking-tour-check">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) => setDontShowAgain(event.target.checked)}
            />
            <span aria-hidden="true" />
            Don&apos;t show again
          </label>

          <div className="ranking-tour-buttons">
            {cardStage === "announcement" ? (
              <button
                type="button"
                className="ranking-tour-skip"
                onClick={() => closeTour(false)}
              >
                Skip
              </button>
            ) : (
              <button
                type="button"
                className="ranking-tour-next"
                onClick={() => closeTour(false)}
              >
                Done
                <span aria-hidden="true">→</span>
              </button>
            )}
            {cardStage === "announcement" && (
              <button
                type="button"
                className="ranking-tour-next"
                onClick={() => setStage("rankings")}
              >
                Next
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
