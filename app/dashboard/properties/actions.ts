"use server";

import { createSupabaseServer } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// 1. OBTENER LISTA (CON FILTROS Y BÚSQUEDA)
export async function getProperties(searchParams?: { query?: string; status?: string }) {
  const supabase = await createSupabaseServer();
  
  // 1. Log para ver si llegan los parámetros
  console.log("🔍 Buscando propiedades con params:", searchParams);

  let queryBuilder = supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  // Filtro de Texto
  if (searchParams?.query) {
    const q = searchParams.query;
    queryBuilder = queryBuilder.or(`title.ilike.%${q}%,reference.ilike.%${q}%,city.ilike.%${q}%`);
  }

  // Filtro de Estado
  if (searchParams?.status && searchParams.status !== "all") {
    queryBuilder = queryBuilder.eq("status", searchParams.status);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error("❌ Error Supabase:", error.message);
    return [];
  }

  // 2. Log para ver cuántos registros devolvió la base de datos
  console.log(`✅ Resultados encontrados: ${data?.length || 0}`);

  return data || [];
}

// 2. OBTENER UNA PROPIEDAD
export async function getProperty(id: string) {
  const supabase = await createSupabaseServer(); // <--- CORREGIDO

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  // No lanzamos error aquí para manejar el 404 en la página
  if (error) return null;
  return data;
}

// 3. CREAR PROPIEDAD
export async function createProperty(form: any) {
  const supabase = await createSupabaseServer(); // <--- CORREGIDO

  const { data, error } = await supabase
    .from("properties")
    .insert(form)
    .select()
    .single();

  if (error) throw error;
  
  // Actualizamos la caché de la lista para que aparezca la nueva propiedad
  revalidatePath("/dashboard/properties");
  
  return data.id;
}

// 4. ACTUALIZAR PROPIEDAD
export async function updateProperty(id: string, form: any) {
  const supabase = await createSupabaseServer(); // <--- CORREGIDO

  const { data, error } = await supabase
    .from("properties")
    .update(form)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Actualizamos lista y detalle
  revalidatePath("/dashboard/properties");
  revalidatePath(`/dashboard/properties/${id}`);
  
  return data;
}

// 5. BORRAR PROPIEDAD
export async function deleteProperty(id: string) {
  const supabase = await createSupabaseServer(); // <--- CORREGIDO

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) throw error;
  
  revalidatePath("/dashboard/properties");
}

// 6. ACTUALIZAR IMÁGENES
export async function updatePropertyImages(id: string, images: any[]) {
  const supabase = await createSupabaseServer(); // <--- CORREGIDO

  const { data, error } = await supabase
    .from("properties")
    .update({ images })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  
  revalidatePath(`/dashboard/properties/${id}`);
  return data;
}