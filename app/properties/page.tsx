import { createSupabaseServer } from "@/lib/supabase";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

export default async function PropertiesPage() {
  const supabase = createSupabaseServer();
  const { data: properties } = await supabase.from("properties").select("*");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Properties</h1>

        <Link
          href="/properties/new"
          className="px-4 py-2 bg-[#0048BC] text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Property
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left text-gray-600 font-medium">Image</th>
              <th className="p-4 text-left text-gray-600 font-medium">Title</th>
              <th className="p-4 text-left text-gray-600 font-medium">City</th>
              <th className="p-4 text-left text-gray-600 font-medium">Price</th>
              <th className="p-4 text-left text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {properties?.map((p: any) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">
                  <img
                    src={p.images?.[0] || "/placeholder.png"}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                </td>
                <td className="p-3">{p.title}</td>
                <td className="p-3 capitalize">{p.city}</td>
                <td className="p-3 font-semibold">{p.price?.toLocaleString()} €</td>
                <td className="p-3 flex gap-3">
                  <Link href={`/properties/${p.id}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <Eye size={16} /> View
                  </Link>
                  <Link href={`/properties/${p.id}/edit`} className="text-green-600 hover:text-green-800 flex items-center gap-1">
                    <Pencil size={16} /> Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
