"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const RESOURCES = [
  {
    label: "Guidebook ADIKARA 2026",
    href: "https://helloprodigi.pro/GuidebookADIKARA2026",
    external: false,
  },
  {
    label: "Template Proposal",
    href: "https://helloprodigi.pro/TemplateProposalADIKARA2026",
    external: false,
  },
  {
    label: "Twibbon & Caption",
    href: "https://helloprodigi.pro/TwibbonADIKARA2026",
    external: false,
  },
  {
    label: "MyProdigi",
    href: "https://my.helloprodigi.pro/",
    external: true,
  },
];

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM13 9V3.5L18.5 9H13Z" />
    </svg>
  );
}

/* Chain link: marks this as a link out to another site, i.e. "kunjungi". */
function ExternalLinkIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

export function DownloadResourceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -100px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`download-resource-section ${isVisible ? "is-visible" : ""}`}
      id="download-resource"
      aria-labelledby="resource-title"
      ref={sectionRef}
    >
      <div className="download-resource-card-wrapper">
        <div className="download-resource-card">
          <Image
            className="download-resource-bg-desktop"
            src="/landing/download-resource-card.webp"
            alt=""
            width={1582}
            height={443}
            sizes="(max-width: 1400px) 100vw, 1280px"
            priority
          />

          <div className="download-resource-content">
            <div className="download-resource-info">
              <h2 id="resource-title">Download Resource</h2>
              <p>
                Access All Necessary Documents, Guidebooks, And Templates For ADIKARA 2026. Make Sure To Read The Guidelines Carefully Before Registering.
              </p>
            </div>

            <div
              className="download-resource-buttons"
              data-native-scroll
            >
              {RESOURCES.map((resource) => (
                <a
                  className="resource-button"
                  href={resource.href}
                  key={resource.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="resource-button-left">
                    <span className="file-icon-wrapper" aria-hidden="true">
                      {resource.external ? <ExternalLinkIcon /> : <FileIcon />}
                    </span>
                    <span className="resource-button-label">{resource.label}</span>
                  </div>
                  <span className="link-circle" aria-hidden="true">
                    <ExternalLinkIcon />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
