import { createSupabaseServer } from "@/lib/supabase";
import Link from "next/link";
import { Eye, Pencil, MapPin, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Asegúrate de tener este componente o usa un span simple

export default async function PropertiesPage() {
  const supabase = await createSupabaseServer();
  // Ordenamos por fecha de creación descendente para ver lo más nuevo arriba
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Properties</h1>
          <p className="text-sm text-gray-500">Manage your real estate inventory.</p>
        </div>

        <Link
          href="/dashboard/properties/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-[#0048BC] text-white text-sm font-medium rounded-lg shadow-sm hover:bg-[#003895] transition-colors"
        >
          + New Property
        </Link>
      </div>

      {/* --- TABLE (Propstack Style) --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-3 w-[100px]">Image</th>
                <th className="px-6 py-3 w-[120px]">Ref</th>
                <th className="px-6 py-3">Property Details</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {properties?.map((p: any) => (
                <tr key={p.id} className="group hover:bg-blue-50/50 transition-colors duration-200">
                  
                  {/* IMAGEN */}
                  <td className="px-6 py-3">
                    <div className="relative w-16 h-12 rounded-md overflow-hidden border border-gray-200 bg-gray-100">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-300">
                          <Home size={16} />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* REFERENCIA */}
                  <td className="px-6 py-3">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {p.reference || "---"}
                    </span>
                  </td>

                  {/* DETALLES (Título + Ciudad) */}
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 truncate max-w-[250px] group-hover:text-[#0048BC] transition-colors">
                        {p.title}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <MapPin size={12} />
                        <span className="capitalize">{p.city || "No location"}</span>
                        {p.bedrooms && <span className="mx-1">• {p.bedrooms} beds</span>}
                        {p.usable_area && <span>• {p.usable_area} m²</span>}
                      </div>
                    </div>
                  </td>

                  {/* ESTADO */}
                  <td className="px-6 py-3">
                    <StatusBadge status={p.status} />
                  </td>

                  {/* PRECIO */}
                  <td className="px-6 py-3 text-right font-medium text-gray-900">
                    {p.price ? p.price.toLocaleString("de-DE") + " €" : "-"}
                  </td>

                  {/* ACCIONES */}
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/dashboard/properties/${p.id}`} 
                        className="p-1.5 text-gray-500 hover:text-[#0048BC] hover:bg-blue-100 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link 
                        href={`/dashboard/properties/${p.id}/edit`} 
                        className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-md transition-colors"
                        title="Edit Property"
                      >
                        <Pencil size={16} />
                      </Link>
                    </div>
                  </td>

                </tr>
              ))}

              {(!properties || properties.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No properties found. <Link href="/dashboard/properties/new" className="text-[#0048BC] underline">Add your first one</Link>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Subcomponente para el Badge de Estado
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    available: "bg-green-100 text-green-700 border-green-200",
    reserved: "bg-yellow-100 text-yellow-700 border-yellow-200",
    sold: "bg-red-100 text-red-700 border-red-200",
    rented: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
  const className = styles[status] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
}