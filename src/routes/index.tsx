import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { MarqueeSection } from "@/components/portfolio/MarqueeSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { ServicesSection } from "@/components/portfolio/ServicesSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { MyUploadsSection } from "@/components/portfolio/MyUploadsSection";
import { ContactSection } from "@/components/portfolio/ContactSection";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aleeza — 3D Creator" },
      { name: "description", content: "Aleeza is a 3D creator crafting striking, unforgettable projects across branding, motion design, and web experiences." },
      { property: "og:title", content: "Aleeza — 3D Creator" },
      { property: "og:description", content: "Portfolio of Aleeza, a 3D creator specializing in modeling, rendering, motion design, branding, and web design." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main style={{ backgroundColor: "#0C0C0C", overflowX: "clip", fontFamily: "'Kanit', sans-serif" }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
