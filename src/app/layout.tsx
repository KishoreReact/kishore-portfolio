import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

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

// Fixed 3D canvas — loaded client-side only, sits behind all HTML content
const GlobalSceneContainer = dynamic(
  () => import("@/components/three/GlobalSceneContainer"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Kishore C — Full Stack Developer",
  description:
    "Portfolio of Kishore C, a Full Stack Developer based in Kerala, India. Specializing in React, Next.js, Node.js, and interactive web experiences.",
  keywords: ["Full Stack Developer", "React", "Next.js", "Node.js", "Kerala", "India", "Portfolio"],
  authors: [{ name: "Kishore C" }],
  openGraph: {
    title: "Kishore C — Full Stack Developer",
    description:
      "Interactive portfolio featuring immersive WebGL 3D environments, fluid animations, and 7+ production-ready projects.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kishore C — Full Stack Developer",
    description: "Interactive portfolio featuring immersive WebGL 3D environments and fluid animations.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} font-sans bg-obsidian text-ghost-white antialiased noise-overlay`}
      >
        {/* Global fixed 3D background — behind all HTML (z-index: 0) */}
        <GlobalSceneContainer />
        {children}
      </body>
    </html>
  );
}
