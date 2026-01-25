import { getProperties } from "@/app/dashboard/properties/actions";
import PropertiesToolbar from "@/components/dashboard/PropertiesToolbar";
import PropertiesTable from "@/components/dashboard/PropertiesTable";

export const dynamic = "force-dynamic";

export default async function PropertiesPage({
  searchParams,
}: {
  // 1. Agregamos 'agent' al tipo de datos
  searchParams: Promise<{ query?: string; status?: string; agent?: string }>;
}) {
  const params = await searchParams;
  const query = params.query || "";
  const status = params.status || "";
  
  // 2. Leemos el parámetro 'agent' de la URL
  const agent = params.agent || ""; 

  // 3. Se lo enviamos a la función getProperties
  const properties = (await getProperties({ query, status, agent })) || [];

  return (
    <div className="space-y-6">
      
      {/* HEADER + TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <p className="text-gray-500 text-sm">Manage your real estate inventory.</p>
      </div>

      {/* TOOLBAR */}
      <PropertiesToolbar dataToExport={properties} />

      {/* TABLE COMPONENT */}
      <PropertiesTable properties={properties} />
      
    </div>
  );
}