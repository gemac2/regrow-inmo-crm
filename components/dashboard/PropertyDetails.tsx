"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProperty } from "@/app/properties/actions";

interface PropertyDetailsProps {
  propertyId: string;
  onBack: () => void;
}

export default function PropertyDetails({ propertyId, onBack }: PropertyDetailsProps) {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const data = await getProperty(propertyId);
      setProperty(data);
    } catch (error) {
      console.error("Error loading property:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-6">
        <p className="text-red-600">Property not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de volver */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
        >
          ← Back to Properties
        </button>
        <Link
          href={`/properties/${property.id}/pdf`}
          target="_blank"
          className="px-4 py-2 bg-[#0048BC] text-white rounded-lg shadow hover:bg-[#0048BC]/90 transition"
        >
          Download PDF
        </Link>
      </div>

      {/* TITLE + PRICE */}
      <div>
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <p className="text-xl text-gray-700 mt-2">{property.price?.toLocaleString("es-ES")} €</p>
      </div>

      {/* IMAGES */}
      {property.images && property.images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {property.images.map((url: string, idx: number) => (
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
      )}

      {/* GENERAL INFO */}
      <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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
      {property.description && (
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{property.description}</p>
        </section>
      )}

      {/* FEATURES */}
      {property.main_features && property.main_features.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Main Features</h2>
          <div className="flex flex-wrap gap-2">
            {property.main_features.map((f: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* AGENT */}
      {(property.agent_name || property.agent_phone || property.agent_email) && (
        <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Agent Information</h2>
          <div className="flex items-center gap-4">
            {property.agent_photo_url && (
              <img
                src={property.agent_photo_url}
                className="w-20 h-20 rounded-full object-cover"
                alt="Agent"
              />
            )}
            <div>
              {property.agent_name && <p className="font-semibold">{property.agent_name}</p>}
              {property.agent_phone && <p className="text-gray-600">{property.agent_phone}</p>}
              {property.agent_email && <p className="text-gray-600">{property.agent_email}</p>}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
