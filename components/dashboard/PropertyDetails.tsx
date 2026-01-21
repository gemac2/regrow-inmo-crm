"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProperty } from "@/app/dashboard/properties/actions";
import MatchingContacts from "./MatchingContacts"; 

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-3 text-gray-600">Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">Property not found</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* --- ACTION HEADER --- */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition text-sm font-medium"
        >
          ← Back
        </button>
        <div className="flex gap-3">
          <Link
            href={`/properties/${property.id}/pdf`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-[#0048BC] text-white text-sm font-medium rounded-lg shadow hover:bg-[#0048BC]/90 transition"
          >
            <span>Download PDF</span>
          </Link>
        </div>
      </div>

      {/* --- MAIN LAYOUT (2 Columns) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (2/3) - Property Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Title & Price */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                 <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600 bg-blue-50 rounded">
                    {property.property_type}
                 </span>
                 <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                 <p className="text-gray-500 text-sm mt-1">{property.address}, {property.city}</p>
              </div>
              <p className="text-2xl font-bold text-[#0048BC]">
                {property.price?.toLocaleString("en-US", { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
          </div>

          {/* Image Gallery */}
          {property.images && property.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {property.images.map((url: string, idx: number) => (
                <div key={idx} className={`relative rounded-lg overflow-hidden border border-gray-100 ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                  <Image
                    src={url}
                    alt={`property image ${idx}`}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>
              ))}
            </div>
          )}

          {/* General Information */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">General Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="block text-gray-500 mb-1">Reference</span>
                <span className="font-medium">{property.reference || '-'}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Status</span>
                <span className="font-medium capitalize">{property.status || 'Active'}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">City</span>
                <span className="font-medium">{property.city}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Usable Area</span>
                <span className="font-medium">{property.usable_area ? `${property.usable_area} m²` : '-'}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Bedrooms</span>
                <span className="font-medium">{property.bedrooms || '-'}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Bathrooms</span>
                <span className="font-medium">{property.bathrooms || '-'}</span>
              </div>
            </div>
          </section>

          {/* Description */}
          {property.description && (
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                {property.description}
              </p>
            </section>
          )}

          {/* Features / Tags */}
          {property.main_features && property.main_features.length > 0 && (
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Features</h2>
              <div className="flex flex-wrap gap-2">
                {property.main_features.map((f: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN (1/3) - CRM Sidebar */}
        <div className="space-y-6">
          
          {/* 1. MATCHING WIDGET */}
          <MatchingContacts propertyId={propertyId} />

          {/* 2. Listing Agent Card */}
          {(property.agent_name || property.agent_email) && (
            <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Listing Agent</h2>
              <div className="flex items-start gap-4">
                {property.agent_photo_url ? (
                  <img
                    src={property.agent_photo_url}
                    className="w-12 h-12 rounded-full object-cover border"
                    alt="Agent"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <span className="text-xs">N/A</span>
                  </div>
                )}
                <div className="overflow-hidden">
                  {property.agent_name && (
                    <p className="font-semibold text-gray-900 truncate">{property.agent_name}</p>
                  )}
                  {property.agent_email && (
                    <a href={`mailto:${property.agent_email}`} className="text-sm text-[#0048BC] hover:underline block truncate">
                      {property.agent_email}
                    </a>
                  )}
                  {property.agent_phone && (
                    <p className="text-sm text-gray-500 mt-1">{property.agent_phone}</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Internal Notes Widget (Example) */}
          <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100 text-sm text-yellow-800">
            <strong>Internal Note:</strong>
            <p className="mt-1">Remember to update status to "Reserved" if a deposit is received.</p>
          </div>

        </div>
      </div>
    </div>
  );
}