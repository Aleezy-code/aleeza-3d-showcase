import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { Lightbox, type LightboxImage } from "./Lightbox";

const STORAGE_KEY = "aleeza-gallery-uploads";
const MAX_DIMENSION = 1600;
const MAX_FILES = 24;

interface Upload {
  id: string;
  name: string;
  src: string;
}

/** Downscale to keep browser storage small, and normalise to JPEG. */
function readAndCompress(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not a readable image"));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not process the image"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function MyUploadsSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUploads(JSON.parse(raw) as Upload[]);
    } catch {
      /* ignore unreadable storage */
    }
  }, []);

  const persist = useCallback((next: Upload[]) => {
    setUploads(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      setError("Your browser ran out of space — remove a few images and try again.");
    }
  }, []);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setBusy(true);
    try {
      const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
      if (files.length === 0) {
        setError("Please choose image files (JPG, PNG, WEBP or GIF).");
        return;
      }
      const added: Upload[] = [];
      for (const file of files) {
        try {
          const src = await readAndCompress(file);
          added.push({ id: `${Date.now()}-${added.length}`, name: file.name.replace(/\.[^.]+$/, ""), src });
        } catch {
          setError(`Could not add ${file.name}.`);
        }
      }
      if (added.length > 0) persist([...added, ...uploads].slice(0, MAX_FILES));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (id: string) => persist(uploads.filter((u) => u.id !== id));

  const gallery: LightboxImage[] = uploads.map((u) => ({ src: u.src, alt: u.name, caption: u.name }));

  return (
    <section
      id="my-uploads"
      className="px-5 sm:px-8 md:px-10 py-20 sm:py-24 relative z-10"
      style={{ backgroundColor: "#0C0C0C" }}
    >
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading font-black uppercase leading-none tracking-tight text-center"
        style={{ fontSize: "clamp(2.4rem, 9vw, 120px)" }}
      >
        My Uploads
      </FadeIn>

      <p className="text-[#D7E2EA]/60 text-center max-w-xl mx-auto mt-5 text-sm sm:text-base">
        Add work straight from your gallery. Images stay saved in this browser and open full screen when clicked.
      </p>

      <div className="flex flex-col items-center gap-3 mt-8">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          aria-label="Upload project images from your gallery"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-3 rounded-full border-2 border-[#D7E2EA] px-7 py-3.5 uppercase tracking-widest text-xs sm:text-sm font-medium text-[#D7E2EA] transition-colors duration-300 hover:bg-[#D7E2EA] hover:text-[#0C0C0C] disabled:opacity-60"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          {busy ? "Adding…" : "Upload from gallery"}
        </button>
        {error && (
          <p role="alert" className="text-sm text-red-400 text-center">
            {error}
          </p>
        )}
        {uploads.length > 0 && (
          <p className="text-[#D7E2EA]/40 text-xs uppercase tracking-widest">
            {uploads.length} image{uploads.length === 1 ? "" : "s"} added
          </p>
        )}
      </div>

      {uploads.length > 0 && (
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence initial={false}>
            {uploads.map((u, i) => (
              <motion.div
                key={u.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3 }}
                className="relative group rounded-[28px] overflow-hidden border-2 border-[#D7E2EA]/30"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`Open ${u.name}`}
                  className="block w-full"
                >
                  <img
                    src={u.src}
                    alt={u.name}
                    className="w-full h-[180px] sm:h-[230px] object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => remove(u.id)}
                  aria-label={`Remove ${u.name}`}
                  className="absolute top-3 right-3 rounded-full bg-black/70 p-2 text-[#D7E2EA] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Lightbox images={gallery} index={openIndex} onClose={() => setOpenIndex(null)} onIndexChange={setOpenIndex} />
    </section>
  );
}
