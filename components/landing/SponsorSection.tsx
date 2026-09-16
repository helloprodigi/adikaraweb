import Image from "next/image";

export function SponsorSection() {
  return (
    <section className="sponsor-section" id="sponsor" aria-labelledby="sponsor-title">
      <Image
        className="sponsor-decor sponsor-decor-left"
        src="/landing/vertical-decor.svg"
        alt=""
        width={390}
        height={756}
      />
      <Image
        className="sponsor-decor sponsor-decor-right"
        src="/landing/vertical-decor.svg"
        alt=""
        width={390}
        height={756}
      />

      <div className="sponsor-content">
        <div className="sponsor-dots" aria-hidden="true">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>

        <h2 id="sponsor-title">
          Partner With Us,
          <br />
          Create Greater Impact
        </h2>

        <p className="sponsor-description">
          By becoming a sponsor, you are not only supporting an
          <br />
          event, but also investing in young talents, innovation, and a
          <br />
          brighter digital future for Indonesia.
        </p>

        <a className="button sponsor-button" href="#register">
          Become a Sponsor
        </a>
      </div>
    </section>
  );
}
