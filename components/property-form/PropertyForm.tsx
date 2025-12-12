"use client";

import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProperty, updateProperty } from "@/app/properties/actions";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { updatePropertyImages } from "@/app/properties/actions";
import { 
  Building2, 
  Home, 
  Ruler, 
  Zap, 
  User, 
  Image as ImageIcon,
  Plus,
  CheckCircle2
} from "lucide-react";

interface PropertyFormProps {
  initialData?: any;
  propertyId?: string;
  isEdit?: boolean;
}

export default function PropertyForm({ initialData, propertyId, isEdit = false }: PropertyFormProps = {}) {
  const router = useRouter();

  const [form, setForm] = useState<any>(() => {
    if (initialData) {
      // Pre-llenar el formulario con los datos existentes
      return {
        reference: initialData.reference || "",
        title: initialData.title || "",
        city: initialData.city || "",
        price: initialData.price?.toString() || "",
        description: initialData.description || "",

        year_built: initialData.year_built || "",
        construction_type: initialData.construction_type || "",
        condition: initialData.condition || "",
        equipment_quality: initialData.equipment_quality || "",
        community_fee: initialData.community_fee || "",
        property_tax: initialData.property_tax || "",
        garbage_fee: initialData.garbage_fee || "",
        last_renovation: initialData.last_renovation || "",
        availability: initialData.availability || "",

        floors: initialData.floors || "",
        floor_block: initialData.floor_block || "",
        bedrooms: initialData.bedrooms || "",
        bathrooms: initialData.bathrooms || "",
        usable_area: initialData.usable_area || "",
        built_area: initialData.built_area || "",
        terrace_m2: initialData.terrace_m2 || "",
        garden_m2: initialData.garden_m2 || "",
        parking_spaces: initialData.parking_spaces || "",
        orientation: initialData.orientation || "",
        views: initialData.views || "",

        energy_certificate_available: initialData.energy_certificate_available || "",
        certificate_issued_at: initialData.certificate_issued_at || "",
        energy_class: initialData.energy_class || "",
        certificate_expires_at: initialData.certificate_expires_at || "",
        heating_type: initialData.heating_type || "",
        energy_consumption_index: initialData.energy_consumption_index || "",
        main_energy_source: initialData.main_energy_source || "",

        agent_name: initialData.agent_name || "",
        agent_phone: initialData.agent_phone || "",
        agent_email: initialData.agent_email || "",
        agent_address: initialData.agent_address || "",
        agent_photo_url: initialData.agent_photo_url || "",

        main_features: initialData.main_features || [],
      };
    }
    // Formulario vacío para crear nueva propiedad
    return {
      reference: "",
      title: "",
      city: "",
      price: "",
      description: "",

      year_built: "",
      construction_type: "",
      condition: "",
      equipment_quality: "",
      community_fee: "",
      property_tax: "",
      garbage_fee: "",
      last_renovation: "",
      availability: "",

      floors: "",
      floor_block: "",
      bedrooms: "",
      bathrooms: "",
      usable_area: "",
      built_area: "",
      terrace_m2: "",
      garden_m2: "",
      parking_spaces: "",
      orientation: "",
      views: "",

      energy_certificate_available: "",
      certificate_issued_at: "",
      energy_class: "",
      certificate_expires_at: "",
      heating_type: "",
      energy_consumption_index: "",
      main_energy_source: "",

      agent_name: "",
      agent_phone: "",
      agent_email: "",
      agent_address: "",
      agent_photo_url: "",

      main_features: [],
    };
  });

  const [images, setImages] = useState(() => initialData?.images || []);
  const [createdId, setCreatedId] = useState<string | null>(propertyId || null);


  function setValue(key: string, value: any) {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (isEdit && propertyId) {
      // Actualizar propiedad existente
      await updateProperty(propertyId, {
        ...form,
        price: Number(form.price),
      });
      
      // Actualizar imágenes si hay cambios
      if (images.length > 0) {
        await updatePropertyImages(propertyId, images);
      }
      
      // Redirigir al dashboard de properties después de actualizar
      router.push("/dashboard/properties");
    } else {
      // Crear nueva propiedad
      const newId = await createProperty({
        ...form,
        price: Number(form.price),
        images: []  // empty value by default
      });

      setCreatedId(newId);
      
      // No redirigir inmediatamente, esperar a que el usuario suba las imágenes
      // El usuario puede hacer clic en "Finish & Save Photos" cuando termine
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Accordion type="multiple" className="w-full space-y-3">

        {/* GENERAL INFORMATION */}
        <AccordionItem value="general" className="border border-gray-200 rounded-lg px-4 hover:border-[#0048BC]/50 transition-colors">
          <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0048BC]/10 rounded-lg">
                <Building2 size={20} className="text-[#0048BC]" />
              </div>
              <span>General Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 pt-4 pb-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Reference</Label>
                <Input
                  value={form.reference}
                  onChange={(e) => setValue("reference", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="PROP-001"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setValue("city", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="Madrid"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Property Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setValue("title", e.target.value)}
                className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                placeholder="Beautiful apartment in city center"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Price (€)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setValue("price", e.target.value)}
                className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                placeholder="250000"
              />
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* DESCRIPTION SECTION */}
        <AccordionItem value="description" className="border border-gray-200 rounded-lg px-4 hover:border-[#0048BC]/50 transition-colors">
          <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home size={20} className="text-blue-600" />
              </div>
              <span>Description</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Property Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setValue("description", e.target.value)}
                rows={6}
                className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                placeholder="Describe the property in detail..."
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* PROPERTY DETAILS */}
        <AccordionItem value="details" className="border border-gray-200 rounded-lg px-4 hover:border-[#0048BC]/50 transition-colors">
          <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Home size={20} className="text-green-600" />
              </div>
              <span>Property Details</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4 pb-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Year Built</Label>
                <Input
                  type="number"
                  value={form.year_built || ""}
                  onChange={(e) => setValue("year_built", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="2020"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Construction Type</Label>
                <Input
                  value={form.construction_type || ""}
                  onChange={(e) => setValue("construction_type", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="New construction"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Condition</Label>
                <Input
                  value={form.condition || ""}
                  onChange={(e) => setValue("condition", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="Excellent"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Equipment Quality</Label>
                <Input
                  value={form.equipment_quality || ""}
                  onChange={(e) => setValue("equipment_quality", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="High"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Community Fee (€/month)</Label>
                <Input
                  type="number"
                  value={form.community_fee || ""}
                  onChange={(e) => setValue("community_fee", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="150"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Property Tax (IBI) (€/year)</Label>
                <Input
                  type="number"
                  value={form.property_tax || ""}
                  onChange={(e) => setValue("property_tax", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="1200"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Garbage Fee (€/month)</Label>
                <Input
                  type="number"
                  value={form.garbage_fee || ""}
                  onChange={(e) => setValue("garbage_fee", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="25"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Last Renovation</Label>
                <Input
                  type="number"
                  value={form.last_renovation || ""}
                  onChange={(e) => setValue("last_renovation", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="2023"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Availability</Label>
                <Input
                  value={form.availability || ""}
                  onChange={(e) => setValue("availability", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="Available now"
                />
              </div>
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* DIMENSIONS & ROOMS */}
        <AccordionItem value="dimensions" className="border border-gray-200 rounded-lg px-4 hover:border-[#0048BC]/50 transition-colors">
          <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Ruler size={20} className="text-purple-600" />
              </div>
              <span>Dimensions & Rooms</span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pt-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Floors</Label>
                <Input
                  type="number"
                  value={form.floors || ""}
                  onChange={(e) => setValue("floors", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="3"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Floor / Block</Label>
                <Input
                  value={form.floor_block || ""}
                  onChange={(e) => setValue("floor_block", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="2nd Floor, Block A"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Bedrooms</Label>
                <Input
                  type="number"
                  value={form.bedrooms || ""}
                  onChange={(e) => setValue("bedrooms", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="3"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Bathrooms</Label>
                <Input
                  type="number"
                  value={form.bathrooms || ""}
                  onChange={(e) => setValue("bathrooms", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Usable Area (m²)</Label>
                <Input
                  type="number"
                  value={form.usable_area || ""}
                  onChange={(e) => setValue("usable_area", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="120"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Built Area (m²)</Label>
                <Input
                  type="number"
                  value={form.built_area || ""}
                  onChange={(e) => setValue("built_area", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="150"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Terrace (m²)</Label>
                <Input
                  type="number"
                  value={form.terrace_m2 || ""}
                  onChange={(e) => setValue("terrace_m2", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="20"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Garden (m²)</Label>
                <Input
                  type="number"
                  value={form.garden_m2 || ""}
                  onChange={(e) => setValue("garden_m2", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="50"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Parking Spaces</Label>
                <Input
                  type="number"
                  value={form.parking_spaces || ""}
                  onChange={(e) => setValue("parking_spaces", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Orientation</Label>
                <Input
                  value={form.orientation || ""}
                  onChange={(e) => setValue("orientation", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="South"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Views</Label>
                <Input
                  value={form.views || ""}
                  onChange={(e) => setValue("views", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="Sea view, Mountain view"
                />
              </div>
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* ENERGY CERTIFICATE */}
        <AccordionItem value="energy" className="border border-gray-200 rounded-lg px-4 hover:border-[#0048BC]/50 transition-colors">
          <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap size={20} className="text-yellow-600" />
              </div>
              <span>Energy Certificate</span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pt-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Energy Certificate Available</Label>
                <Input
                  placeholder="Yes / No"
                  value={form.energy_certificate_available || ""}
                  onChange={(e) => setValue("energy_certificate_available", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Energy Class</Label>
                <Input
                  placeholder="A, B, C, D, E, F, G"
                  value={form.energy_class || ""}
                  onChange={(e) => setValue("energy_class", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Certificate Issued At</Label>
                <Input
                  type="date"
                  value={form.certificate_issued_at || ""}
                  onChange={(e) => setValue("certificate_issued_at", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Certificate Expires At</Label>
                <Input
                  type="date"
                  value={form.certificate_expires_at || ""}
                  onChange={(e) => setValue("certificate_expires_at", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Heating Type</Label>
                <Input
                  placeholder="Electric, Gas, Solar..."
                  value={form.heating_type || ""}
                  onChange={(e) => setValue("heating_type", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Energy Consumption Index</Label>
                <Input
                  placeholder="kWh/m² per year"
                  value={form.energy_consumption_index || ""}
                  onChange={(e) => setValue("energy_consumption_index", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Main Energy Source</Label>
                <Input
                  placeholder="Electricity, Gas, Solar..."
                  value={form.main_energy_source || ""}
                  onChange={(e) => setValue("main_energy_source", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                />
              </div>
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* AGENT INFORMATION */}
        <AccordionItem value="agent" className="border border-gray-200 rounded-lg px-4 hover:border-[#0048BC]/50 transition-colors">
          <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <User size={20} className="text-indigo-600" />
              </div>
              <span>Agent Information</span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pt-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Agent Name</Label>
                <Input
                  value={form.agent_name || ""}
                  onChange={(e) => setValue("agent_name", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Agent Phone</Label>
                <Input
                  value={form.agent_phone || ""}
                  onChange={(e) => setValue("agent_phone", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Agent Email</Label>
                <Input
                  type="email"
                  value={form.agent_email || ""}
                  onChange={(e) => setValue("agent_email", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="agent@example.com"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Agent Photo URL</Label>
                <Input
                  value={form.agent_photo_url || ""}
                  onChange={(e) => setValue("agent_photo_url", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Agent Address</Label>
                <Input
                  value={form.agent_address || ""}
                  onChange={(e) => setValue("agent_address", e.target.value)}
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* MAIN FEATURES (TAGS) */}
        <AccordionItem value="features" className="border border-gray-200 rounded-lg px-4 hover:border-[#0048BC]/50 transition-colors">
          <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Plus size={20} className="text-pink-600" />
              </div>
              <span>Main Features</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Add Feature</Label>
                <Input
                  placeholder="Type a feature and press Enter to add"
                  className="border-gray-300 focus:border-[#0048BC] focus:ring-[#0048BC]/20"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value.length > 0) {
                        setValue(
                          "main_features",
                          [...(form.main_features || []), value]
                        );
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(form.main_features || []).map((feature: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#0048BC]/10 to-[#0066FF]/10 border border-[#0048BC]/20 px-4 py-2 rounded-full text-sm font-medium text-[#0048BC]"
                  >
                    {feature}
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-0.5 transition"
                      onClick={() => {
                        const updated = (form.main_features || []).filter(
                          (_: any, i: number) => i !== idx
                        );
                        setValue("main_features", updated);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* IMAGES */}
        <AccordionItem value="images" className="border border-gray-200 rounded-lg px-4 hover:border-[#0048BC]/50 transition-colors">
          <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <ImageIcon size={20} className="text-cyan-600" />
              </div>
              <span>Photos</span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pt-4 pb-6">
            <ImageUploader
              images={images}
              setImages={setImages}
              propertyId={createdId || "temp"}
            />
            {createdId && !isEdit && (
              <Button
                type="button"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 shadow-md hover:shadow-lg transition-all duration-200 mt-4"
                onClick={async () => {
                  await updatePropertyImages(createdId, images);
                  router.push("/dashboard/properties");
                }}
              >
                <CheckCircle2 size={18} className="mr-2 inline" />
                Finish & Save Photos
              </Button>
            )}
            {isEdit && (
              <Button
                type="button"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 shadow-md hover:shadow-lg transition-all duration-200 mt-4"
                onClick={async () => {
                  if (images.length > 0) {
                    await updatePropertyImages(propertyId!, images);
                  }
                  router.push("/dashboard/properties");
                }}
              >
                <CheckCircle2 size={18} className="mr-2 inline" />
                Update Photos
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <div className="pt-6 border-t border-gray-200 mt-6">
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#0048BC] to-[#0066FF] hover:from-[#003A99] hover:to-[#0048BC] text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <CheckCircle2 size={20} className="mr-2" />
          {isEdit ? "Update Property" : "Create Property"}
        </Button>
      </div>

    </form>
  );
}
