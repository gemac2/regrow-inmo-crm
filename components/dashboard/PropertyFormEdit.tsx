"use client";

import { useState, useEffect } from "react";
import { getProperty } from "@/app/dashboard/properties/actions";
import PropertyForm from "@/components/property-form/PropertyForm";

interface PropertyFormEditProps {
  propertyId: string;
  onBack: () => void;
}

export default function PropertyFormEdit({ propertyId, onBack }: PropertyFormEditProps) {
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);

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
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
        >
          ← Back to Properties
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
        <PropertyForm 
          initialData={property} 
          propertyId={propertyId} 
          isEdit={true}
        />
      </div>
    </div>
  );
}
