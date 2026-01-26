"use server";

import { createSupabaseServer } from "@/lib/supabase-server"; // USAR ESTE, NO EL BROWSER
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getContacts() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getContact(id: string) {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createContact(formData: any) {
  const supabase = await createSupabaseServer();
  
  // Limpieza básica de datos para evitar enviar strings vacíos donde no se debe, aunque Supabase suele manejarlos.
  const { data, error } = await supabase
    .from("contacts")
    .insert(formData)
    .select()
    .single();

  if (error) {
    console.error("Error creating contact:", error);
    throw new Error(error.message);
  }
  
  revalidatePath("/dashboard/contacts");
  return data.id;
}

export async function updateContact(id: string, formData: any) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("contacts")
    .update(formData)
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/dashboard/contacts");
  revalidatePath(`/dashboard/contacts/${id}`);
}

export async function deleteContact(id: string) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/dashboard/contacts");
}