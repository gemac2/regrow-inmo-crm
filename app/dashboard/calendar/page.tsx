import { getEvents, getSelectOptions } from "@/app/dashboard/calendar/actions";
import CalendarView from "@/components/calendar/CalendarView";

export const dynamic = "force-dynamic"; // Para asegurar que no cachee datos viejos

export default async function CalendarPage() {
  const events = await getEvents();
  const { properties, contacts } = await getSelectOptions();

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-500 mt-1">Manage viewings and appointments.</p>
        </div>
      </div>

      {/* Renderizamos el cliente pasándole los datos iniciales */}
      <CalendarView 
        events={events || []} 
        properties={properties || []}
        contacts={contacts || []}
      />
    </div>
  );
}