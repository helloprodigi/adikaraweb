import Image from "next/image";

const timelineItems = [
  { title: "Registration", date: "Date To Be Announced" },
  { title: "Kick Off", date: "5 October 2026" },
  { title: "Mentoring", date: "November 2026" },
  { title: "Qualifying Round", date: "1 - 21 November 2026" },
  { title: "Finals", date: "November 2026" },
  { title: "Awarding", date: "22 November 2026" },
];

export function TimelineSection() {
  return (
    <section className="timeline-section" id="timeline" aria-labelledby="timeline-title">
      <Image
        className="timeline-decor timeline-decor-left"
        src="/landing/vertical-decor.svg"
        alt=""
        width={390}
        height={756}
      />
      <Image
        className="timeline-decor timeline-decor-right"
        src="/landing/vertical-decor.svg"
        alt=""
        width={390}
        height={756}
      />

      <div className="timeline-content">
        <div className="prize-row">
          <span>Total cash prize pool</span>
          <strong>Rp100.000.000</strong>
        </div>

        <h2 id="timeline-title">Event Timeline</h2>

        <div className="timeline-track">
          <div className="timeline-line" aria-hidden="true" />
          {timelineItems.map((item) => (
            <div className="timeline-item" key={item.title}>
              <span className="timeline-node" aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}