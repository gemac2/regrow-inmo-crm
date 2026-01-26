"use client";

import { useState, useEffect } from "react";
import { 
  Share2, Mail, ExternalLink, X, Loader2, Send, Download, Trash2, Search 
} from "lucide-react";
import { getResalesProperties, importResaleProperty, deleteResaleProperty } from "./actions";
import { sendEmail } from "../mailbox/actions"; 
import { toast } from "sonner";

export default function ResalesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal de Email
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedProp, setSelectedProp] = useState<any>(null);
  const [emailTo, setEmailTo] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // Modal de Importación
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importRef, setImportRef] = useState("");
  const [importing, setImporting] = useState(false);

  // Cargar datos reales al inicio
  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    setLoading(true);
    const data = await getResalesProperties();
    setProperties(data || []);
    setLoading(false);
  }

  // --- FUNCIÓN DE IMPORTAR ---
  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importRef.trim()) return;
    
    setImporting(true);
    const result = await importResaleProperty(importRef);
    setImporting(false);

    if (result.success) {
        toast.success(`Propiedad ${importRef} importada correctamente`);
        setImportModalOpen(false);
        setImportRef("");
        loadProperties(); // Recargar la tabla
    } else {
        toast.error(result.error);
    }
  };

  // --- FUNCIÓN DE ELIMINAR ---
  const handleDelete = async (id: string) => {
      if(!confirm("¿Quitar de tu lista?")) return;
      await deleteResaleProperty(id);
      loadProperties();
      toast.success("Propiedad eliminada");
  }

  // --- FUNCIÓN DE EMAIL ---
  const openEmailModal = (prop: any) => {
    setSelectedProp(prop);
    setEmailModalOpen(true);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProp) return;
    setSendingEmail(true);

    const propertyHtml = `
      <div style="font-family: sans-serif; color: #333;">
        <p>Hola,</p>
        <p>He encontrado esta propiedad en la red que podría interesarte:</p>
        <br/>
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; max-width: 400px; background: white;">
          ${selectedProp.image_url ? `<img src="${selectedProp.image_url}" style="width: 100%; height: 200px; object-fit: cover;" />` : ''}
          <div style="padding: 15px;">
            <h3 style="margin: 0 0 5px 0; color: #0048BC;">${selectedProp.title}</h3>
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Ref: ${selectedProp.external_ref}</p>
            <div style="display:flex; gap: 10px; font-size: 13px; color: #555; margin-bottom: 10px;">
               <span>🛏 ${selectedProp.bedrooms} Beds</span> | 
               <span>🚿 ${selectedProp.bathrooms} Bath</span> | 
               <span>📐 ${selectedProp.built_area} m²</span>
            </div>
            <p style="margin: 0; font-weight: bold; color: #111; font-size: 18px;">€${selectedProp.price?.toLocaleString()}</p>
          </div>
        </div>
        <br/>
        <p>Avísame si quieres visitarla.</p>
        <p>Saludos,</p>
      </div>
    `;

    const formData = new FormData();
    formData.append("to", emailTo);
    formData.append("subject", `Propiedad: ${selectedProp.title}`);
    formData.append("body", propertyHtml);
    formData.append("contact_id", "none");

    const result = await sendEmail(formData);
    setSendingEmail(false);

    if (result.success) {
      toast.success("Email enviado");
      setEmailModalOpen(false);
      setEmailTo("");
    } else {
      toast.error("Error al enviar");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             <Share2 className="text-blue-600"/> Resales Network
           </h1>
           <p className="text-gray-500 text-sm">{properties.length} propiedades importadas</p>
        </div>
        <div className="flex gap-2">
            {/* BOTÓN DE IMPORTAR */}
            <button 
                onClick={() => setImportModalOpen(true)}
                className="bg-[#0048BC] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#003895] flex items-center gap-2 shadow-sm"
            >
                <Download size={16}/> Import Property
            </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden min-h-[300px]">
        {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600"/></div>
        ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Search size={48} className="mb-4 opacity-20"/>
                <p>No has importado propiedades aún.</p>
                <button onClick={() => setImportModalOpen(true)} className="text-blue-600 text-sm font-medium mt-2 hover:underline">
                    Importar desde Resales
                </button>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="p-4 w-24">Foto</th>
                            <th className="p-4">Ref / Agencia</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Ubicación</th>
                            <th className="p-4">Detalles</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {properties.map((prop) => (
                            <tr key={prop.id} className="hover:bg-blue-50/30 transition group">
                                <td className="p-4">
                                    <div className="w-20 h-14 bg-gray-200 rounded overflow-hidden relative border border-gray-200">
                                        {prop.image_url ? (
                                            <img src={prop.image_url} alt={prop.external_ref} className="w-full h-full object-cover"/>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400"><Share2 size={16}/></div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 align-top">
                                    <div className="text-blue-600 font-medium text-sm">{prop.external_ref}</div>
                                    <div className="text-xs text-gray-500 mt-1">{prop.agency_name}</div>
                                </td>
                                <td className="p-4 align-top">
                                    <div className="font-bold text-gray-900">€{prop.price?.toLocaleString()}</div>
                                </td>
                                <td className="p-4 align-top">
                                    <div className="text-sm text-gray-800 font-medium">{prop.title}</div>
                                    <div className="text-xs text-gray-500">{prop.location}</div>
                                </td>
                                <td className="p-4 align-top text-xs text-gray-600">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">🛏 {prop.bedrooms}</span>
                                        <span className="flex items-center gap-1">🚿 {prop.bathrooms}</span>
                                        <span className="flex items-center gap-1">📐 {prop.built_area}m²</span>
                                    </div>
                                </td>
                                <td className="p-4 align-top text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => openEmailModal(prop)}
                                            className="p-2 bg-white border border-gray-300 text-gray-600 rounded hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                                            title="Send via Email"
                                        >
                                            <Mail size={16}/>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(prop.id)}
                                            className="p-2 bg-white border border-gray-300 text-gray-400 rounded hover:text-red-600 hover:border-red-200 transition" 
                                            title="Remove"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      {/* --- MODAL IMPORTAR --- */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Download size={20} className="text-blue-600"/> Import from Resales
                </h3>
                <form onSubmit={handleImport}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="e.g. R123456"
                        className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                        value={importRef}
                        onChange={e => setImportRef(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setImportModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={importing}
                            className="bg-[#0048BC] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#003895] flex items-center gap-2 disabled:opacity-50"
                        >
                            {importing ? <Loader2 className="animate-spin" size={16}/> : <Download size={16}/>}
                            Import
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* --- MODAL EMAIL --- */}
      {emailModalOpen && selectedProp && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                <div className="bg-[#0048BC] p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2"><Mail size={18}/> Email Property</h3>
                    <button onClick={() => setEmailModalOpen(false)} className="hover:text-gray-200"><X size={20}/></button>
                </div>
                
                <form onSubmit={handleSendEmail} className="p-6 space-y-4">
                    <div className="flex gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {selectedProp.image_url && <img src={selectedProp.image_url} className="w-16 h-16 object-cover rounded-md"/>}
                        <div>
                            <div className="font-bold text-gray-800 text-sm">{selectedProp.external_ref}</div>
                            <div className="text-xs text-gray-500">{selectedProp.title}</div>
                            <div className="text-blue-600 font-bold text-sm mt-1">€{selectedProp.price?.toLocaleString()}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To (Client Email)</label>
                        <input 
                            required
                            type="email" 
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="client@example.com"
                            value={emailTo}
                            onChange={e => setEmailTo(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button 
                            type="submit" 
                            disabled={sendingEmail}
                            className="bg-[#0048BC] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#003895] flex items-center gap-2 disabled:opacity-50"
                        >
                             {sendingEmail ? <Loader2 className="animate-spin" size={16}/> : <Send size={16}/>}
                             Send Email Now
                        </button>
                    </div>
                </form>
            </div>
         </div>
      )}

    </div>
  );
}