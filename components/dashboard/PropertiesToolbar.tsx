"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Filter, Download, Plus, FileCode, Loader2, X } from "lucide-react";
import Link from "next/link";
// Importamos la acción de lectura de HTML (asegúrate de haber creado este archivo en el paso anterior)
import { importFromHtml } from "@/app/dashboard/properties/html-import-action"; 

export default function PropertiesToolbar({ dataToExport }: { dataToExport: any[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, push } = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Estados para el Modal de Importación (HTML)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState(""); // Guardamos el código fuente pegado
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");

  // --- 1. SEARCH LOGIC ---
  const handleSearch = (term: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (term) params.set("query", term);
      else params.delete("query");
      replace(`${pathname}?${params.toString()}`);
    }, 300);
  };

  // --- 2. FILTER LOGIC ---
  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "all") params.set("status", status);
    else params.delete("status");
    replace(`${pathname}?${params.toString()}`);
  };

  // --- 3. EXPORT LOGIC ---
  const handleExport = () => {
    if (!dataToExport || dataToExport.length === 0) return alert("No data to export");
    const headers = ["Reference", "Title", "Price", "City", "Status", "Bedrooms", "Created At"];
    const csvContent = [
      headers.join(","),
      ...dataToExport.map(row => [
        row.reference, `"${row.title?.replace(/"/g, '""') || ''}"`, row.price, row.city, row.status, row.bedrooms, row.created_at
      ].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `properties_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- 4. IMPORT LOGIC (HTML SOURCE CODE) ---
  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!htmlContent.trim()) return;

    setIsImporting(true);
    setImportError("");

    // Llamamos a la acción que procesa el texto HTML
    const result = await importFromHtml(htmlContent);

    if (result.success) {
      setIsImportModalOpen(false);
      setHtmlContent("");
      // Redirigir a editar para revisar los datos extraídos
      push(`/dashboard/properties/${result.id}/edit`);
    } else {
      setImportError(result.error || "Error desconocido al procesar el HTML.");
    }
    setIsImporting(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        
        {/* LEFT: Search & Filter */}
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0048BC] outline-none"
              placeholder="Search properties..."
              onChange={(e) => handleSearch(e.target.value)}
              defaultValue={searchParams.get("query")?.toString()}
            />
          </div>
          <div className="relative">
              <select 
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#0048BC] outline-none cursor-pointer"
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  defaultValue={searchParams.get("status")?.toString() || "all"}
              >
                  <option value="all">All Status</option>
                  <option value="cold_lead">Cold Lead</option>
                  <option value="prospecting">Prospecting</option>
                  <option value="preparing">Preparing</option>
                  <option value="active">Active</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="archived">Archived</option>
                  <option value="cancelled">Cancelled</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>

        {/* RIGHT: Actions Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          
          {/* BOTÓN IMPORTAR (Nuevo - HTML) */}
          <button 
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-pink-50 border border-pink-200 text-pink-700 rounded-lg text-sm font-medium hover:bg-pink-100 transition"
              title="Import from Source Code"
          >
              <FileCode size={16} />
              <span className="hidden md:inline">Import HTML</span>
          </button>

          {/* BOTÓN EXPORTAR */}
          <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              title="Export to CSV"
          >
              <Download size={16} />
          </button>
          
          {/* BOTÓN NUEVA PROPIEDAD */}
          <Link
            href="/dashboard/properties/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#0048BC] text-white rounded-lg text-sm font-medium hover:bg-[#003895] transition shadow-sm"
          >
            <Plus size={16} />
            <span className="hidden md:inline">New Property</span>
          </Link>
        </div>
      </div>

      {/* --- MODAL DE IMPORTACIÓN (PEGAR CÓDIGO FUENTE) --- */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50 shrink-0">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FileCode size={18} className="text-pink-600" />
                Import from Source Code
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleImport} className="p-6 space-y-4 flex-1 flex flex-col min-h-0">
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Instructions (No Blocking):</strong></p>
                <ol className="list-decimal pl-4 space-y-1 text-xs text-gray-500">
                    <li>Open the property page in Idealista (new tab).</li>
                    <li>Right click anywhere and select <strong>"View Page Source"</strong> (or press <code>Ctrl + U</code>).</li>
                    <li>Select All (<code>Ctrl + A</code>) and Copy (<code>Ctrl + C</code>).</li>
                    <li>Paste the code below.</li>
                </ol>
              </div>
              
              <div className="flex-1 min-h-[150px]">
                <textarea 
                  required
                  className="w-full h-full border border-gray-300 rounded-lg p-3 text-xs font-mono focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                  placeholder="<html><head>... Paste the full source code here ..."
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                />
              </div>

              {importError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 shrink-0">
                  {importError}
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end gap-2 pt-2 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsImportModalOpen(false)} 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isImporting} 
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-50 transition"
                >
                  {isImporting ? <Loader2 className="animate-spin" size={16} /> : <FileCode size={16} />}
                  {isImporting ? 'Processing...' : 'Import Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}