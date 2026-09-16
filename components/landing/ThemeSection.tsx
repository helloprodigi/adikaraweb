import Image from "next/image";

export function ThemeSection() {
  return (
    <section className="theme-section" id="theme" aria-labelledby="theme-title">
      <Image
        className="theme-card theme-card-left"
        src="/landing/adikara-card.svg"
        alt=""
        width={434}
        height={454}
      />
      <Image
        className="theme-card theme-card-right"
        src="/landing/adikara-card.svg"
        alt=""
        width={434}
        height={454}
      />

      <div className="theme-content">
        <p>ADIKARA 2026 Theme</p>
        <h2 id="theme-title">
          Empowering Next-Gen Digital Talents to Architect
          <br />
          Sustainable Solutions for Human Wellbeing
        </h2>
      </div>
    </section>
  );
}