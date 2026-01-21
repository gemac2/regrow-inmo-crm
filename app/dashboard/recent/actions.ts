"use server";

import { createSupabaseServer } from "@/lib/supabase";

// 1. LEER HISTORIAL (Para el Sidebar)
export async function getRecentlyViewed() {
  const supabase = await createSupabaseServer();
  
  // Traemos los últimos 5 registros, incluyendo los datos de la propiedad/contacto
  const { data } = await supabase
    .from("recently_viewed")
    .select(`
      id,
      viewed_at,
      property_id,
      contact_id,
      properties (id, title, reference),
      contacts (id, full_name, email)
    `)
    .order("viewed_at", { ascending: false })
    .limit(5);

  // Formateamos para que el Sidebar lo entienda fácil
  return data?.map((item: any) => {
    if (item.properties) {
      return {
        id: item.id,
        title: item.properties.title,
        reference: item.properties.reference,
        href: `/dashboard/properties/${item.properties.id}`,
        type: "property"
      };
    } else if (item.contacts) {
      return {
        id: item.id,
        title: item.contacts.full_name,
        reference: "Client", // O item.contacts.email
        href: `/dashboard/contacts/${item.contacts.id}`,
        type: "contact"
      };
    }
    return null;
  }).filter(Boolean) || [];
}

// 2. REGISTRAR VISITA (Para las páginas de detalle)
export async function addToHistory(data: { property_id?: string; contact_id?: string }) {
  const supabase = await createSupabaseServer();

  // A. Borramos si ya existe para que no se duplique y suba al tope
  if (data.property_id) {
    await supabase.from("recently_viewed").delete().eq("property_id", data.property_id);
  } else if (data.contact_id) {
    await supabase.from("recently_viewed").delete().eq("contact_id", data.contact_id);
  }

  // B. Insertamos el nuevo registro (quedará con fecha 'now()' y será el primero)
  await supabase.from("recently_viewed").insert(data);
}