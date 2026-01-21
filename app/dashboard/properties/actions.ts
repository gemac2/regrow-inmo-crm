"use server";

import { supabaseBrowser } from "@/lib/supabase";

export async function getProperties() {
  const { data, error } = await supabaseBrowser
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProperty(id: string) {
  const { data, error } = await supabaseBrowser
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createProperty(form: any) {
  const { data, error } = await supabaseBrowser
    .from("properties")
    .insert(form)
    .select()
    .single();

  if (error) throw error;
  return data.id; // return the ID value
}


export async function updateProperty(id: string, form: any) {
  const { data, error } = await supabaseBrowser
    .from("properties")
    .update(form)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProperty(id: string) {
  const { error } = await supabaseBrowser
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updatePropertyImages(id: string, images: any[]) {
  const { data, error } = await supabaseBrowser
    .from("properties")
    .update({ images })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
