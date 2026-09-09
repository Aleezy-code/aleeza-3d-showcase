import { useState } from "react";
import { FadeIn } from "./FadeIn";
import { ContactButton } from "./ContactButton";
import { Magnet } from "./Magnet";
import { Lightbox } from "./Lightbox";
import { scrollToSection } from "@/lib/scroll";

const NAV_LINKS: { label: string; id: string }[] = [
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const PORTRAIT =
  "https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png";

export function HeroSection() {
  const [portraitOpen, setPortraitOpen] = useState(false);

  return (
    <section className="relative h-screen flex flex-col" style={{ overflowX: "clip" }}>
      <FadeIn as="nav" delay={0} y={-20} className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8 relative z-20">
        {NAV_LINKS.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(l.id);
            }}
            className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
          >
            {l.label}
          </a>
        ))}
      </FadeIn>


      <div className="overflow-hidden mt-6 sm:mt-4 md:-mt-5 relative z-20 pointer-events-none">
        <FadeIn as="h1" delay={0.15} y={40} className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
          Hi, i&apos;m aleeza
        </FadeIn>
      </div>

      <Magnet
        padding={150}
        strength={3}
        activeTransition="transform 0.3s ease-out"
        inactiveTransition="transform 0.6s ease-in-out"
        className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]"
      >
        <FadeIn delay={0.6} y={30}>
          <button
            type="button"
            onClick={() => setPortraitOpen(true)}
            aria-label="Open portrait"
            className="block w-full cursor-zoom-in"
          >
            <img
              src={PORTRAIT}
              alt="Aleeza portrait"
              className="w-full h-auto select-none"
              draggable={false}
            />
          </button>
        </FadeIn>

      </Magnet>

      <div className="mt-auto flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 relative z-20">
        <FadeIn delay={0.35} y={20}>
          <p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
          >
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
      <Lightbox
        images={[{ src: PORTRAIT, alt: "Aleeza portrait", caption: "Aleeza — 3D Creator" }]}
        index={portraitOpen ? 0 : null}
        onClose={() => setPortraitOpen(false)}
        onIndexChange={() => {}}
      />
    </section>

  );
}
