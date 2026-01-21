import { getProperties } from "@/app/dashboard/properties/actions";
import PropertiesToolbar from "@/components/dashboard/PropertiesToolbar";
import Link from "next/link";
import { Eye, Pencil, MapPin, Home } from "lucide-react";

// Helper simple para badges
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    available: "bg-green-100 text-green-700 border-green-200",
    reserved: "bg-yellow-100 text-yellow-700 border-yellow-200",
    sold: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; status?: string }>;
}) {
  // 1. Obtener parámetros de URL (Next.js 15 requiere await)
  const params = await searchParams;
  const query = params.query || "";
  const status = params.status || "";

  // 2. Obtener datos filtrados del servidor
  const properties = await getProperties({ query, status });

  return (
    <div className="space-y-6">
      
      {/* HEADER + TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <p className="text-gray-500 text-sm">Manage your real estate inventory.</p>
      </div>

      {/* TOOLBAR (Search, Filter, Export, Add New) */}
      <PropertiesToolbar dataToExport={properties || []} />

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-3 w-[100px]">Image</th>
                <th className="px-6 py-3">Ref</th>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties && properties.length > 0 ? (
                properties.map((p: any) => (
                  <tr key={p.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-3">
                      <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100 relative border border-gray-200">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="img" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-300"><Home size={16} /></div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-gray-500">{p.reference}</td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 truncate max-w-[200px] group-hover:text-[#0048BC]">{p.title}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <MapPin size={10} /> {p.city}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-6 py-3 text-right font-medium">{p.price?.toLocaleString()} €</td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/properties/${p.id}`} className="p-1.5 hover:bg-blue-100 text-blue-600 rounded"><Eye size={16} /></Link>
                        <Link href={`/dashboard/properties/${p.id}/edit`} className="p-1.5 hover:bg-green-100 text-green-600 rounded"><Pencil size={16} /></Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No properties found matching your filters.
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