"use server";

import { createSupabaseServer } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  // CORRECCIÓN: Agregamos 'await' aquí porque la función ahora es asíncrona
  const supabase = await createSupabaseServer();

  // Ahora sí puedes acceder a .auth
  await supabase.auth.signOut();

  // Limpieza manual (opcional, pero buena para asegurar)
  // Nota: En Next.js 15+ cookies() es asíncrono, así que lo guardamos en una variable
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");

  redirect("/auth/login");
}