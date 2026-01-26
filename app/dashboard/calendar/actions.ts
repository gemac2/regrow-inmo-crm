'use server';

import { createSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// Definimos el tipo de datos que esperamos recibir del frontend
interface CreateEventParams {
  title: string;
  type: string;
  color: string;
  start_time: string; // ISO String
  end_time: string;   // ISO String
  property_id?: string | null;
  contact_id?: string | null;
}

export async function getEvents() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      properties (id, reference, title),
      contacts (id, full_name, email)
    `) // Traemos las relaciones para mostrar nombres en el calendario
    .order('start_time', { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }
  return data;
}

// CAMBIO PRINCIPAL: Ahora recibimos un objeto, no FormData
export async function createEvent(params: CreateEventParams) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  // Validamos que vengan las fechas
  if (!params.start_time || !params.end_time) {
    return { success: false, error: "Start and End time are required" };
  }

  const { error } = await supabase.from('events').insert({
    agent_id: user.id,
    title: params.title,
    start_time: params.start_time,
    end_time: params.end_time,
    color: params.color || 'blue',
    type: params.type || 'viewing',
    all_day: false,
    // Manejo seguro de nulos (si viene "none" o null, guardamos null)
    property_id: params.property_id === "none" ? null : params.property_id,
    contact_id: params.contact_id === "none" ? null : params.contact_id
  });

  if (error) {
    console.error("Error creating event:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/calendar");
  return { success: true };
}

export async function deleteEvent(id: string) {
    const supabase = await createSupabaseServer();
    await supabase.from('events').delete().eq('id', id);
    revalidatePath("/dashboard/calendar");
}

// ... (Tus funciones createEvent, getEvents, deleteEvent ya existen, déjalas igual)

// AGREGAR ESTAS NUEVAS AL FINAL DEL ARCHIVO:

export async function getPropertiesList() {
  const supabase = await createSupabaseServer();
  // Traemos solo lo necesario para el select
  const { data } = await supabase.from('properties').select('id, reference, title').limit(50);
  return data || [];
}

export async function getContactsList() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.from('contacts').select('id, full_name').limit(50);
  return data || [];
}