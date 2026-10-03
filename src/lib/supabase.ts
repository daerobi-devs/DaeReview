import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://isattxrcciaviehfkzxf.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYXR0eHJjY2lhdmllaGZrenhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NzI0NjEsImV4cCI6MjEwNjU0ODQ2MX0.rXa0F3nNeJ3U9q8d1NjDrXXwyqpPdA3tWot_ibH_0FQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-Side Client with Service Role Privileges (Bypasses RLS for API & Webhooks)
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYXR0eHJjY2lhdmllaGZrenhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDk3MjQ2MSwiZXhwIjoyMTA2NTQ4NDYxfQ.IlzNZk0S2ZEtldkABjRwAvQMQt4e3SF0p49-kBkGQDM";

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
