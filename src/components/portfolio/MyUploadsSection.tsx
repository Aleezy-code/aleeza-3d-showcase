import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Loader2, Trash2, X, Check, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { FadeIn } from "./FadeIn";
import { supabase } from "@/integrations/supabase/client";
import {
  createProject,
  deleteProject,
  fetchUploadedProjects,
  formatBytes,
  validateFile,
  MAX_FILES_PER_PROJECT,
  PROJECT_CATEGORIES,
} from "@/lib/projects";

interface Selected {
  id: string;
  file: File;
  preview: string;
}

const inputClass =
  "w-full rounded-full border-2 border-[#D7E2EA]/40 bg-transparent px-5 py-3 text-[#D7E2EA] placeholder:text-[#D7E2EA]/35 uppercase tracking-widest text-xs sm:text-sm focus:outline-none focus:border-[#D7E2EA] transition-colors";

export function MyUploadsSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [selected, setSelected] = useState<Selected[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(PROJECT_CATEGORIES[0]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user ?? null);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Release object URLs when previews are replaced or the section unmounts.
  useEffect(() => () => selected.forEach((s) => URL.revokeObjectURL(s.preview)), [selected]);

  const projectsQuery = useQuery({
    queryKey: ["uploaded-projects"],
    queryFn: fetchUploadedProjects,
  });

  const uploadMutation = useMutation({
    mutationFn: createProject,
    onSuccess: async () => {
      selected.forEach((s) => URL.revokeObjectURL(s.preview));
      setSelected([]);
      setTitle("");
      setCategory(PROJECT_CATEGORIES[0]);
      setError(null);
      setSuccess(true);
      await queryClient.invalidateQueries({ queryKey: ["uploaded-projects"] });
      window.setTimeout(() => setSuccess(false), 4000);
    },
    onError: (err: Error) => setError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["uploaded-projects"] }),
    onError: (err: Error) => setError(err.message),
  });

  const totalSize = useMemo(() => selected.reduce((sum, s) => sum + s.file.size, 0), [selected]);

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setSuccess(false);
    const problems: string[] = [];
    const accepted: Selected[] = [];

    for (const file of Array.from(list)) {
      const problem = validateFile(file);
      if (problem) {
        problems.push(problem);
        continue;
      }
      if (selected.length + accepted.length >= MAX_FILES_PER_PROJECT) {
        problems.push(`Only ${MAX_FILES_PER_PROJECT} images per project — extra files were skipped.`);
        break;
      }
      accepted.push({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file) });
    }

    if (accepted.length > 0) setSelected((prev) => [...prev, ...accepted]);
    setError(problems.length > 0 ? problems.join(" ") : null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeSelected = (id: string) => {
    setSelected((prev) => {
      const match = prev.find((s) => s.id === id);
      if (match) URL.revokeObjectURL(match.preview);
      return prev.filter((s) => s.id !== id);
    });
  };

  const confirmUpload = () => {
    setError(null);
    uploadMutation.mutate({ title, category, files: selected.map((s) => s.file) });
  };

  const uploaded = projectsQuery.data ?? [];

  return (
    <section
      id="upload"
      className="px-5 sm:px-8 md:px-10 py-20 sm:py-24 relative z-10"
      style={{ backgroundColor: "#0C0C0C", fontFamily: "'Kanit', sans-serif" }}
    >
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading font-black uppercase leading-none tracking-tight text-center"
        style={{ fontSize: "clamp(2.4rem, 9vw, 120px)" }}
      >
        Upload
      </FadeIn>

      <p className="text-[#D7E2EA]/60 text-center max-w-xl mx-auto mt-5 text-sm sm:text-base font-light">
        Add work from your gallery, check the preview, then confirm — saved projects appear in the Projects section
        automatically.
      </p>

      {!authReady ? (
        <div className="flex justify-center mt-10">
          <Loader2 className="w-5 h-5 animate-spin text-[#D7E2EA]/60" />
        </div>
      ) : !user ? (
        <div className="mt-10 mx-auto max-w-md rounded-[32px] border-2 border-[#D7E2EA]/30 p-8 text-center">
          <Lock className="w-6 h-6 mx-auto text-[#D7E2EA]/70" />
          <p className="mt-4 text-[#D7E2EA] uppercase tracking-widest text-xs sm:text-sm">Sign in to upload</p>
          <p className="mt-2 text-[#D7E2EA]/50 text-sm font-light">
            Uploads are limited to the studio owner so nobody else can post to your portfolio.
          </p>
          <Link
            to="/auth"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] px-7 py-3 uppercase tracking-widest text-xs sm:text-sm font-medium text-[#D7E2EA] transition-colors duration-300 hover:bg-[#D7E2EA] hover:text-[#0C0C0C]"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <div className="mt-10 mx-auto max-w-4xl">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple
            className="sr-only"
            aria-label="Choose project images from your gallery"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-3 rounded-full border-2 border-[#D7E2EA] px-7 py-3.5 uppercase tracking-widest text-xs sm:text-sm font-medium text-[#D7E2EA] transition-colors duration-300 hover:bg-[#D7E2EA] hover:text-[#0C0C0C]"
            >
              <ImagePlus className="w-4 h-4" />
              Choose from gallery
            </button>
            <p className="text-[#D7E2EA]/40 text-[11px] uppercase tracking-widest">
              JPG, PNG, WEBP, GIF or AVIF · up to 8 MB each · {MAX_FILES_PER_PROJECT} images max
            </p>
          </div>

          <AnimatePresence>
            {selected.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.3 }}
                className="mt-10 rounded-[32px] border-2 border-[#D7E2EA]/30 p-5 sm:p-8"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[#D7E2EA] uppercase tracking-widest text-xs sm:text-sm">Preview before upload</h3>
                  <span className="text-[#D7E2EA]/40 text-[11px] uppercase tracking-widest">
                    {selected.length} image{selected.length === 1 ? "" : "s"} · {formatBytes(totalSize)}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selected.map((s) => (
                    <div key={s.id} className="relative rounded-[24px] overflow-hidden border border-[#D7E2EA]/25">
                      <img src={s.preview} alt={s.file.name} className="w-full h-[150px] sm:h-[180px] object-cover" />
                      <button
                        type="button"
                        onClick={() => removeSelected(s.id)}
                        aria-label={`Remove ${s.file.name}`}
                        className="absolute top-2 right-2 rounded-full bg-black/70 p-2 text-[#D7E2EA] hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#D7E2EA]/80 truncate">
                        {formatBytes(s.file.size)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={80}
                    placeholder="Project title"
                    aria-label="Project title"
                    className={inputClass}
                  />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label="Project category"
                    className={inputClass}
                  >
                    {PROJECT_CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#0C0C0C]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={confirmUpload}
                    disabled={uploadMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-full bg-[#D7E2EA] px-7 py-3 uppercase tracking-widest text-xs sm:text-sm font-medium text-[#0C0C0C] transition-opacity hover:opacity-85 disabled:opacity-60"
                  >
                    {uploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {uploadMutation.isPending ? "Uploading…" : "Confirm & upload"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      selected.forEach((s) => URL.revokeObjectURL(s.preview));
                      setSelected([]);
                      setError(null);
                    }}
                    disabled={uploadMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA]/50 px-7 py-3 uppercase tracking-widest text-xs sm:text-sm font-medium text-[#D7E2EA] transition-colors hover:border-[#D7E2EA] disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p role="alert" className="mt-6 text-center text-sm text-red-400 font-light">
              {error}
            </p>
          )}
          {success && (
            <p role="status" className="mt-6 text-center text-sm text-emerald-400 uppercase tracking-widest">
              Project saved — it is live in the Projects section.
            </p>
          )}

          {uploaded.length > 0 && (
            <div className="mt-14">
              <h3 className="text-[#D7E2EA] uppercase tracking-widest text-xs sm:text-sm text-center">Your uploads</h3>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {uploaded.map((p) => (
                  <div key={p.id} className="relative group rounded-[24px] overflow-hidden border-2 border-[#D7E2EA]/25">
                    {p.imageUrls[0] && (
                      <img src={p.imageUrls[0]} alt={p.title} className="w-full h-[160px] sm:h-[190px] object-cover" />
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/65 px-3 py-2 text-[10px] uppercase tracking-widest text-[#D7E2EA] truncate">
                      {p.title}
                    </span>
                    {p.userId === user.id && (
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(p.id)}
                        aria-label={`Delete ${p.title}`}
                        className="absolute top-3 right-3 rounded-full bg-black/70 p-2 text-[#D7E2EA] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
