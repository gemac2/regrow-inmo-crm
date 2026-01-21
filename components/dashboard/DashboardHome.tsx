"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building, 
  Users, 
  Euro, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  Activity,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function DashboardHome({ properties = [] }: { properties: any[] }) {
  
  // Calcular métricas reales basadas en tus datos
  const totalProperties = properties.length;
  const activeProperties = properties.filter(p => p.status === 'available').length;
  const totalValue = properties.reduce((acc, p) => acc + (p.price || 0), 0);
  
  // Datos simulados para "llenar" el diseño (mock data)
  // En el futuro, esto vendrá de tu tabla 'tasks' y 'activities'
  const recentActivities = [
    { id: 1, text: "New lead 'Juan Perez' added", time: "2 hours ago", type: "lead" },
    { id: 2, text: "Property 'Villa Mar' status changed to Reserved", time: "5 hours ago", type: "status" },
    { id: 3, text: "Viewing scheduled for 'Apartment Centro'", time: "Yesterday", type: "calendar" },
  ];

  const tasks = [
    { id: 1, title: "Call Maria about offer", due: "Today", priority: "high" },
    { id: 2, title: "Update photos for Ref-002", due: "Tomorrow", priority: "medium" },
    { id: 3, title: "Send contract to notary", due: "Fri", priority: "high" },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. KPI CARDS (Métricas Superiores) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Properties" 
          value={totalProperties} 
          icon={Building} 
          trend="+2 this month" 
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <KpiCard 
          title="Active Listings" 
          value={activeProperties} 
          icon={TrendingUp} 
          trend="85% of portfolio" 
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <KpiCard 
          title="Portfolio Value" 
          value={`${(totalValue / 1000000).toFixed(1)}M €`} 
          icon={Euro} 
          trend="Avg. 450k / prop" 
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
        <KpiCard 
          title="Pending Tasks" 
          value="12" 
          icon={Calendar} 
          trend="4 urgent" 
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      </div>

      {/* 2. MAIN CONTENT GRID (2 Columnas: Principal + Lateral) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA (2/3) - Listados y Actividad */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Latest Properties Table */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100">
              <CardTitle className="text-lg font-bold text-gray-800">Latest Properties</CardTitle>
              <Link href="/dashboard/properties" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                      <th className="px-4 py-3">Ref</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {properties.slice(0, 5).map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.reference || "-"}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{p.title}</td>
                        <td className="px-4 py-3 text-gray-600 font-medium">{p.price?.toLocaleString()} €</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                            ${p.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {properties.length === 0 && (
                      <tr><td colSpan={4} className="p-4 text-center text-gray-500">No properties yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2 border-b border-gray-100">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Activity size={18} className="text-gray-400" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex gap-3 items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
                    <div>
                      <p className="text-sm text-gray-800">{act.text}</p>
                      <p className="text-xs text-gray-400">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* COLUMNA DERECHA (1/3) - Tareas y Accesos */}
        <div className="space-y-6">
          
          {/* Tasks Widget */}
          <Card className="border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-2 border-b border-gray-100 bg-yellow-50/50">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-yellow-600" /> My Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <li key={task.id} className="p-4 flex items-start gap-3 hover:bg-gray-50 transition cursor-pointer group">
                    <input type="checkbox" className="mt-1 border-gray-300 rounded text-blue-600 focus:ring-blue-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition">{task.title}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 rounded">{task.due}</span>
                        {task.priority === 'high' && <span className="text-xs text-red-600 font-bold">! Urgent</span>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-3 border-t border-gray-100 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add Task</button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions / Contacts */}
          <div className="bg-gradient-to-br from-[#0048BC] to-[#003388] rounded-xl p-6 text-white shadow-lg">
            <h3 className="font-bold text-lg mb-2">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-4">Contact support or check our documentation for CRM updates.</p>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg py-2 text-sm font-medium transition">
              Open Documentation
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Subcomponente simple para las tarjetas de KPI
function KpiCard({ title, value, icon: Icon, trend, color, bgColor }: any) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && <p className="text-xs text-gray-400 mt-1">{trend}</p>}
      </div>
      <div className={`p-3 rounded-lg ${bgColor}`}>
        <Icon size={22} className={color} />
      </div>
    </div>
  );
}