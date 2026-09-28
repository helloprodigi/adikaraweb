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
  title: "ADIKARA 2026",
  description: "ADIKARA 2026 - Informatics Students' Digital Creative and Innovation Competition by Telkom University.",
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
