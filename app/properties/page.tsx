import { getProperties } from "./actions";
import Link from "next/link";

export default async function PropertiesList() {
  const properties = await getProperties();

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>

        <Link
          href="/properties/new"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          New Property
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Reference</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {properties?.map((p: any) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.reference}</td>
              <td className="p-2 border">{p.title}</td>
              <td className="p-2 border">{p.city}</td>
              <td className="p-2 border">{p.price} €</td>

              <td className="p-2 border">
                <Link href={`/properties/${p.id}`} className="text-blue-600">
                  View
                </Link>
                {" | "}
                <Link href={`/properties/${p.id}/edit`} className="text-green-600">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
