import { getProperty } from "@/app/dashboard/properties/actions"; // Verifica que esta ruta sea correcta
import PropertyForm from "@/components/property-form/PropertyForm";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPageProps) {
  // 1. En Next.js 15, 'params' es una promesa, hay que esperarla
  const { id } = await params;

  // 2. Obtenemos los datos actuales de la propiedad desde la DB
  const property = await getProperty(id);

  // 3. Seguridad: Si no existe la propiedad (o se borró), enviamos al 404
  if (!property) {
    notFound();
  }

  // 4. Renderizamos el formulario pasándole los datos iniciales
  return (
    <div className="w-full max-w-[1800px] mx-auto p-6">
      <PropertyForm 
        initialData={property} 
        propertyId={id} 
        isEdit={true} 
      />
    </div>
  );
}