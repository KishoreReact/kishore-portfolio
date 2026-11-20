import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import TechMarquee from "@/components/ui/TechMarquee";
import dynamic from "next/dynamic";

// Load AI chat widget client-side only
const AiChat = dynamic(() => import("@/components/ui/AiChat"), { ssr: false });

export default function Home() {
  return (
    <main className="relative z-10">
      <Navbar />
      <Hero />
      <TechMarquee />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
      <AiChat />
    </main>
  );
}
