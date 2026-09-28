import type { Metadata } from "next";
import { Geist_Mono, Google_Sans } from "next/font/google";
import "./globals.css";

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: "variable",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adikara.helloprodigi.pro"),
  title: {
    default: "ADIKARA 2026 - Telkom University",
    template: "%s | ADIKARA 2026",
  },
  description:
    "ADIKARA 2026 - Informatics Students' Digital Creative and Innovation Competition by Telkom University.",
  keywords: [
    "adikara",
    "adikara 2026",
    "adikara telkom university",
    "digital creative innovation competition",
    "kompetisi mahasiswa telkom",
    "adikara statistics",
    "adikara finalists",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "ADIKARA 2026",
    title: "ADIKARA 2026 - Telkom University",
    description:
      "Informatics Students' Digital Creative and Innovation Competition by Telkom University.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADIKARA 2026 - Telkom University",
    description:
      "Informatics Students' Digital Creative and Innovation Competition by Telkom University.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${googleSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: "window.scrollTo(0, 0);",
          }}
        />
        {children}
      </body>
    </html>
  );
}
