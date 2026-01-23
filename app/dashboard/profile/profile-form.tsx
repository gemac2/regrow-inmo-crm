"use client";

import { useState } from "react";
import { updateProfile } from "./actions";
import { Loader2, Save, User, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

export default function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("userId", user.id); // Pasamos el ID seguro

    const result = await updateProfile(formData);
    
    setLoading(false);
    if (result.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Error updating profile", { description: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* Header del Formulario */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[#0048BC] text-white flex items-center justify-center text-2xl font-bold">
            {user.user_metadata?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your Profile</h2>
            <p className="text-sm text-gray-500">Manage your account settings and preferences.</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-2xl">
        
        {/* Email (Solo lectura) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Mail size={16} /> Email Address
          </label>
          <input 
            type="email" 
            disabled 
            value={user.email} 
            className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400">Email cannot be changed directly.</p>
        </div>

        {/* Nombre Completo */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User size={16} /> Full Name
          </label>
          <input 
            name="fullName"
            defaultValue={user.user_metadata?.full_name || ""} 
            placeholder="Enter your full name"
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Role (Solo lectura) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Shield size={16} /> Role
          </label>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
            ADMINISTRATOR
          </div>
        </div>

      </div>

      {/* Footer con Botón */}
      <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-[#0048BC] text-white rounded-lg font-medium hover:bg-[#003895] disabled:opacity-50 transition"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </button>
      </div>
    </form>
  );
}