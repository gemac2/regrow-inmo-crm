"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Building, Users, Calendar, CheckSquare, Settings, HelpCircle, LogOut, Clock,
  Mail, Share2 // <--- Importamos Share2 para Resales
} from "lucide-react";
import { logout } from "@/app/auth/logout/action"; 
import { getRecentlyViewed } from "@/app/dashboard/recent/actions";

// --- MENÚ PRINCIPAL ACTUALIZADO ---
const mainMenu = [
  { name: "Dashboard", href: "/dashboard", icon: Home, exact: true },
  { name: "Properties", href: "/dashboard/properties", icon: Building },
  { name: "Resales", href: "/dashboard/resales", icon: Share2 }, // <--- NUEVA OPCIÓN: RESALES
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Mailbox", href: "/dashboard/mailbox", icon: Mail },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
];

const systemMenu = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  // EFECTO: Cargar historial cada vez que cambiamos de ruta
  useEffect(() => {
    const fetchRecent = async () => {
      const items = await getRecentlyViewed();
      setRecentlyViewed(items);
    };
    
    // Pequeño delay para dar tiempo a que la página guarde el registro en DB primero
    const timer = setTimeout(() => {
        fetchRecent();
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  const isActive = (href: string, exact: boolean = false) => {
    if (!pathname) return false;
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const renderMenuItem = (item: any) => {
    const Icon = item.icon;
    const active = isActive(item.href, item.exact);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
          ${active ? "bg-[#0048BC] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
        `}
      >
        <Icon size={18} className={active ? "text-white" : "text-gray-400 group-hover:text-gray-600"} />
        {item.name}
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full sticky top-0 shrink-0 z-40">
      
      {/* HEADER */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
        <Link href="/dashboard" className="font-bold text-xl text-[#0048BC]">
          TheWay<span className="text-gray-400">.CRM</span>
        </Link>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        
        {/* MENU */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Menu</p>
          {mainMenu.map(renderMenuItem)}
        </div>

        {/* RECENTLY VIEWED DINÁMICO */}
        {recentlyViewed.length > 0 && (
          <div className="space-y-3 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 px-3 text-gray-400 mb-2">
              <Clock size={14} />
              <p className="text-xs font-bold uppercase tracking-wider">Recently Viewed</p>
            </div>
            
            <div className="space-y-1">
              {recentlyViewed.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 group transition-colors"
                >
                  <div className="text-sm font-medium text-gray-700 group-hover:text-[#0048BC] truncate">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.type === 'property' ? 'bg-blue-400' : 'bg-green-400'}`}></span>
                    {item.reference}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* SYSTEM */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">System</p>
          {systemMenu.map(renderMenuItem)}
          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={18} className="text-gray-400 group-hover:text-red-500" />
            Sign Out
          </button>
        </div>

      </div>
    </aside>
  );
}