import Image from "next/image";

export function MyProdigiSection() {
  return (
    <section className="myprodigi-section" id="myprodigi" aria-labelledby="myprodigi-title">
      <div className="myprodigi-content">
        <div className="myprodigi-copy">
          <h2 id="myprodigi-title">
            Find Your Team
            <br />
            on MyProdigi
          </h2>
          <a
            className="button myprodigi-button"
            href="https://my.helloprodigi.pro/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open MyProdigi
          </a>
        </div>

        <Image
          className="myprodigi-mockup"
          src="/landing/myprodigi-mockup.svg"
          alt="MyProdigi mobile application preview"
          width={629}
          height={722}
        />
      </div>
    </section>
  );
}
