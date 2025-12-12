"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { User, Mail, Calendar, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserProfileProps {
  onBack?: () => void;
}

export default function UserProfile({ onBack }: UserProfileProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    company: "",
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
          });
        } else {
          // Si no existe perfil, usar metadata de auth
          setFormData({
            full_name: user.user_metadata?.full_name || "",
            phone: user.user_metadata?.phone || "",
            company: user.user_metadata?.company || "",
          });
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Intentar actualizar o crear perfil en la tabla profiles
      const { error } = await supabaseBrowser
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          company: formData.company,
          email: user.email,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        // Si la tabla no existe, actualizar metadata de auth
        const { error: updateError } = await supabaseBrowser.auth.updateUser({
          data: {
            full_name: formData.full_name,
            phone: formData.phone,
            company: formData.company,
          },
        });

        if (updateError) throw updateError;
      }

      alert("Profile updated successfully");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      alert("Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#0048BC]">My Profile</h1>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
          >
            ← Back
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User size={20} className="text-[#0048BC]" />
              Personal Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  placeholder="Your full name"
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 234 567 8900"
                  type="tel"
                />
              </div>

              <div>
                <Label>Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="Your company name"
                />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Mail size={20} className="text-[#0048BC]" />
              Account Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Email Address</Label>
                <Input value={user.email || ""} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500 mt-1">
                  Email address cannot be changed
                </p>
              </div>

              <div>
                <Label>User ID</Label>
                <Input value={user.id || ""} disabled className="bg-gray-50 text-xs" />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#0048BC] hover:bg-[#0048BC]/90"
            >
              <Save size={16} className="mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Sidebar - Avatar and Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 text-center">
            <div className="w-24 h-24 rounded-full bg-[#0048BC] text-white flex items-center justify-center font-bold text-2xl mx-auto mb-4">
              {formData.full_name
                ? formData.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <h3 className="text-lg font-semibold">
              {formData.full_name || user.email?.split("@")[0] || "User"}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>

            {formData.company && (
              <p className="text-sm text-gray-600 mt-2">{formData.company}</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-[#0048BC]" />
              Session Information
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Member since:</span>
                <p className="font-medium">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Last updated:</span>
                <p className="font-medium">
                  {user.updated_at
                    ? new Date(user.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
