"use client";

import Link from "next/link";
import { 
  Building, Users, CheckSquare, Calendar as CalendarIcon, 
  ArrowRight, MapPin, Clock, TrendingUp 
} from "lucide-react";
import { format, parseISO, isToday } from "date-fns";

// Componente para las Tarjetas de KPI
const StatCard = ({ title, value, icon: Icon, color, link }: any) => (
  <Link href={link} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <span className="text-gray-400 group-hover:text-[#0048BC] transition-colors">
        <ArrowRight size={18} />
      </span>
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm text-gray-500 font-medium">{title}</p>
  </Link>
);

export default function DashboardHome({ data }: { data: any }) {
  const { stats, upcomingEvents, latestProperties } = data;

  return (
    <div className="space-y-6">
      
      {/* --- 1. KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Properties" 
          value={stats.properties} 
          icon={Building} 
          color="bg-blue-500" 
          link="/dashboard/properties"
        />
        <StatCard 
          title="Total Clients" 
          value={stats.contacts} 
          icon={Users} 
          color="bg-green-500" 
          link="/dashboard/contacts"
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.tasks} 
          icon={CheckSquare} 
          color="bg-orange-500" 
          link="/dashboard/tasks"
        />
      </div>

      {/* --- 2. MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: AGENDA (2/3 ancho) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <CalendarIcon size={18} className="text-[#0048BC]" />
                Upcoming Schedule
              </h3>
              <Link href="/dashboard/calendar" className="text-xs font-medium text-blue-600 hover:underline">
                View Calendar
              </Link>
            </div>
            
            <div className="divide-y divide-gray-100">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((evt: any) => (
                  <div key={evt.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition">
                    {/* Fecha Caja */}
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 shrink-0">
                      <span className="text-xs font-bold uppercase">{format(parseISO(evt.start_time), "MMM")}</span>
                      <span className="text-lg font-bold">{format(parseISO(evt.start_time), "dd")}</span>
                    </div>

                    {/* Info Evento */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-900 truncate">{evt.title}</h4>
                        {isToday(parseISO(evt.start_time)) && (
                            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Today</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> 
                          {format(parseISO(evt.start_time), "HH:mm")}
                        </span>
                        {evt.properties && (
                          <span className="flex items-center gap-1 truncate text-blue-600">
                             • {evt.properties.reference}
                          </span>
                        )}
                        {evt.contacts && (
                           <span className="truncate">
                             • {evt.contacts.full_name}
                           </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <p>No upcoming events.</p>
                  <Link href="/dashboard/calendar" className="text-blue-600 text-sm hover:underline mt-1 block">Schedule a viewing</Link>
                </div>
              )}
            </div>
          </div>

          {/* Newest Properties */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-600" />
                Newest Inventory
              </h3>
              <Link href="/dashboard/properties" className="text-xs font-medium text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                {latestProperties.map((prop: any) => (
                    <Link key={prop.id} href={`/dashboard/properties/${prop.id}`} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition group">
                        <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden shrink-0">
                            {prop.images?.[0] ? (
                                <img src={prop.images[0]} className="w-full h-full object-cover" alt="prop" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400"><Building size={20} /></div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-blue-600 mb-0.5">{prop.reference}</p>
                            <h4 className="font-medium text-gray-900 text-sm truncate">{prop.title}</h4>
                            <p className="text-xs text-gray-500 truncate">{prop.city} • {Number(prop.price).toLocaleString()} €</p>
                        </div>
                    </Link>
                ))}
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: SIDEBAR (1/3 ancho) */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#0048BC] rounded-xl shadow-lg p-6 text-white">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
                <Link href="/dashboard/properties/new" className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition backdrop-blur-sm cursor-pointer">
                    <span className="text-sm font-medium">Add Property</span>
                    <ArrowRight size={16} />
                </Link>
                <Link href="/dashboard/contacts/new" className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition backdrop-blur-sm cursor-pointer">
                    <span className="text-sm font-medium">Create Contact</span>
                    <ArrowRight size={16} />
                </Link>
                <Link href="/dashboard/calendar" className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition backdrop-blur-sm cursor-pointer">
                    <span className="text-sm font-medium">Schedule Viewing</span>
                    <ArrowRight size={16} />
                </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}