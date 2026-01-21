"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, setHours, setMinutes 
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, X, User, Calendar as CalendarIcon, ExternalLink } from "lucide-react";
import { createEvent } from "@/app/dashboard/calendar/actions";

// Helper para generar link de Google Calendar (Lo dejamos aquí por si quieres usarlo manualmente)
const createGoogleCalendarLink = (event: any) => {
  const formatDate = (dateString: string) => new Date(dateString).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.append("action", "TEMPLATE");
  url.searchParams.append("text", event.title);
  url.searchParams.append("dates", `${formatDate(event.start_time)}/${formatDate(event.end_time)}`);
  return url.toString();
};

export default function CalendarView({ events, properties, contacts }: any) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // ESTADOS DE MODALES
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // Para ver detalles
  const [loading, setLoading] = useState(false);

  // Grilla del calendario
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Estado del formulario nuevo evento
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "viewing",
    start_time: "",
    end_time: "",
    property_id: "",
    contact_id: ""
  });

  // --- FUNCIÓN 1: Click en un DÍA (Abrir modal pre-llenado) ---
  const handleDayClick = (day: Date) => {
    // Configuramos por defecto el evento a las 09:00 AM del día clickeado
    const start = setMinutes(setHours(day, 9), 0);
    const end = setMinutes(setHours(day, 10), 0);

    // Formato para input datetime-local: YYYY-MM-DDTHH:mm
    const formatForInput = (d: Date) => format(d, "yyyy-MM-dd'T'HH:mm");

    setNewEvent({
      ...newEvent,
      start_time: formatForInput(start),
      end_time: formatForInput(end),
    });
    setIsAddModalOpen(true);
  };

  // --- FUNCIÓN 2: Click en un EVENTO (Ver detalles) ---
  const handleEventClick = (e: React.MouseEvent, event: any) => {
    e.stopPropagation(); // IMPORTANTE: Evita que el click pase al "Día" y abra el otro modal
    setSelectedEvent(event);
  };

  // Guardar evento nuevo
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
        ...newEvent,
        start_time: new Date(newEvent.start_time).toISOString(),
        end_time: new Date(newEvent.end_time).toISOString(),
        property_id: (!newEvent.property_id || newEvent.property_id === "none") ? null : newEvent.property_id,
        contact_id: (!newEvent.contact_id || newEvent.contact_id === "none") ? null : newEvent.contact_id
    };

    await createEvent(payload);
    setLoading(false);
    setIsAddModalOpen(false);
    // Limpiar form
    setNewEvent({ ...newEvent, title: "" });
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'viewing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'notary': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'call': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm relative">
      
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800 capitalize">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1 hover:bg-white rounded transition"><ChevronLeft size={18} /></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 text-xs font-medium hover:bg-white rounded transition">Today</button>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1 hover:bg-white rounded shadow-sm transition"><ChevronRight size={18} /></button>
          </div>
        </div>
        <button 
          onClick={() => { setIsAddModalOpen(true); handleDayClick(new Date()); }} // Default a hoy
          className="flex items-center bg-[#0048BC] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#003895] transition"
        >
          <Plus className="mr-2 h-4 w-4" /> New Event
        </button>
      </div>

      {/* --- MODAL 1: NUEVO EVENTO --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">New Event</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-4">
              {/* Inputs igual que antes... */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required className="w-full border rounded-lg p-2 text-sm" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Meeting..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium">Start</label><input type="datetime-local" required className="w-full border rounded p-2 text-sm" value={newEvent.start_time} onChange={e => setNewEvent({...newEvent, start_time: e.target.value})} /></div>
                <div><label className="text-sm font-medium">End</label><input type="datetime-local" required className="w-full border rounded p-2 text-sm" value={newEvent.end_time} onChange={e => setNewEvent({...newEvent, end_time: e.target.value})} /></div>
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <select className="w-full border rounded p-2 text-sm bg-white" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
                  <option value="viewing">Viewing</option><option value="notary">Notary</option><option value="call">Call</option><option value="meeting">Meeting</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Property</label>
                <select className="w-full border rounded p-2 text-sm bg-white" onChange={e => setNewEvent({...newEvent, property_id: e.target.value})}>
                  <option value="none">-- None --</option>
                  {properties?.map((p: any) => <option key={p.id} value={p.id}>{p.reference} - {p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Contact</label>
                <select className="w-full border rounded p-2 text-sm bg-white" onChange={e => setNewEvent({...newEvent, contact_id: e.target.value})}>
                  <option value="none">-- None --</option>
                  {contacts?.map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-[#0048BC] text-white rounded-lg text-sm hover:bg-[#003895]">{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: VER DETALLES DEL EVENTO --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200 overflow-hidden">
                {/* Header con color según tipo */}
                <div className={`p-4 border-b flex justify-between items-start ${getEventColor(selectedEvent.type).replace('text-', 'bg-opacity-10 ')}`}>
                    <div>
                        <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/50 border border-black/5`}>
                            {selectedEvent.type}
                        </span>
                        <h3 className="font-bold text-xl text-gray-900 mt-2">{selectedEvent.title}</h3>
                    </div>
                    <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:bg-white/50 p-1 rounded-full"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Hora */}
                    <div className="flex items-start gap-3">
                        <Clock className="text-gray-400 mt-0.5" size={20} />
                        <div>
                            <p className="font-medium text-gray-900">
                                {format(parseISO(selectedEvent.start_time), "EEEE, d MMMM")}
                            </p>
                            <p className="text-gray-500">
                                {format(parseISO(selectedEvent.start_time), "HH:mm")} - {format(parseISO(selectedEvent.end_time), "HH:mm")}
                            </p>
                        </div>
                    </div>

                    {/* Propiedad Relacionada */}
                    {selectedEvent.properties && (
                        <div className="flex items-start gap-3">
                            <MapPin className="text-gray-400 mt-0.5" size={20} />
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Property</p>
                                <Link href={`/dashboard/properties/${selectedEvent.property_id}`} className="text-[#0048BC] font-medium hover:underline flex items-center gap-1">
                                    {selectedEvent.properties.reference} 
                                    <ExternalLink size={12} />
                                </Link>
                                <p className="text-sm text-gray-600 truncate max-w-[250px]">{selectedEvent.properties.title}</p>
                            </div>
                        </div>
                    )}

                    {/* Contacto Relacionado */}
                    {selectedEvent.contacts && (
                        <div className="flex items-start gap-3">
                            <User className="text-gray-400 mt-0.5" size={20} />
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Client</p>
                                <Link href={`/dashboard/contacts/${selectedEvent.contact_id}`} className="text-[#0048BC] font-medium hover:underline flex items-center gap-1">
                                    {selectedEvent.contacts.full_name}
                                    <ExternalLink size={12} />
                                </Link>
                            </div>
                        </div>
                    )}
                    
                    {/* Botón Google Calendar Manual */}
                    <div className="pt-4 border-t">
                        <a 
                            href={createGoogleCalendarLink(selectedEvent)}
                            target="_blank"
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            <CalendarIcon size={16} /> Add to Google Calendar
                        </a>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- GRID CALENDARIO --- */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 grid-rows-5 flex-1 overflow-hidden">
        {calendarDays.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const dayEvents = events.filter((e: any) => isSameDay(parseISO(e.start_time), day));

            return (
                <div 
                    key={day.toString()} 
                    onClick={() => handleDayClick(day)} // AQUI: Click en la celda -> Abre Modal Nuevo
                    className={`
                        border-r border-b border-gray-100 p-1 flex flex-col gap-1 transition-colors cursor-pointer
                        ${!isCurrentMonth ? "bg-gray-50/50 text-gray-400" : "bg-white hover:bg-blue-50/20"}
                        ${isSameDay(day, new Date()) ? "bg-blue-50/40" : ""}
                    `}
                >
                    <div className="flex justify-between items-center px-1">
                        <span className={`text-xs font-medium ${isSameDay(day, new Date()) ? "text-[#0048BC] font-bold" : ""}`}>
                            {format(day, "d")}
                        </span>
                    </div>
                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[100px] scrollbar-hide">
                        {dayEvents.map((evt: any) => (
                            <div 
                                key={evt.id} 
                                onClick={(e) => handleEventClick(e, evt)} // AQUI: Click en evento -> Abre Detalles
                                className={`text-[10px] p-1 rounded border mb-0.5 truncate shadow-sm hover:opacity-80 transition ${getEventColor(evt.type)}`}
                            >
                                <div className="font-bold flex items-center gap-1">
                                    <Clock size={8} /> {format(parseISO(evt.start_time), "HH:mm")}
                                </div>
                                <div className="truncate font-medium">{evt.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}