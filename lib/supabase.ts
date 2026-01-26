// ARCHIVO: lib/supabase.ts
import { createBrowserClient } from "@supabase/ssr";

// Cliente para componentes visuales (Header, Login, etc.)
export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);