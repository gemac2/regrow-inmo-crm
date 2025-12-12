import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const access_token = url.searchParams.get("access_token");
  const refresh_token = url.searchParams.get("refresh_token");

  if (!access_token || !refresh_token) {
    return NextResponse.redirect("http://localhost:3000/auth/login");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  // store tokens in cookies (optional)
  (await cookies()).set("sb-access-token", access_token);
  (await cookies()).set("sb-refresh-token", refresh_token);

  return NextResponse.redirect("http://localhost:3000/dashboard");
}
