import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://isattxrcciaviehfkzxf.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYXR0eHJjY2lhdmllaGZrenhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NzI0NjEsImV4cCI6MjEwNjU0ODQ2MX0.rXa0F3nNeJ3U9q8d1NjDrXXwyqpPdA3tWot_ibH_0FQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
