import { createClient } from "@supabase/supabase-js";

export const createSupabaseServer = (access_token?: string, refresh_token?: string) =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: access_token ? `Bearer ${access_token}` : "",
        },
      },
    }
  );

export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
