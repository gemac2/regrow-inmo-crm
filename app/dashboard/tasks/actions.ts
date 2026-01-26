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

export async function updateTask(taskId: string, formData: FormData) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const title = formData.get("title") as string;
  const priority = formData.get("priority") as string;
  const due_date = formData.get("due_date") as string;
  const property_id = formData.get("property_id") as string;
  
  // Objeto con los cambios
  const updates: any = {
    title,
    priority,
    due_date: due_date ? new Date(due_date).toISOString() : null,
    updated_at: new Date().toISOString()
  };

  // Solo actualizamos la propiedad si el usuario seleccionó una diferente (o "none")
  if (property_id && property_id !== "none") {
    updates.property_id = property_id;
  } else if (property_id === "none") {
    updates.property_id = null;
  }

  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .eq('agent_id', user.id); // Seguridad: solo edita si es tuya

  if (error) {
    console.error("Error updating task:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/tasks");
  return { success: true };
}