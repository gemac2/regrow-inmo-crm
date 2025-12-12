"use client";

import PropertyForm from "@/components/property-form/PropertyForm";
import { ArrowLeft } from "lucide-react";

interface PropertyFormWrapperProps {
  onBack: () => void;
}

export default function PropertyFormWrapper({ onBack }: PropertyFormWrapperProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition font-medium"
        >
          <ArrowLeft size={18} />
          Back to Properties
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-[#0048BC] to-[#0066FF] px-8 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Property</h1>
          <p className="text-white/90 text-sm">Fill in the details to add a new property to your portfolio</p>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <PropertyForm />
        </div>
      </div>
    </div>
  );
}
