import { getEvents, getPropertiesList, getContactsList } from "./actions";
import CalendarClient from "@/components/calendar/CalendarView"; // <--- Importamos el componente visual que creaste en el Paso 1

// Esta página es un SERVER COMPONENT (sin 'use client')
export default async function CalendarPage() {
  // 1. Buscamos todos los datos en paralelo para que sea rápido
  const [events, properties, contacts] = await Promise.all([
    getEvents(),
    getPropertiesList(),
    getContactsList()
  ]);

  // 2. Se los pasamos al cliente
  return (
    <div className="h-full w-full">
      <CalendarClient 
        events={events || []} 
        properties={properties || []} 
        contacts={contacts || []} 
      />
    </div>
  );
}