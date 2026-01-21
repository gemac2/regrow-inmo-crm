import { getProperty } from "@/app/dashboard/properties/actions"; // Ajusta la ruta si es necesario
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Download, 
  ArrowLeft, 
  BedDouble, 
  Bath, 
  Maximize, 
  Home,
  User
} from "lucide-react";
// Si creamos el componente MatchingContacts antes, lo importamos. 
// Si no, puedes comentar esta línea.
import MatchingContacts from "@/components/dashboard/MatchingContacts"; 

export default async function PropertyDetailsPage({ params }: any) {
  // Next.js 15 requiere await en params
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-lg">Property not found.</p>
        <Link href="/dashboard/properties" className="text-blue-600 hover:underline mt-2">
          Back to list
        </Link>
      </div>
    );
  }

  // Formateadores
  const formattedPrice = property.price ? Number(property.price).toLocaleString("de-DE") + " €" : "Price on request";

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-6">
      
      {/* --- HEADER SUPERIOR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/dashboard/properties" 
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
              {property.status || "Available"}
            </span>
            <span className="text-gray-400 text-sm font-mono">
              {property.reference}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
          <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
            <MapPin size={14} />
            <span>{property.address}, {property.city}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="text-3xl font-bold text-[#0048BC]">{formattedPrice}</div>
          <div className="flex gap-2">
            <a
              href={`/dashboard/properties/${property.id}/pdf`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition text-sm font-medium"
            >
              <Download size={16} /> Download PDF
            </a>
            {/* Botón de Editar opcional */}
            <Link
               href={`/dashboard/properties/${id}/edit`}
               className="px-4 py-2 bg-[#0048BC] text-white rounded-lg shadow hover:bg-[#003895] transition text-sm font-medium"
            >
               Edit Property
            </Link>
          </div>
        </div>
      </div>

      {/* --- GRID PRINCIPAL (2 Columnas) --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA (Contenido Principal) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* 1. GALERÍA DE IMÁGENES */}
          {property.images && property.images.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 h-[400px]">
              {/* Imagen Principal (Grande) */}
              <div className="col-span-3 md:col-span-3 h-full relative rounded-l-xl overflow-hidden group">
                <Image
                  src={property.images[0]}
                  alt="Main property image"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
              {/* Miniaturas Verticales */}
              <div className="col-span-1 flex flex-col gap-2 h-full">
                {property.images.slice(1, 4).map((url: string, idx: number) => (
                  <div key={idx} className="relative flex-1 rounded-r-xl (first:rounded-tr-xl last:rounded-br-xl) overflow-hidden border border-gray-100">
                     <Image
                      src={url}
                      alt={`Gallery ${idx}`}
                      fill
                      className="object-cover hover:opacity-80 transition"
                    />
                  </div>
                ))}
                 {/* Si hay más de 4 imágenes, mostrar contador */}
                 {property.images.length > 4 && (
                    <div className="relative flex-1 bg-gray-100 rounded-br-xl flex items-center justify-center text-gray-500 font-medium text-sm hover:bg-gray-200 cursor-pointer">
                       +{property.images.length - 4} more
                    </div>
                 )}
              </div>
            </div>
          ) : (
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
               <Home size={48} className="opacity-20" />
               <span className="ml-2">No images available</span>
            </div>
          )}

          {/* 2. DATOS CLAVE (Resumen rápido) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><Maximize size={20} /></div>
                <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Area</p>
                   <p className="font-semibold text-gray-900">{property.usable_area ? `${property.usable_area} m²` : "-"}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><BedDouble size={20} /></div>
                <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Bedrooms</p>
                   <p className="font-semibold text-gray-900">{property.bedrooms || "-"}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><Bath size={20} /></div>
                <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Bathrooms</p>
                   <p className="font-semibold text-gray-900">{property.bathrooms || "-"}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><Home size={20} /></div>
                <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Type</p>
                   <p className="font-semibold text-gray-900 capitalize">{property.property_type || "-"}</p>
                </div>
             </div>
          </div>

          {/* 3. DESCRIPCIÓN */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Description</h3>
            <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description || "No description provided."}
            </div>
          </section>

          {/* 4. CARACTERÍSTICAS (TAGS) */}
          {property.main_features && property.main_features.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {property.main_features.map((f: string, index: number) => (
                  <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded-md text-sm font-medium border border-blue-100">
                    {f}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 5. DATOS TÉCNICOS DETALLADOS */}
          <section>
             <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Technical Details</h3>
             <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="grid grid-cols-2 py-2 border-b border-gray-50">
                   <dt className="text-gray-500">Construction Year</dt>
                   <dd className="font-medium text-right">{property.year_built || "-"}</dd>
                </div>
                <div className="grid grid-cols-2 py-2 border-b border-gray-50">
                   <dt className="text-gray-500">Condition</dt>
                   <dd className="font-medium text-right">{property.condition || "-"}</dd>
                </div>
                <div className="grid grid-cols-2 py-2 border-b border-gray-50">
                   <dt className="text-gray-500">Heating</dt>
                   <dd className="font-medium text-right">{property.heating_type || "-"}</dd>
                </div>
                <div className="grid grid-cols-2 py-2 border-b border-gray-50">
                   <dt className="text-gray-500">Energy Certificate</dt>
                   <dd className="font-medium text-right">{property.energy_class ? `Class ${property.energy_class}` : "Pending"}</dd>
                </div>
             </dl>
          </section>
        </div>

        {/* COLUMNA DERECHA (Sidebar) */}
        <div className="space-y-6">
          
          {/* WIDGET 1: MATCHING (Clientes interesados) */}
          {/* Si tienes el componente MatchingContacts, úsalo aquí */}
          <MatchingContacts propertyId={id} />

          {/* WIDGET 2: AGENT CARD */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Listing Agent</h3>
                <span className="text-xs bg-white border px-2 py-0.5 rounded text-gray-500">Contact</span>
             </div>
             <div className="p-5 flex items-start gap-4">
                {property.agent_photo_url ? (
                   <img src={property.agent_photo_url} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" alt="Agent" />
                ) : (
                   <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <User size={24} />
                   </div>
                )}
                <div className="flex-1 min-w-0">
                   <p className="font-bold text-gray-900 truncate">{property.agent_name || "Unassigned"}</p>
                   {property.agent_email && (
                      <a href={`mailto:${property.agent_email}`} className="text-sm text-blue-600 hover:underline block truncate mt-0.5">
                         {property.agent_email}
                      </a>
                   )}
                   {property.agent_phone && (
                      <p className="text-sm text-gray-500 mt-1">{property.agent_phone}</p>
                   )}
                </div>
             </div>
          </div>

          {/* WIDGET 3: UBICACIÓN (Placeholder Map) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-1">
             <div className="h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400">
                <MapPin size={32} className="mb-2 opacity-50" />
                <span className="text-xs font-medium">Map Preview</span>
                <span className="text-[10px]">{property.city}, {property.country}</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}