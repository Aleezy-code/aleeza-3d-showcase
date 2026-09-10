import { supabase } from "@/integrations/supabase/client";

export const PROJECT_BUCKET = "project-images";
export const MAX_FILE_BYTES = 8 * 1024 * 1024;
export const MAX_FILES_PER_PROJECT = 6;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"] as const;
export const PROJECT_CATEGORIES = ["Personal", "Client", "Concept"] as const;

export interface UploadedProject {
  id: string;
  title: string;
  category: string;
  imageUrls: string[];
  createdAt: string;
  userId: string;
}

/** Human-readable reason a file is rejected, or null when it is acceptable. */
export function validateFile(file: File): string | null {
  if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
    return `${file.name}: only JPG, PNG, WEBP, GIF or AVIF images are allowed.`;
  }
  if (file.size > MAX_FILE_BYTES) {
    return `${file.name}: image is larger than 8 MB.`;
  }
  if (file.size === 0) {
    return `${file.name}: file is empty.`;
  }
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return file.type.split("/")[1] ?? "jpg";
}

/** Turn stored storage paths into temporary viewable links. */
async function signPaths(paths: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (paths.length === 0) return map;
  const { data, error } = await supabase.storage.from(PROJECT_BUCKET).createSignedUrls(paths, 60 * 60);
  if (error || !data) return map;
  for (const item of data) {
    if (item.signedUrl && item.path) map.set(item.path, item.signedUrl);
  }
  return map;
}

export async function fetchUploadedProjects(): Promise<UploadedProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, category, image_urls, created_at, user_id")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const signed = await signPaths(rows.flatMap((r) => r.image_urls ?? []));

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    createdAt: r.created_at,
    userId: r.user_id,
    imageUrls: (r.image_urls ?? []).map((p) => signed.get(p) ?? p).filter(Boolean),
  }));
}

export interface CreateProjectInput {
  title: string;
  category: string;
  files: File[];
}

export async function createProject({ title, category, files }: CreateProjectInput): Promise<void> {
  const trimmed = title.trim();
  if (trimmed.length === 0) throw new Error("Please add a project title.");
  if (trimmed.length > 80) throw new Error("Title must be 80 characters or fewer.");
  if (files.length === 0) throw new Error("Please choose at least one image.");
  if (files.length > MAX_FILES_PER_PROJECT) throw new Error(`You can upload up to ${MAX_FILES_PER_PROJECT} images per project.`);
  for (const file of files) {
    const problem = validateFile(file);
    if (problem) throw new Error(problem);
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData?.user;
  if (userError || !user) throw new Error("Please sign in before uploading a project.");

  const uploadedPaths: string[] = [];
  try {
    for (const file of files) {
      const path = `${user.id}/${crypto.randomUUID()}.${extensionFor(file)}`;
      const { error } = await supabase.storage.from(PROJECT_BUCKET).upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) throw new Error(error.message);
      uploadedPaths.push(path);
    }

    const { error: insertError } = await supabase.from("projects").insert({
      user_id: user.id,
      title: trimmed,
      category,
      image_urls: uploadedPaths,
    });
    if (insertError) throw new Error(insertError.message);
  } catch (err) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(PROJECT_BUCKET).remove(uploadedPaths);
    }
    throw err;
  }
}

export async function deleteProject(id: string): Promise<void> {
  const { data } = await supabase.from("projects").select("image_urls").eq("id", id).maybeSingle();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  const paths = data?.image_urls ?? [];
  if (paths.length > 0) await supabase.storage.from(PROJECT_BUCKET).remove(paths);
}
