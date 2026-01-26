"use server";

import { createSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getEvents() {
  const supabase = await createSupabaseServer();
  
  // Traemos el evento y los datos básicos de la propiedad/contacto relacionados
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      properties (title, reference),
      contacts (full_name)
    `)
    .order("start_time", { ascending: true });

  if (error) console.error(error);
  return data || [];
}

export async function createEvent(formData: any) {
  const supabase = await createSupabaseServer();
  
  const { error } = await supabase
    .from("events")
    .insert(formData);

  if (error) throw error;
  revalidatePath("/dashboard/calendar");
}

// Helpers para el formulario de creación
export async function getSelectOptions() {
  const supabase = await createSupabaseServer();
  const { data: properties } = await supabase.from("properties").select("id, title, reference");
  const { data: contacts } = await supabase.from("contacts").select("id, full_name");
  
  return { properties, contacts };
}