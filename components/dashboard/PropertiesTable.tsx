import Link from "next/link";
import Image from "next/image";
import { Pencil, Eye } from "lucide-react";

interface Property {
  id: string;
  title: string;
  city: string;
  price: number;
  images?: string[];
}

interface PropertiesTableProps {
  properties: Property[];
}

export default function PropertiesTable({ properties }: PropertiesTableProps) {
  return (
    <div className="w-full">
      {/* Título + botón */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#0048BC]">Properties</h1>

        <Link
          href="/dashboard/properties/new"
          className="px-4 py-2 rounded-lg bg-[#0048BC] text-white font-medium hover:bg-[#0048BC]/90 transition"
        >
          + Add Property
        </Link>
      </div>

      {/* Tabla */}
      <div className="border rounded-xl shadow-sm bg-white overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-3 px-4 font-medium text-gray-600">Image</th>
              <th className="py-3 px-4 font-medium text-gray-600">Title</th>
              <th className="py-3 px-4 font-medium text-gray-600">City</th>
              <th className="py-3 px-4 font-medium text-gray-600">Price</th>
              <th className="py-3 px-4 font-medium text-gray-600 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No properties found
                </td>
              </tr>
            ) : (
              properties.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Imagen */}
                  <td className="py-3 px-4">
                    <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden border">
                      {p.images?.[0] ? (
                        <Image
                          src={p.images[0]}
                          width={56}
                          height={56}
                          alt={p.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          No Img
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">{p.title}</td>
                  <td className="py-3 px-4 capitalize">{p.city}</td>

                  {/* Precio formateado */}
                  <td className="py-3 px-4 font-semibold text-[#0048BC]">
                    {p.price?.toLocaleString("es-ES")} €
                  </td>

                  {/* Acciones */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/dashboard/properties/${p.id}`}>
                        <Eye className="h-5 w-5 text-[#0048BC] hover:scale-110 transition cursor-pointer" />
                      </Link>

                      <Link href={`/dashboard/properties/${p.id}/edit`}>
                        <Pencil className="h-5 w-5 text-green-600 hover:scale-110 transition cursor-pointer" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
