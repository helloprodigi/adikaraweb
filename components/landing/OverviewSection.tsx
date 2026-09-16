import Image from "next/image";

export function OverviewSection() {
  return (
    <section
      className="overview-section"
      id="overview-details"
      aria-labelledby="overview-title"
    >
      <Image
        className="overview-decor overview-decor-left"
        src="/landing/horizontal-decor.svg"
        alt=""
        width={520}
        height={430}
      />
      <Image
        className="overview-decor overview-decor-right"
        src="/landing/horizontal-decor.svg"
        alt=""
        width={520}
        height={430}
      />

      <div className="overview-content">
        <h2 id="overview-title">Overview Of ADIKARA 2026</h2>

        <div className="overview-video" role="img" aria-label="Adikara 2026 video preview">
          <button className="play-button" type="button" aria-label="Play overview video">
            <span aria-hidden="true" />
          </button>
        </div>

        <div className="overview-stats" aria-label="Adikara 2025 statistics">
          <div className="stat-frame">
            <Image
              src="/landing/frame-participants.svg"
              alt=""
              width={274}
              height={74}
            />
            <div className="stat-frame-content">
              <strong>1100+</strong>
              <span>Participants 2025</span>
            </div>
          </div>
          <div className="stat-frame">
            <Image
              src="/landing/frame-teams.svg"
              alt=""
              width={274}
              height={74}
            />
            <div className="stat-frame-content">
              <strong>360+</strong>
              <span>Teams 2025</span>
            </div>
          </div>
        </div>

        <p className="overview-description">
          <strong>ADIKARA</strong> (Ajang Digital Kreatif dan Inovasi Informatika) is
          a competition organized by
          <br />
          the <strong>Faculty of Informatics</strong> at <strong>Telkom University</strong>.
          It aims to develop technical skills,
          <br />
          creativity, and an entrepreneurial spirit through a variety of challenging and
          <br />
          innovative competitions.
        </p>
      </div>
    </section>
  );
}