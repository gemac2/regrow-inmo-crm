import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );

  // obtener la sesión del request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // PROTEGER RUTAS
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/properties/:path*"],
};
