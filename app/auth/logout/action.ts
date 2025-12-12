"use server";

import { createSupabaseServer } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = createSupabaseServer();

  await supabase.auth.signOut();

  (await cookies()).delete("sb-access-token");
  (await cookies()).delete("sb-refresh-token");

  redirect("/auth/login");
}
