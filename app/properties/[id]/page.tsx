import { getProperty } from "../actions";
import Image from "next/image";


export default async function PropertyDetailsPage({ params }: any) {
    const { id } = await params; //
  const property = await getProperty(id);


  if (!property) {
    return <div className="p-10">Property not found.</div>;
  }

  return (
    <div className="p-10 space-y-10">

      {/* TITLE + PRICE */}
      <div>
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <p className="text-xl text-gray-700 mt-2">{property.price} €</p>
      </div>
      <a
        href={`/properties/${property.id}/pdf`}
        target="_blank"
        className="px-4 py-2 bg-blue-600 text-white rounded shadow"
       >
        Download PDF
      </a>


      {/* IMAGES */}
      <div className="grid grid-cols-3 gap-4">
        {property.images?.map((url: string, idx: number) => (
          <div key={idx} className="rounded overflow-hidden border">
            <Image
                src={url}
                alt="property image"
                width={800}
                height={600}
                className="w-full h-60 object-cover rounded"
            />
          </div>
        ))}
      </div>

      {/* GENERAL INFO */}
      <section>
        <h2 className="text-xl font-semibold mb-4">General Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <div><strong>Reference:</strong> {property.reference}</div>
          <div><strong>City:</strong> {property.city}</div>
          <div><strong>Address:</strong> {property.address}</div>
          <div><strong>Country:</strong> {property.country}</div>
          <div><strong>Category:</strong> {property.category}</div>
          <div><strong>Type:</strong> {property.property_type}</div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700 leading-relaxed">{property.description}</p>
      </section>

      {/* FEATURES */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Main Features</h2>

        <div className="flex flex-wrap gap-2">
          {property.main_features?.map((f: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm"
            >
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* AGENT */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Agent Information</h2>

        <div className="flex items-center gap-4">
          {property.agent_photo_url && (
            <img
              src={property.agent_photo_url}
              className="w-20 h-20 rounded-full object-cover"
            />
          )}

          <div>
            <p className="font-semibold">{property.agent_name}</p>
            <p className="text-gray-600">{property.agent_phone}</p>
            <p className="text-gray-600">{property.agent_email}</p>
          </div>
        </div>
      </section>

    </div>
  );
}
