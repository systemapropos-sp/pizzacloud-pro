import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
const bucketName = import.meta.env.VITE_SUPABASE_BUCKET ?? "pizzacloud";

export const supabase = createClient(supabaseUrl, supabaseKey);
export const BUCKET_NAME = bucketName;

export async function uploadImage(file: File, path: string) {
  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(path, file);
  if (error) throw error;
  return supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path).data.publicUrl;
}

export function getPublicUrl(path: string) {
  return supabase.storage.from(BUCKET_NAME).getPublicUrl(path).data.publicUrl;
}
