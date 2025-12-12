"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import PropertiesTable from "@/components/dashboard/PropertiesTable";
import PropertyDetails from "@/components/dashboard/PropertyDetails";
import PropertyFormWrapper from "@/components/dashboard/PropertyFormWrapper";
import PropertyFormEdit from "@/components/dashboard/PropertyFormEdit";
import UserProfile from "@/components/dashboard/UserProfile";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeView, setActiveView] = useState("dashboard");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Sincronizar el estado con la URL
  useEffect(() => {
    if (pathname === "/dashboard/properties") {
      setActiveView("properties");
    } else if (pathname?.startsWith("/dashboard/properties/new")) {
      setActiveView("new");
    } else if (pathname?.match(/^\/dashboard\/properties\/[^/]+\/edit$/)) {
      setActiveView("edit");
    } else if (pathname?.match(/^\/dashboard\/properties\/[^/]+$/)) {
      setActiveView("details");
    } else if (pathname === "/dashboard/profile") {
      setActiveView("profile");
    } else {
      setActiveView("dashboard");
    }
  }, [pathname]);

  // Cargar propiedades al inicio (solo una vez)
  useEffect(() => {
    if (properties.length === 0 && !loading) {
      loadProperties();
    }
  }, []);

  const handleViewChange = (view: string) => {
    if (view === "properties") {
      router.push("/dashboard/properties");
    } else {
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (activeView === "profile") {
      router.push("/dashboard");
    } else {
      router.push("/dashboard/properties");
    }
  };

  // Extraer el ID de la propiedad de la URL
  const getPropertyId = () => {
    const match = pathname?.match(/^\/dashboard\/properties\/([^/]+)/);
    return match ? match[1] : null;
  };

  const loadProperties = async () => {
    if (loading) return; // Evitar múltiples llamadas
    setLoading(true);
    try {
      const { data, error } = await supabaseBrowser
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header onProfileClick={handleProfileClick} />
      <div className="flex flex-1">
        <Sidebar activeView={activeView} onViewChange={handleViewChange} />
        <main className="flex-1 bg-gray-50 p-6">
        {activeView === "dashboard" && (
          <div>
            <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
                <p className="text-gray-600">Total Properties</p>
                <h2 className="text-3xl font-bold mt-1">{properties.length || 0}</h2>
              </div>

              <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
                <p className="text-gray-600">Active Listings</p>
                <h2 className="text-3xl font-bold mt-1">{properties.length || 0}</h2>
              </div>

              <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
                <p className="text-gray-600">Registered Agents</p>
                <h2 className="text-3xl font-bold mt-1">3</h2>
              </div>
            </div>
          </div>
        )}

        {activeView === "properties" && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-600">Loading properties...</p>
              </div>
            ) : (
              <PropertiesTable properties={properties} />
            )}
          </div>
        )}

        {activeView === "new" && (
          <PropertyFormWrapper onBack={handleBack} />
        )}

        {activeView === "details" && (
          <PropertyDetails propertyId={getPropertyId() || ""} onBack={handleBack} />
        )}

        {activeView === "edit" && (
          <PropertyFormEdit propertyId={getPropertyId() || ""} onBack={handleBack} />
        )}

        {activeView === "profile" && (
          <UserProfile onBack={() => router.push("/dashboard")} />
        )}
      </main>
      </div>
    </div>
  );
}
