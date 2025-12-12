import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase";

export default async function PropertiesPage() {
  const { data: properties } = await supabaseBrowser
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Properties</h1>

        <Link
          href="/properties/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Property
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Image</th>
              <th className="py-2">Title</th>
              <th className="py-2">City</th>
              <th className="py-2">Price</th>
              <th className="py-2 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties?.map((p: any) => (
              <tr key={p.id} className="border-b">
                <td className="py-2">
                  <img
                    src={p.images?.[0]}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-2">{p.title}</td>
                <td className="py-2">{p.city}</td>
                <td className="py-2">{p.price} €</td>
                <td className="py-2">
                  <Link
                    href={`/properties/${p.id}`}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    View
                  </Link>

                  <Link
                    href={`/properties/${p.id}/edit`}
                    className="text-green-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {properties?.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No properties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
