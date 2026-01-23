import { getProperties } from "@/app/dashboard/properties/actions";
import PropertiesToolbar from "@/components/dashboard/PropertiesToolbar";
import PropertiesTable from "@/components/dashboard/PropertiesTable"; // <--- IMPORTANTE: Importamos el componente inteligente

// Forzamos que la página sea dinámica para que refresque los datos siempre
export const dynamic = "force-dynamic";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; status?: string }>;
}) {
  // 1. Obtener parámetros de URL
  const params = await searchParams;
  const query = params.query || "";
  const status = params.status || "";

  // 2. Obtener datos del servidor (Con protección || [] para evitar errores)
  const properties = (await getProperties({ query, status })) || [];

  return (
    <div className="space-y-6">
      
      {/* HEADER + TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <p className="text-gray-500 text-sm">Manage your real estate inventory.</p>
      </div>

      {/* TOOLBAR (Search, Filter, Export, Add New) */}
      <PropertiesToolbar dataToExport={properties} />

      {/* TABLE COMPONENT */}
      {/* Aquí es donde ocurre la magia. Pasamos los datos al componente interactivo */}
      <PropertiesTable properties={properties} />
      
    </div>
  );
}