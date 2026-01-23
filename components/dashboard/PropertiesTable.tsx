"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, MapPin, Home, Send, X, Loader2, CheckSquare, Square, BedDouble, Maximize } from "lucide-react";
import { sendEmail } from "@/app/dashboard/mailbox/actions";
import { toast } from "sonner";

// --- MAPEO DE ESTADOS Y COLORES ---
function StatusBadge({ status }: { status: string }) {
  // Normalizamos el status a minúsculas por seguridad
  const s = status?.toLowerCase() || "unknown";

  const styles: any = {
    // FASE INICIAL
    cold_lead: "bg-gray-100 text-gray-600 border-gray-200",      // Cold Lead
    prospecting: "bg-blue-50 text-blue-600 border-blue-200",     // Captación
    preparing: "bg-orange-50 text-orange-600 border-orange-200", // Preparación
    
    // FASE COMERCIAL
    active: "bg-green-100 text-green-700 border-green-200",      // Activa
    available: "bg-green-100 text-green-700 border-green-200",   // (Legacy)
    
    // CIERRE
    reserved: "bg-yellow-100 text-yellow-700 border-yellow-200", // Reservada
    sold: "bg-indigo-100 text-indigo-700 border-indigo-200",     // Vendida
    
    // FINALIZADOS NO EXITOSOS
    archived: "bg-gray-50 text-gray-400 border-gray-100",        // Archivada
    cancelled: "bg-red-50 text-red-600 border-red-100",          // Cancelada
  };

  // Función para formatear el texto (ej: "cold_lead" -> "Cold Lead")
  const formatText = (text: string) => {
    return text.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[s] || "bg-gray-100 text-gray-500"}`}>
      {formatText(s)}
    </span>
  );
}

// CORRECCIÓN CRÍTICA: Añadimos valor por defecto ' = []' en la destructuración
export default function PropertiesTable({ properties = [] }: { properties?: any[] }) {
  // Doble seguridad: Aseguramos que sea array
  const safeProperties = Array.isArray(properties) ? properties : [];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  // --- LÓGICA DE SELECCIÓN ---
  const toggleSelectAll = () => {
    if (selectedIds.length === safeProperties.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(safeProperties.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- GENERADOR DE EMAIL ---
  const handleSendProperties = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const selectedProps = safeProperties.filter(p => selectedIds.includes(p.id));
    
    // HTML del correo
    const emailBody = `
      <h2 style="color: #0048BC; font-family: sans-serif;">Recommended Properties</h2>
      <p style="font-family: sans-serif; color: #555;">Hi, check out these properties I found for you:</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      
      ${selectedProps.map(p => `
        <div style="margin-bottom: 24px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; font-family: sans-serif;">
          ${p.images && p.images[0] ? 
            `<img src="${p.images[0]}" style="width: 100%; max-width: 400px; height: 200px; object-fit: cover; border-radius: 6px; margin-bottom: 12px;" />` 
            : ''}
          <h3 style="margin: 0 0 8px 0; color: #111;">${p.title}</h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">📍 ${p.city}</p>
          <p style="margin: 0; font-weight: bold; color: #0048BC; font-size: 16px;">${p.price?.toLocaleString()} €</p>
          <ul style="color: #555; font-size: 13px; padding-left: 20px; margin-top: 10px;">
             <li>🛏️ ${p.bedrooms || 0} Beds</li>
             <li>📐 ${p.usable_area || 0} m²</li>
          </ul>
        </div>
      `).join('')}
      
      <p style="font-family: sans-serif; color: #888; font-size: 12px; margin-top: 30px;">Sent via Regrow CRM</p>
    `;

    const formData = new FormData();
    formData.append("to", recipientEmail);
    formData.append("subject", `Selection: ${selectedProps.length} Properties for you`);
    formData.append("body", emailBody);
    formData.append("contact_id", "none"); 

    const toastId = toast.loading("Sending properties...");

    const result = await sendEmail(formData);

    setIsSending(false);
    if (result.success) {
      toast.success("Email sent successfully", { id: toastId });
      setIsSendModalOpen(false);
      setSelectedIds([]);
      setRecipientEmail("");
    } else {
      toast.error("Failed to send", { id: toastId, description: result.error });
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
        
        {/* BARRA FLOTANTE DE SELECCIÓN */}
        {selectedIds.length > 0 && (
          <div className="absolute top-0 left-0 right-0 h-[50px] bg-blue-50/95 backdrop-blur-sm z-10 flex items-center justify-between px-6 border-b border-blue-100 animate-in slide-in-from-top-2">
            <span className="text-sm font-medium text-blue-800">
              {selectedIds.length} properties selected
            </span>
            <div className="flex gap-2">
               <button 
                 onClick={() => setIsSendModalOpen(true)}
                 className="flex items-center gap-2 px-3 py-1.5 bg-[#0048BC] text-white text-xs font-bold rounded-md hover:bg-[#003895] transition shadow-sm"
               >
                 <Send size={14} /> Send by Email
               </button>
               <button 
                 onClick={() => setSelectedIds([])}
                 className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md"
                 title="Cancel Selection"
               >
                 <X size={16} />
               </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-3 w-[40px]">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-blue-600">
                    {selectedIds.length === safeProperties.length && safeProperties.length > 0 ? <CheckSquare size={18} className="text-blue-600"/> : <Square size={18} />}
                  </button>
                </th>
                <th className="px-6 py-3 w-[100px]">Image</th>
                <th className="px-6 py-3">Property</th>
                
                {/* --- NUEVAS COLUMNAS --- */}
                <th className="px-6 py-3 text-center">Beds</th>
                <th className="px-6 py-3 text-center">Area</th>
                
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {safeProperties.length > 0 ? (
                safeProperties.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <tr key={p.id} className={`group transition-colors ${isSelected ? 'bg-blue-50/40' : 'hover:bg-blue-50/30'}`}>
                      {/* CHECKBOX */}
                      <td className="px-6 py-3">
                        <button onClick={() => toggleSelectOne(p.id)} className="text-gray-300 hover:text-blue-600">
                          {isSelected ? <CheckSquare size={18} className="text-blue-600"/> : <Square size={18} />}
                        </button>
                      </td>
                      
                      {/* IMAGEN THUMBNAIL */}
                      <td className="px-6 py-3">
                        <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100 relative border border-gray-200 shrink-0">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt="thumb" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-300"><Home size={16} /></div>
                          )}
                        </div>
                      </td>
                      
                      {/* TÍTULO Y REF */}
                      <td className="px-6 py-3">
                        <div className="flex flex-col max-w-[250px]">
                          <span className="font-semibold text-gray-900 truncate">{p.title}</span>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                              <span className="font-mono bg-gray-100 px-1 rounded text-[10px]">{p.reference}</span>
                              <div className="flex items-center gap-0.5 truncate">
                                <MapPin size={10} className="shrink-0" /> {p.city}
                              </div>
                          </div>
                        </div>
                      </td>

                      {/* --- COLUMNA BEDS --- */}
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600">
                            <span className="font-medium">{p.bedrooms || "-"}</span>
                            <BedDouble size={14} className="text-gray-400" />
                        </div>
                      </td>

                      {/* --- COLUMNA AREA --- */}
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600">
                            <span className="font-medium">{p.usable_area ? `${p.usable_area} m²` : "-"}</span>
                            <Maximize size={14} className="text-gray-400" />
                        </div>
                      </td>

                      <td className="px-6 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-6 py-3 text-right font-medium text-gray-900">{p.price?.toLocaleString()} €</td>
                      
                      {/* ACCIONES */}
                      <td className="px-6 py-3">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/dashboard/properties/${p.id}`} className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-md" title="View"><Eye size={16} /></Link>
                          <Link href={`/dashboard/properties/${p.id}/edit`} className="p-1.5 hover:bg-green-100 text-green-600 rounded-md" title="Edit"><Pencil size={16} /></Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-gray-500">No properties found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE ENVÍO --- */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Send size={18} className="text-blue-600" />
                Send {selectedIds.length} Properties
              </h3>
              <button onClick={() => setIsSendModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSendProperties} className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                A summary of the selected properties will be sent to the recipient.
              </p>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Recipient Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="client@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsSendModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isSending} 
                  className="flex items-center gap-2 px-4 py-2 bg-[#0048BC] text-white rounded-lg text-sm font-medium hover:bg-[#003895] disabled:opacity-50 transition"
                >
                  {isSending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  {isSending ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}