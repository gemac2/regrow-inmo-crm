"use server";

import { createSupabaseServer } from "@/lib/supabase-server";

export async function getDashboardStats() {
  const supabase = await createSupabaseServer();
  const todayISO = new Date().toISOString();

  // Ejecutamos varias consultas en paralelo para que sea rápido
  const [
    { count: propertiesCount },
    { count: contactsCount },
    { count: tasksCount },
    { data: upcomingEvents },
    { data: latestProperties }
  ] = await Promise.all([
    // 1. Total Propiedades Disponibles
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "available"),
    
    // 2. Total Contactos
    supabase.from("contacts").select("*", { count: "exact", head: true }),
    
    // 3. Tareas Pendientes (Todo + In Progress)
    supabase.from("tasks").select("*", { count: "exact", head: true }).neq("status", "done"),

    // 4. Próximos 5 Eventos (Desde hoy en adelante)
    supabase
      .from("events")
      .select(`
        *,
        properties (reference),
        contacts (full_name)
      `)
      .gte("start_time", todayISO)
      .order("start_time", { ascending: true })
      .limit(5),

    // 5. Últimas 5 Propiedades Agregadas
    supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  return {
    stats: {
      properties: propertiesCount || 0,
      contacts: contactsCount || 0,
      tasks: tasksCount || 0,
    },
    upcomingEvents: upcomingEvents || [],
    latestProperties: latestProperties || []
  };
}