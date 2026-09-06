import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { FadeIn } from "./FadeIn";
import { LiveProjectButton } from "./LiveProjectButton";
import { Lightbox, type LightboxImage } from "./Lightbox";


interface Project {
  n: string;
  category: string;
  name: string;
  col1: [string, string];
  col2: string;
}

const PROJECTS: Project[] = [
  {
    n: "01",
    category: "Client",
    name: "Nextlevel Studio",
    col1: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
    ],
    col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
  },
  {
    n: "02",
    category: "Personal",
    name: "Aura Brand Identity",
    col1: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
    ],
    col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
  },
  {
    n: "03",
    category: "Client",
    name: "Solaris Digital",
    col1: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
    ],
    col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
  },
];

function ProjectCard({ project, index, total, progress }: { project: Project; index: number; total: number; progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const range = [index / total, 1];
  const scale = useTransform(progress, range, [1, targetScale]);
  return (
    <div className="sticky top-24 md:top-32 h-[85vh] flex items-center justify-center" style={{ top: `${index * 28 + 96}px` }}>
      <motion.div
        style={{ scale, backgroundColor: "#0C0C0C" }}
        className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <span className="font-black shrink-0 hero-heading" style={{ fontSize: "clamp(3rem, 10vw, 140px)", lineHeight: 1 }}>{project.n}</span>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="text-[#D7E2EA] uppercase tracking-widest text-xs sm:text-sm opacity-60">{project.category}</span>
            <h3 className="text-[#D7E2EA] font-medium uppercase" style={{ fontSize: "clamp(1.2rem, 2.4vw, 2.2rem)", lineHeight: 1.1 }}>{project.name}</h3>
          </div>
          <div className="shrink-0">
            <LiveProjectButton />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3 sm:gap-4">
          <div className="col-span-2 flex flex-col gap-3 sm:gap-4">
            <img src={project.col1[0]} alt="" className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]" style={{ height: "clamp(130px, 16vw, 230px)" }} loading="lazy" />
            <img src={project.col1[1]} alt="" className="w-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]" style={{ height: "clamp(160px, 22vw, 340px)" }} loading="lazy" />
          </div>
          <div className="col-span-3">
            <img src={project.col2} alt="" className="w-full h-full object-cover rounded-[40px] sm:rounded-[50px] md:rounded-[60px]" loading="lazy" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section id="projects" ref={ref} className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-20" style={{ backgroundColor: "#0C0C0C" }}>
      <FadeIn as="h2" y={40} className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16 sm:mb-20 md:mb-24" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
        Project
      </FadeIn>
      <div className="flex flex-col">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.n} project={p} index={i} total={PROJECTS.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
