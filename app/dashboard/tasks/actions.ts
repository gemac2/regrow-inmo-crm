"use server";

import { createSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getTasks() {
  const supabase = await createSupabaseServer();
  
  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      properties (title, reference),
      contacts (full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) console.error(error);
  return data || [];
}

export async function createTask(formData: any) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.from("tasks").insert(formData);
  if (error) throw error;
  revalidatePath("/dashboard/tasks");
}

export async function updateTaskStatus(id: string, newStatus: string) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("tasks")
    .update({ status: newStatus })
    .eq("id", id);
    
  if (error) throw error;
  revalidatePath("/dashboard/tasks");
}

export async function deleteTask(id: string) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/dashboard/tasks");
}

// Helpers para el formulario (reutilizamos el del calendario si quieres, pero mejor tenerlo aquí)
export async function getSelectOptions() {
  const supabase = await createSupabaseServer();
  const { data: properties } = await supabase.from("properties").select("id, title, reference");
  const { data: contacts } = await supabase.from("contacts").select("id, full_name");
  return { properties, contacts };
}