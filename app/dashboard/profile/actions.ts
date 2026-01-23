"use server";

import { createSupabaseServer } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createSupabaseServer();
  
  const fullName = formData.get("fullName") as string;
  const userId = formData.get("userId") as string;

  // 1. Actualizar Metadatos del Usuario (Nombre)
  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // 2. Opcional: Si tienes una tabla 'profiles' separada, actualízala aquí también.
  // Por ahora, asumimos que usas los metadatos de Auth de Supabase.

  revalidatePath("/dashboard/profile");
  return { success: true };
}