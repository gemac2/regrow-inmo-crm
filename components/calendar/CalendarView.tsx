"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, 
  parseISO, setHours, setMinutes, getHours, addWeeks, subWeeks, addDays, subDays 
} from "date-fns";
import { 
  ChevronLeft, ChevronRight, Plus, MapPin, Clock, X, User, 
  Calendar as CalendarIcon, ExternalLink, Check, Trash2 
} from "lucide-react";
import { createEvent, deleteEvent } from "@/app/dashboard/calendar/actions";
import { toast } from "sonner";

// Colores disponibles para el selector
const COLORS = [
  { name: 'blue', hex: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  { name: 'green', hex: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  { name: 'red', hex: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  { name: 'purple', hex: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  { name: 'orange', hex: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
];

const createGoogleCalendarLink = (event: any) => {
  if(!event.start_time || !event.end_time) return "#";
  const formatDate = (dateString: string) => new Date(dateString).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.append("action", "TEMPLATE");
  url.searchParams.append("text", event.title);
  url.searchParams.append("dates", `${formatDate(event.start_time)}/${formatDate(event.end_time)}`);
  return url.toString();
};

export default function CalendarView({ events = [], properties = [], contacts = [] }: any) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month'); // Estado para vistas
  
  // Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Formulario Nuevo Evento
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "viewing",
    color: "blue", // Nuevo campo color
    start_time: "",
    end_time: "",
    property_id: "",
    contact_id: ""
  });

  // --- NAVEGACIÓN ---
  const handlePrev = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    if (view === 'day') setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    if (view === 'day') setCurrentDate(addDays(currentDate, 1));
  };

  // --- ABRIR MODAL NUEVO ---
  const handleDayClick = (day: Date, hour?: number) => {
    // Si viene hora (Vista Día), usala. Si no, default a las 09:00
    const startHour = hour !== undefined ? hour : 9;
    
    const start = setMinutes(setHours(day, startHour), 0);
    const end = setMinutes(setHours(day, startHour + 1), 0);

    const formatForInput = (d: Date) => format(d, "yyyy-MM-dd'T'HH:mm");

    setNewEvent({
      ...newEvent,
      start_time: formatForInput(start),
      end_time: formatForInput(end),
      color: "blue"
    });
    setIsAddModalOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  // --- GUARDAR ---
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

    const result = await createEvent(payload);
    setLoading(false);
    
    if (result.success) {
        setIsAddModalOpen(false);
        setNewEvent({ ...newEvent, title: "" });
        toast.success("Event saved");
    } else {
        toast.error("Error: " + result.error);
    }
  };

  const handleDelete = async (id: string) => {
      if(confirm("Are you sure?")) {
          await deleteEvent(id);
          setSelectedEvent(null);
          toast.success("Event deleted");
      }
  }

  // Helper de Estilos
  const getEventStyle = (evt: any) => {
    // Prioridad: Color manual > Color por tipo > Default
    if (evt.color && COLORS.some(c => c.name === evt.color)) {
        return COLORS.find(c => c.name === evt.color)?.hex;
    }
    // Fallback antiguo por si acaso
    switch (evt.type) {
      case 'viewing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'notary': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'call': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEventsForDay = (date: Date) => {
    return events.filter((e: any) => isSameDay(parseISO(e.start_time), date));
  };

  // --- RENDERIZADORES DE VISTAS ---

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 shrink-0">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 flex-1 overflow-hidden">
                {calendarDays.map((day) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const dayEvents = getEventsForDay(day);
                    return (
                        <div key={day.toString()} onClick={() => handleDayClick(day)} className={`border-r border-b border-gray-100 p-1 flex flex-col gap-1 transition-colors cursor-pointer ${!isCurrentMonth ? "bg-gray-50/50 text-gray-400" : "bg-white hover:bg-blue-50/20"} ${isSameDay(day, new Date()) ? "bg-blue-50/40" : ""}`}>
                            <div className="flex justify-between items-center px-1">
                                <span className={`text-xs font-medium ${isSameDay(day, new Date()) ? "text-[#0048BC] font-bold" : ""}`}>{format(day, "d")}</span>
                            </div>
                            <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[100px] scrollbar-hide">
                                {dayEvents.map((evt: any) => (
                                    <div key={evt.id} onClick={(e) => handleEventClick(e, evt)} className={`text-[10px] p-1 rounded border mb-0.5 truncate shadow-sm hover:opacity-80 transition cursor-pointer ${getEventStyle(evt)}`}>
                                        <div className="font-bold flex items-center gap-1"><Clock size={8} /> {format(parseISO(evt.start_time), "HH:mm")}</div>
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
  };

  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="flex-1 grid grid-cols-7 h-full overflow-hidden">
        {days.map((day, idx) => {
           const dayEvents = getEventsForDay(day);
           const isToday = isSameDay(day, new Date());
           return (
             <div key={idx} className="border-r border-gray-100 last:border-0 bg-white flex flex-col h-full overflow-hidden">
                <div className={`p-3 text-center border-b border-gray-100 shrink-0 ${isToday ? 'bg-blue-50' : ''}`}>
                   <div className="text-xs text-gray-500 uppercase">{format(day, 'EEE')}</div>
                   <div className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>{format(day, 'd')}</div>
                </div>
                <div className="flex-1 p-2 space-y-2 overflow-y-auto cursor-pointer hover:bg-gray-50/50" onClick={() => handleDayClick(day)}>
                   {dayEvents.map((evt: any) => (
                      <div key={evt.id} onClick={(e) => handleEventClick(e, evt)} className={`p-2 rounded border text-xs shadow-sm cursor-pointer hover:opacity-80 ${getEventStyle(evt)}`}>
                         <div className="font-bold">{format(parseISO(evt.start_time), "HH:mm")}</div>
                         <div className="truncate">{evt.title}</div>
                      </div>
                   ))}
                </div>
             </div>
           )
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDay(currentDate);
    const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 08:00 a 20:00

    return (
      <div className="flex-1 overflow-y-auto bg-white relative">
         {hours.map(hour => (
            <div key={hour} className="flex border-b border-gray-100 min-h-[80px] group">
               <div className="w-16 border-r border-gray-100 p-2 text-xs text-gray-400 text-right bg-gray-50 sticky left-0 font-mono">
                  {hour}:00
               </div>
               <div className="flex-1 relative p-1 group-hover:bg-gray-50 transition cursor-pointer" onClick={() => handleDayClick(currentDate, hour)}>
                  {dayEvents.filter((e: any) => getHours(parseISO(e.start_time)) === hour).map((evt: any) => (
                     <div key={evt.id} onClick={(e) => handleEventClick(e, evt)} className={`absolute top-1 left-2 right-2 bottom-1 p-2 rounded border text-sm flex justify-between items-center shadow-sm cursor-pointer hover:opacity-90 ${getEventStyle(evt)}`}>
                        <div className="flex gap-3 items-center">
                            <span className="font-bold bg-white/30 px-1 rounded">{format(parseISO(evt.start_time), 'HH:mm')}</span>
                            <span className="font-medium">{evt.title}</span>
                        </div>
                        {evt.contacts && <div className="text-xs flex items-center gap-1 opacity-80"><User size={12}/> {evt.contacts.full_name}</div>}
                     </div>
                  ))}
               </div>
            </div>
         ))}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-gray-200 gap-4 bg-white z-10">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800 capitalize min-w-[150px]">
                {format(currentDate, view === 'day' ? "MMMM d, yyyy" : "MMMM yyyy")}
            </h2>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button onClick={handlePrev} className="p-1 hover:bg-white rounded transition"><ChevronLeft size={18} /></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 text-xs font-medium hover:bg-white rounded transition">Today</button>
            <button onClick={handleNext} className="p-1 hover:bg-white rounded shadow-sm transition"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* View Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
             {(['month', 'week', 'day'] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition ${view === v ? 'bg-white shadow-sm text-[#0048BC]' : 'text-gray-500'}`}>
                   {v}
                </button>
             ))}
          </div>

          <button onClick={() => { handleDayClick(new Date()); }} className="flex items-center bg-[#0048BC] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#003895] transition shrink-0">
            <Plus className="mr-2 h-4 w-4" /> New Event
          </button>
        </div>
      </div>

      {/* BODY CALENDARIO */}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}

      {/* --- MODAL 1: NUEVO EVENTO --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b shrink-0">
              <h3 className="font-bold text-lg flex items-center gap-2"><CalendarIcon size={20} className="text-blue-600"/> New Event</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                <input required className="w-full border-b border-gray-300 py-2 focus:border-blue-500 outline-none font-medium text-gray-800" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="e.g. Viewing at Marbella..." autoFocus />
              </div>

              {/* Selector de Color */}
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Color Tag</label>
                 <div className="flex gap-3">
                    {COLORS.map((c) => (
                       <button type="button" key={c.name} onClick={() => setNewEvent({...newEvent, color: c.name})} className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${c.dot} ${newEvent.color === c.name ? 'ring-2 ring-offset-2 ring-gray-400' : 'opacity-70'}`}>
                          {newEvent.color === c.name && <Check size={14} className="text-white"/>}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-500 uppercase">Start</label><input type="datetime-local" required className="w-full border rounded p-2 mt-1 text-sm bg-gray-50" value={newEvent.start_time} onChange={e => setNewEvent({...newEvent, start_time: e.target.value})} /></div>
                <div><label className="text-xs font-bold text-gray-500 uppercase">End</label><input type="datetime-local" required className="w-full border rounded p-2 mt-1 text-sm bg-gray-50" value={newEvent.end_time} onChange={e => setNewEvent({...newEvent, end_time: e.target.value})} /></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                    <select className="w-full border rounded p-2 mt-1 text-sm bg-white" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
                      <option value="viewing">Viewing</option><option value="notary">Notary</option><option value="call">Call</option><option value="meeting">Meeting</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Property</label>
                    <select className="w-full border rounded p-2 mt-1 text-sm bg-white" onChange={e => setNewEvent({...newEvent, property_id: e.target.value})}>
                      <option value="none">-- None --</option>
                      {properties?.map((p: any) => <option key={p.id} value={p.id}>{p.reference}</option>)}
                    </select>
                  </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Contact</label>
                <select className="w-full border rounded p-2 mt-1 text-sm bg-white" onChange={e => setNewEvent({...newEvent, contact_id: e.target.value})}>
                  <option value="none">-- None --</option>
                  {contacts?.map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-[#0048BC] text-white rounded-lg text-sm font-medium hover:bg-[#003895] shadow-sm">{loading ? 'Saving...' : 'Save Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: VER DETALLES --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 overflow-hidden">
                <div className={`p-4 border-b flex justify-between items-start ${getEventStyle(selectedEvent)?.split(' ')[0]} bg-opacity-20`}>
                    <div>
                        <div className="flex gap-2 mb-2">
                             <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/60 border border-black/5">{selectedEvent.type}</span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900">{selectedEvent.title}</h3>
                    </div>
                    <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:bg-white/50 p-1 rounded-full"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="flex items-start gap-3">
                        <Clock className="text-gray-400 mt-0.5" size={20} />
                        <div>
                            <p className="font-medium text-gray-900">{format(parseISO(selectedEvent.start_time), "EEEE, d MMMM")}</p>
                            <p className="text-gray-500">{format(parseISO(selectedEvent.start_time), "HH:mm")} - {format(parseISO(selectedEvent.end_time), "HH:mm")}</p>
                        </div>
                    </div>

                    {selectedEvent.properties && (
                        <div className="flex items-start gap-3">
                            <MapPin className="text-gray-400 mt-0.5" size={20} />
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Property</p>
                                <Link href={`/dashboard/properties/${selectedEvent.property_id}`} className="text-[#0048BC] font-medium hover:underline flex items-center gap-1">
                                    {selectedEvent.properties.reference} <ExternalLink size={12} />
                                </Link>
                                <p className="text-sm text-gray-600 truncate max-w-[250px]">{selectedEvent.properties.title}</p>
                            </div>
                        </div>
                    )}

                    {selectedEvent.contacts && (
                        <div className="flex items-start gap-3">
                            <User className="text-gray-400 mt-0.5" size={20} />
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Client</p>
                                <Link href={`/dashboard/contacts/${selectedEvent.contact_id}`} className="text-[#0048BC] font-medium hover:underline flex items-center gap-1">
                                    {selectedEvent.contacts.full_name} <ExternalLink size={12} />
                                </Link>
                            </div>
                        </div>
                    )}
                    
                    <div className="pt-4 border-t flex gap-2">
                         <a href={createGoogleCalendarLink(selectedEvent)} target="_blank" className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                            <CalendarIcon size={16} /> Add to Google
                        </a>
                        <button onClick={() => handleDelete(selectedEvent.id)} className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}