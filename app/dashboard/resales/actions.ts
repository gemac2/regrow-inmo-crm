'use server';

import { createSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// 1. OBTENER PROPIEDADES (Lee de tu base de datos real)
export async function getResalesProperties() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from('network_properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}

// 2. IMPORTAR PROPIEDAD (MODO SIMULACIÓN / DEMO)
export async function importResaleProperty(reference: string) {
  const supabase = await createSupabaseServer();

  // A. Validación: ¿Ya la importaste antes?
  const { data: existing } = await supabase
    .from('network_properties')
    .select('id')
    .eq('external_ref', reference)
    .single();

  if (existing) {
    return { success: false, error: "Esta propiedad ya está importada." };
  }

  // B. GENERAR DATOS SIMULADOS (MOCK DATA)
  // Como no tenemos API Keys, inventamos los datos basados en la referencia
  // para que puedas probar la interfaz y el envío de correos.
  
  // Array de imágenes de prueba para que no sean todas iguales
  const demoImages = [
    "https://images.unsplash.com/photo-1600596542815-e328516da838?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  ];
  const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
  const randomPrice = Math.floor(Math.random() * 800000) + 150000; // Entre 150k y 950k

  const mockProperty = {
    external_ref: reference, // Usamos la que escribiste
    agency_name: "Resales Partner Agency", 
    title: `Beautiful Property ${reference} in Costa del Sol`, 
    price: randomPrice,
    location: "Marbella (Demo)",
    image_url: randomImage,
    bedrooms: Math.floor(Math.random() * 4) + 1, // 1 a 4 habs
    bathrooms: Math.floor(Math.random() * 3) + 1,
    built_area: Math.floor(Math.random() * 200) + 60,
    status: 'Available'
  };

  // C. GUARDAR EN SUPABASE (Como si viniera de la API real)
  const { error } = await supabase
    .from('network_properties')
    .insert(mockProperty);

  if (error) {
    console.error("Error guardando mock:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/resales");
  return { success: true };
}

// 3. ELIMINAR PROPIEDAD
export async function deleteResaleProperty(id: string) {
    const supabase = await createSupabaseServer();
    await supabase.from('network_properties').delete().eq('id', id);
    revalidatePath("/dashboard/resales");
}