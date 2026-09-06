import { useEffect, useMemo, useRef, useState } from "react";
import { Lightbox, type LightboxImage } from "./Lightbox";


const IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const ROW1 = IMAGES.slice(0, 11);
const ROW2 = IMAGES.slice(11);

function Tile({ src, onOpen }: { src: string; onOpen: (src: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(src)}
      aria-label="Open showreel frame"
      className="shrink-0 rounded-2xl overflow-hidden cursor-zoom-in transition-transform duration-300 hover:scale-[1.03]"
      style={{ width: 420, height: 270 }}
    >
      <img src={src} alt="Showreel frame" loading="lazy" className="w-full h-full object-cover" />
    </button>
  );
}


export function MarqueeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const o = (window.scrollY - top + window.innerHeight) * 0.3;
      setOffset(o);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const row1 = [...ROW1, ...ROW1, ...ROW1];
  const row2 = [...ROW2, ...ROW2, ...ROW2];
  const x1 = offset - 200;
  const x2 = -(offset - 200);

  return (
    <section ref={ref} className="pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden" style={{ backgroundColor: "#0C0C0C" }}>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3" style={{ transform: `translateX(${x1}px)`, willChange: "transform" }}>
          {row1.map((src, i) => <Tile key={`a-${i}`} src={src} />)}
        </div>
        <div className="flex gap-3" style={{ transform: `translateX(${x2}px)`, willChange: "transform" }}>
          {row2.map((src, i) => <Tile key={`b-${i}`} src={src} />)}
        </div>
      </div>
    </section>
  );
}
