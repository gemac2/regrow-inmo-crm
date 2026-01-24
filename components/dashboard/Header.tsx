"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import { User, Settings, LogOut, Bell } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface HeaderProps {
  onProfileClick?: () => void;
}

export default function Header({ onProfileClick }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null); // Estado para el perfil (foto/nombre)
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadUserAndProfile();

    // Escuchar cambios en la autenticación (Login/Logout)
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Si cambia la sesión, recargamos el perfil también
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabaseBrowser
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (data) setProfile(data);
  };

  const loadUserAndProfile = async () => {
    const { data: { user } } = await supabaseBrowser.auth.getUser();
    if (user) {
      setUser(user);
      await fetchProfile(user.id);
    }
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

  // Obtener iniciales (Prioridad: Nombre del perfil > Email)
  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Obtener nombre para mostrar
  const getDisplayName = () => {
    return profile?.full_name || user?.email?.split("@")[0] || "User";
  };

  return (
    <header className="h-16 bg-gradient-to-r from-[#0048BC] to-[#0066FF] border-b border-[#003A99] shadow-md flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-4">
            <Logo lightMode={true} />
      </div>

      {/* Right side - Notifications and Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <button className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition">
          <Bell size={20} />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/10 transition group"
          >
            {/* AVATAR: Imagen o Iniciales */}
            <div className="w-10 h-10 rounded-full bg-white text-[#0048BC] flex items-center justify-center font-bold shadow-sm overflow-hidden border-2 border-transparent group-hover:border-white/20 transition">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span>{getUserInitials()}</span>
              )}
            </div>

            {/* TEXTO: Nombre y Email */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white leading-tight">
                {getDisplayName()}
              </p>
              <p className="text-[11px] text-white/70 font-light truncate max-w-[120px]">
                {user?.email || ""}
              </p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                {/* Dropdown Header Info */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <p className="text-sm font-semibold text-gray-900">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {user?.email || ""}
                  </p>
                </div>
                
                <div className="p-1">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  >
                    <User size={16} className="text-gray-500" />
                    My Profile
                  </button>
                  
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Settings size={16} className="text-gray-500" />
                    Settings
                  </button>
                </div>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}