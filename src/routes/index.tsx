import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Experience } from "@/components/portfolio/Experience";
import { Responsibilities } from "@/components/portfolio/Responsibilities";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Achievements, TechStack } from "@/components/portfolio/Stats";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import {
  BackToTop,
  CursorGlow,
  LoadingScreen,
  ScrollProgress,
} from "@/components/portfolio/Chrome";

const title = "Surya Prakash Vankudothu — AI & Machine Learning Engineer";
const description =
  "Portfolio of Surya Prakash Vankudothu, AI Engineer building LLM applications, RAG systems, AI agents and computer vision models in production.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <LoadingScreen />
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Responsibilities />
        <Achievements />
        <TechStack />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <Toaster position="bottom-center" />
    </div>
  );
}
