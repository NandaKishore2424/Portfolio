import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { profile } from "@/content/profile";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const description =
  "Nanda Kishore R, a backend software engineer (Java / Spring Boot, Python / FastAPI, PostgreSQL). Multi-tenant systems, concurrency control, transactional integrity.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} · Software Engineer, Backend`,
    template: `%s · ${profile.name}`,
  },
  description,
  keywords: [
    "Nanda Kishore R",
    "backend engineer",
    "software engineer",
    "Java",
    "Spring Boot",
    "PostgreSQL",
    "FastAPI",
    "RabbitMQ",
    "Chennai",
  ],
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    siteName: profile.name,
    title: `${profile.name} · Software Engineer, Backend`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · Software Engineer, Backend`,
    description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#05070b",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Software Engineer (Backend)",
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Chennai", addressCountry: "IN" },
  alumniOf: "Saveetha Engineering College",
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: ["Java", "Spring Boot", "PostgreSQL", "FastAPI", "RabbitMQ", "Multi-tenancy"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="min-h-dvh bg-bg text-fg">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-teal focus:px-3 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
