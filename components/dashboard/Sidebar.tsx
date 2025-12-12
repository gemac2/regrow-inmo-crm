"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import { Home, Building } from "lucide-react";

const menu = [
  { name: "Dashboard", key: "dashboard", icon: Home },
  { name: "Properties", key: "properties", icon: Building },
];

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  // Marcar Properties como activo si estamos en properties, new, details o edit
  const isPropertiesActive = activeView === "properties" || 
                            activeView === "new" || 
                            activeView === "details" || 
                            activeView === "edit";
  
  // No mostrar el sidebar en la vista de perfil desde aquí, se maneja desde el header

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* NAVIGATION */}
      <nav className="flex-1 p-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = item.key === "properties" 
            ? isPropertiesActive 
            : activeView === item.key;
          return (
            <button
              onClick={() => onViewChange(item.key)}
              key={item.name}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition 
                ${active ? "bg-[#0048BC] text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              <Icon size={18} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-gray-200">
        <LogoutButton />
      </div>
    </aside>
  );
}
