"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import { User, Settings, LogOut, Bell } from "lucide-react";

interface HeaderProps {
  onProfileClick?: () => void;
}

export default function Header({ onProfileClick }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadUser();
    
    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabaseBrowser.auth.getUser();
    setUser(user);
  };

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut();
    router.push("/auth/login");
    window.location.href = "/auth/login";
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    if (onProfileClick) {
      onProfileClick();
    } else {
      router.push("/dashboard/profile");
    }
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="h-16 bg-gradient-to-r from-[#0048BC] to-[#0066FF] border-b border-[#003A99] shadow-md flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Regrow CRM</h1>
      </div>

      {/* Right side - Notifications and Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon (placeholder) */}
        <button className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition">
          <Bell size={20} />
          {/* Badge de notificaciones (opcional) */}
          {/* <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span> */}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition"
          >
            <div className="w-10 h-10 rounded-full bg-white text-[#0048BC] flex items-center justify-center font-semibold shadow-sm">
              {getUserInitials()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">
                {user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-xs text-white/80">{user?.email || ""}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email?.split("@")[0] || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                </div>
                
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  <User size={16} />
                  My profile
                </button>
                
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  <Settings size={16} />
                  settings
                </button>
                
                <div className="border-t border-gray-200 my-1"></div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
