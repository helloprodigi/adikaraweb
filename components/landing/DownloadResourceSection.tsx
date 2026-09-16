import Image from "next/image";

export function DownloadResourceSection() {
  return (
    <section className="download-resource-section" id="download-resource" aria-labelledby="resource-title">
      <div className="download-resource-card-wrapper">
        <Image
          className="download-resource-bg"
          src="/landing/download-resource-card.svg"
          alt=""
          width={1582}
          height={443}
          priority
        />

        <div className="download-resource-content">
          <div className="download-resource-buttons">
            <a
              className="resource-button"
              href="#guidebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="resource-button-left">
                <span className="file-icon-wrapper" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" />
                  </svg>
                </span>
                <span className="resource-button-label">Guidebook ADIKARA 2026</span>
              </div>
              <span className="download-circle" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
            </a>

            <a
              className="resource-button"
              href="#rules"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="resource-button-left">
                <span className="file-icon-wrapper" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" />
                  </svg>
                </span>
                <span className="resource-button-label">Competitions Rules</span>
              </div>
              <span className="download-circle" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
