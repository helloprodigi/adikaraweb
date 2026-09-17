import { CurtainIntro } from "@/components/landing/CurtainIntro";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { CategoriesSection } from "@/components/landing/CategoriesSection";
import { DownloadResourceSection } from "@/components/landing/DownloadResourceSection";
import { MyProdigiSection } from "@/components/landing/MyProdigiSection";
import { OverviewSection } from "@/components/landing/OverviewSection";
import { SponsorSection } from "@/components/landing/SponsorSection";
import { ThemeSection } from "@/components/landing/ThemeSection";
import { TimelineSection } from "@/components/landing/TimelineSection";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="landing-page">
      <CurtainIntro />
      <Navbar />
      <Hero />
      <ThemeSection />
      <OverviewSection />
      <TimelineSection />
      <CategoriesSection />
      <MyProdigiSection />
      <SponsorSection />
      <DownloadResourceSection />
      <Footer />
    </main>
  );
}
