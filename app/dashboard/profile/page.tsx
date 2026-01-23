"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { User, Mail, Calendar, Save, Loader2, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false); // Estado para la subida de imagen

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    company: "",
    avatar_url: "", // Nuevo campo
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      setUser(user);

      if (user) {
        // Cargar metadata del usuario si existe
        const { data: profile } = await supabaseBrowser
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFormData({
            full_name: profile.full_name || "",
            phone: profile.phone || "",
            company: profile.company || "",
            avatar_url: profile.avatar_url || "",
          });
        } else {
          setFormData({
            full_name: user.user_metadata?.full_name || "",
            phone: user.user_metadata?.phone || "",
            company: user.user_metadata?.company || "",
            avatar_url: user.user_metadata?.avatar_url || "",
          });
        }
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA PARA SUBIR IMAGEN ---
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Subir a Supabase Storage (Bucket 'avatars')
      const { error: uploadError } = await supabaseBrowser.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Obtener URL Pública
      const { data: { publicUrl } } = supabaseBrowser.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // 3. Actualizar estado local inmediatamente para previsualizar
      setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
      toast.success("Image uploaded!");

    } catch (error: any) {
      toast.error("Error uploading avatar", { description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Upsert en tabla profiles incluyendo avatar_url
      const { error } = await supabaseBrowser
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          company: formData.company,
          avatar_url: formData.avatar_url, // Guardamos la URL
          email: user.email,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        // Fallback a Auth Metadata
        const { error: updateError } = await supabaseBrowser.auth.updateUser({
          data: {
            full_name: formData.full_name,
            phone: formData.phone,
            company: formData.company,
            avatar_url: formData.avatar_url,
          },
        });
        if (updateError) throw updateError;
      }

      toast.success("Profile updated successfully");
      router.refresh(); 
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("Error saving profile", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 text-sm">Manage your personal information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === COLUMNA IZQUIERDA: FORMULARIO === */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <User size={20} className="text-[#0048BC]" />
              Personal Information
            </h2>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your full name"
                  className="bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    type="tel"
                    className="bg-gray-50"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label>Company</Label>
                    <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company name"
                    className="bg-gray-50"
                    />
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
              <Mail size={20} className="text-[#0048BC]" />
              Account Security
            </h2>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input value={user.email || ""} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                <p className="text-xs text-gray-400">
                  To change your email, please contact support.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>User ID</Label>
                <Input value={user.id || ""} disabled className="bg-gray-100 text-gray-500 font-mono text-xs" />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={saving || uploading}
              className="bg-[#0048BC] hover:bg-[#003895] px-8"
            >
              {saving ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Save className="mr-2" size={16} />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* === COLUMNA DERECHA: AVATAR Y SIDEBAR === */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center flex flex-col items-center">
            
            {/* --- AVATAR CON UPLOAD --- */}
            <div className="relative group w-32 h-32 mb-4">
                {/* 1. Imagen o Placeholder */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 shadow-sm bg-gray-100 flex items-center justify-center">
                    {formData.avatar_url ? (
                        <img 
                            src={formData.avatar_url} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#0048BC] text-white flex items-center justify-center font-bold text-4xl">
                            {formData.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* 2. Botón de carga superpuesto */}
                <label 
                    htmlFor="avatar-upload" 
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity duration-200"
                >
                    {uploading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <Camera size={24} />
                    )}
                </label>
                <input 
                    type="file" 
                    id="avatar-upload" 
                    accept="image/*" 
                    onChange={uploadAvatar} 
                    disabled={uploading}
                    className="hidden" 
                />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              {formData.full_name || user.email?.split("@")[0] || "User"}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{user.email}</p>

            {formData.company && (
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                {formData.company}
              </span>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Calendar size={16} className="text-[#0048BC]" />
              Session Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Member since</span>
                <span className="font-medium text-gray-900">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last login</span>
                <span className="font-medium text-gray-900">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Today"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}