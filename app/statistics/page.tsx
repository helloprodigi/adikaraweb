import Image from "next/image";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/landing/navbar";
import { ParticipantDetail } from "@/components/statistics/ParticipantDetail";
import { RegistDistribution } from "@/components/statistics/RegistDistribution";
import { RegistStatistic } from "@/components/statistics/RegistStatistic";
import styles from "@/components/statistics/statistics.module.css";

export default function StatisticsPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <RegistStatistic />
        <RegistDistribution />
        <div className={styles.sectionConnector} aria-hidden="true">
          <Image
            className={`${styles.connectorDecor} ${styles.connectorDecorLeft}`}
            src="/landing/vertical-decor.svg"
            alt=""
            width={390}
            height={756}
          />
          <Image
            className={`${styles.connectorDecor} ${styles.connectorDecorRight}`}
            src="/landing/vertical-decor.svg"
            alt=""
            width={390}
            height={756}
          />
        </div>
        <ParticipantDetail />
      </main>
      <Footer />
    </>
  );
}
