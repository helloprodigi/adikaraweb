import Image from "next/image";

export function Hero() {
  return (
    <section className="hero" id="overview" aria-labelledby="hero-title">
      <Image
        className="hero-decor hero-decor-left"
        src="/landing/hero/hero-decor.svg"
        alt=""
        width={450}
        height={440}
        priority
      />
      <Image
        className="hero-decor hero-decor-right"
        src="/landing/hero/hero-decor.svg"
        alt=""
        width={450}
        height={440}
        priority
      />

      <div className="hero-content">
        <div className="partner-logos" aria-label="Event partners">
          <Image
            src="/landing/hero/informatics-logo.svg"
            alt="Telkom University Faculty of Informatics"
            width={182}
            height={48}
          />
          <Image
            src="/landing/hero/prodigi-logo.svg"
            alt="Prodigi"
            width={142}
            height={48}
          />
        </div>

        <Image
          className="hero-icon"
          src="/landing/hero/adikara-icon.svg"
          alt="Adikara emblem"
          width={142}
          height={190}
          priority
        />
        <h1 id="hero-title">
          ADIKARA <span>2026</span>
        </h1>
        <a className="button button-hero" href="#register">
          Register Now
        </a>
      </div>
    </section>
  );
}