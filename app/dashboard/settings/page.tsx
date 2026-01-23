"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { Building, Bell, Shield, Globe, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Definimos las pestañas disponibles
const TABS = [
  { id: "general", label: "General", icon: Building },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estado para los datos del formulario
  const [settings, setSettings] = useState({
    company_name: "",
    company_website: "",
    default_currency: "EUR",
    notifications_email: true,
    notifications_push: false,
  });

  // Cargar datos al iniciar
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const { data: { user } } = await supabaseBrowser.auth.getUser();
    
    if (user) {
      const { data, error } = await supabaseBrowser
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setSettings(data);
      } else {
        // Si no existe configuración, creamos una por defecto en memoria (no en DB aun)
        setSettings(prev => ({ ...prev }));
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabaseBrowser.auth.getUser();

    if (!user) return;

    try {
      const { error } = await supabaseBrowser
        .from("user_settings")
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      toast.error("Error saving settings", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  // Renderizado del contenido según la pestaña
  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Company Details</h2>
              <p className="text-sm text-gray-500">This information will be displayed on invoices and emails.</p>
            </div>
            <div className="grid gap-4 max-w-xl">
              <div className="grid gap-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input 
                  id="company_name" 
                  value={settings.company_name}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  placeholder="Acme Real Estate" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  value={settings.company_website}
                  onChange={(e) => setSettings({ ...settings, company_website: e.target.value })}
                  placeholder="https://example.com" 
                />
              </div>
              <div className="grid gap-2">
                <Label>Default Currency</Label>
                <Select 
                  value={settings.default_currency} 
                  onValueChange={(val) => setSettings({ ...settings, default_currency: val })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="USD">Dollar ($)</SelectItem>
                    <SelectItem value="GBP">Pound (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">Manage how you receive alerts.</p>
            </div>
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-gray-900">Email Alerts</label>
                  <p className="text-xs text-gray-500">Receive emails about new leads.</p>
                </div>
                {/* Custom Toggle Switch */}
                <button
                  onClick={() => setSettings({ ...settings, notifications_email: !settings.notifications_email })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications_email ? 'bg-[#0048BC]' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications_email ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-gray-900">Push Notifications</label>
                  <p className="text-xs text-gray-500">Receive browser notifications.</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, notifications_push: !settings.notifications_push })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications_push ? 'bg-[#0048BC]' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications_push ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        );

      case "integrations":
        return (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 animate-in fade-in duration-300">
            <Globe className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No integrations yet</h3>
            <p className="mt-1 text-sm text-gray-500">We are working on connecting with Google Calendar and Idealista.</p>
          </div>
        );

        case "security":
            return (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
                  <p className="text-sm text-gray-500">Manage your password and session.</p>
                </div>
                
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                    To change your password, please use the "Forgot Password" flow on the login screen or contact support.
                </div>
              </div>
            );

      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm">Manage your workspace preferences</p>
        </div>
        <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#0048BC] hover:bg-[#003895]"
        >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
        </Button>
      </div>

      {/* Layout Principal: Sidebar + Contenido */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar de Navegación */}
        <aside className="lg:w-64 shrink-0">
          <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1 overflow-x-auto pb-2 lg:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive 
                      ? "bg-blue-50 text-[#0048BC]" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Área de Contenido */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[500px]">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}