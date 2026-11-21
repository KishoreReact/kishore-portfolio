import type { Metadata } from "next";
import { Outfit, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";
import BookingModal from "@/components/ui/BookingModal";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Fixed 3D canvas — loaded client-side only, sits behind all HTML content
const GlobalSceneContainer = dynamic(
  () => import("@/components/three/GlobalSceneContainer"),
  { ssr: false }
);

const siteUrl = "https://kishore-portfolio-k36z.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Kishore C — AI Full Stack Developer",
  description:
    "Portfolio of Kishore C, an AI Full Stack Developer with 5+ years of experience building AI agents, RAG pipelines, real-time platforms, and scalable Next.js/FastAPI products.",
  keywords: [
    "AI Full Stack Developer",
    "React",
    "Next.js",
    "FastAPI",
    "AI Agents",
    "RAG",
    "WebRTC",
    "LiveKit",
    "Kerala",
    "India",
    "Portfolio",
  ],
  authors: [{ name: "Kishore C" }],
  openGraph: {
    title: "Kishore C — AI Full Stack Developer",
    description:
      "5+ years · AI agents · RAG pipelines · real-time platforms · Next.js / FastAPI. Interactive portfolio with immersive WebGL 3D environments.",
    type: "website",
    locale: "en_IN",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kishore C — AI Full Stack Developer",
    description:
      "5+ years building AI-powered products from pixel to production. Explore my portfolio.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kishore C",
  jobTitle: "AI Full Stack Developer",
  url: siteUrl,
  sameAs: [
    "https://github.com/KishoreReact",
    "https://www.linkedin.com/in/kishore-c-95742712a/",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Palakkad",
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
  knowsAbout: [
    "React.js",
    "Next.js",
    "AI Agents",
    "RAG Pipelines",
    "FastAPI",
    "WebRTC",
    "LiveKit",
    "TypeScript",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans bg-obsidian text-ghost-white antialiased noise-overlay`}
      >
        {/* Global fixed 3D background — behind all HTML (z-index: 0) */}
        <GlobalSceneContainer />
        <BookingProvider>
          {children}
          <BookingModal />
        </BookingProvider>
      </body>
    </html>
  );
}
