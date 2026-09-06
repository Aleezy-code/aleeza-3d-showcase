import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const isOpen = index !== null && index >= 0 && index < images.length;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndexChange((index + delta + images.length) % images.length);
    },
    [index, images.length, onIndexChange],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, go, onClose]);

  const current = isOpen ? images[index] : null;

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption ?? current.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          style={{ backgroundColor: "rgba(12,12,12,0.94)" }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image"
            className="absolute right-4 top-4 z-10 rounded-full border border-[#D7E2EA]/40 p-2 text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-3 sm:left-6 z-10 rounded-full border border-[#D7E2EA]/40 p-2 text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-3 sm:right-6 z-10 rounded-full border border-[#D7E2EA]/40 p-2 text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <motion.figure
            key={current.src}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full max-w-5xl flex-col items-center gap-4"
          >
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[78vh] w-auto rounded-3xl object-contain"
            />
            {current.caption && (
              <figcaption className="text-center text-sm uppercase tracking-widest text-[#D7E2EA]/70">
                {current.caption}
                {images.length > 1 && ` — ${(index ?? 0) + 1} / ${images.length}`}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
