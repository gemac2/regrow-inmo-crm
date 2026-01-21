"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProperty, updateProperty } from "@/app/dashboard/properties/actions";
import ImageUploader from "./ImageUploader";

// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, X, Plus } from "lucide-react";

interface PropertyFormProps {
  initialData?: any;
  propertyId?: string;
  isEdit?: boolean;
}

// Helper para filas de formulario (Label izquierda - Input derecha)
const FormRow = ({ label, children, className = "" }: { label: string, children: React.ReactNode, className?: string }) => (
  <div className={`grid grid-cols-12 gap-4 items-center mb-3 ${className}`}>
    <div className="col-span-4 lg:col-span-3">
      <Label className="text-gray-500 font-normal text-sm">{label}</Label>
    </div>
    <div className="col-span-8 lg:col-span-9">
      {children}
    </div>
  </div>
);

// Helper para secciones
const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-8 border-b pb-6 last:border-0">
    <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide">{title}</h3>
    {children}
  </div>
);

export default function PropertyForm({ initialData, propertyId, isEdit = false }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [featureInput, setFeatureInput] = useState("");

  // Estado inicial con TODOS los campos
  const [formData, setFormData] = useState(initialData || {
    // Master Data
    reference: "",
    title: "",
    status: "available",
    category: "sale",
    property_type: "apartment",
    availability: "Immediate",
    description: "",

    // Address & Location
    address: "",
    city: "",
    zip_code: "",
    country: "Spain",
    orientation: "",
    views: "",

    // Specs & Building
    year_built: "",
    construction_type: "Existing",
    condition: "Good",
    equipment_quality: "Standard",
    last_renovation: "",
    floors: "",
    floor_block: "",

    // Areas
    usable_area: "",
    built_area: "",
    terrace_m2: "",
    garden_m2: "",
    parking_spaces: "",
    bedrooms: "",
    bathrooms: "",

    // Financials
    price: "",
    community_fee: "", // Mensual
    property_tax: "",  // IBI Anual
    garbage_fee: "",   // Anual

    // Energy Certificate
    energy_certificate_available: "yes",
    energy_class: "",
    energy_consumption_index: "",
    heating_type: "",
    main_energy_source: "",
    certificate_issued_at: "",
    certificate_expires_at: "",

    // Agent
    agent_name: "",
    agent_email: "",
    agent_phone: "",
    agent_address: "",
    agent_photo_url: "",

    // Extras
    images: [],
    main_features: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData((prev: any) => ({ ...prev, images: urls }));
  };

  // Manejo de Features (Tags)
  const addFeature = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (featureInput.trim()) {
        setFormData((prev: any) => ({
          ...prev,
          main_features: [...(prev.main_features || []), featureInput.trim()]
        }));
        setFeatureInput("");
      }
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      main_features: prev.main_features.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convertir strings numéricos a números reales
      const payload = {
        ...formData,
        price: Number(formData.price) || 0,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        usable_area: Number(formData.usable_area) || 0,
        built_area: Number(formData.built_area) || 0,
        terrace_m2: Number(formData.terrace_m2) || 0,
        garden_m2: Number(formData.garden_m2) || 0,
        year_built: Number(formData.year_built) || null,
        floors: Number(formData.floors) || null,
        parking_spaces: Number(formData.parking_spaces) || 0,
        community_fee: Number(formData.community_fee) || 0,
        property_tax: Number(formData.property_tax) || 0,
        garbage_fee: Number(formData.garbage_fee) || 0,
        last_renovation: Number(formData.last_renovation) || null,
      };

      if (isEdit && propertyId) {
        await updateProperty(propertyId, payload);
      } else {
        await createProperty(payload);
      }
      router.push("/dashboard/properties");
      router.refresh();
    } catch (error) {
      console.error("Error saving property:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-white p-6 pb-20">
      
      {/* --- STICKY HEADER --- */}
      <div className="flex items-center justify-between py-4 px-1 mb-6 border-b border-gray-100 sticky top-0 bg-white z-10 shadow-sm">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">
             {isEdit ? "Edit Property" : "New Property"}
           </h1>
           <p className="text-xs text-gray-500 mt-1">
             {formData.reference ? `Ref: ${formData.reference}` : "Fill in the details"}
           </p>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={loading} className="bg-[#0048BC] hover:bg-[#003895] text-white">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Object
          </Button>
        </div>
      </div>

      {/* --- GRID LAYOUT --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* === COLUMNA IZQUIERDA (60%) === */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* 1. MASTER DATA */}
          <FormSection title="Master Data">
            <FormRow label="Reference">
              <Input name="reference" value={formData.reference} onChange={handleChange} className="bg-gray-50 font-mono" placeholder="REF-001" />
            </FormRow>
            
            <FormRow label="Headline*">
              <Input name="title" value={formData.title} onChange={handleChange} className="bg-gray-50 font-bold" placeholder="E.g. Luxury Villa in Marbella" required />
            </FormRow>

            <FormRow label="Type / Status">
              <div className="flex gap-2">
                 <Select value={formData.property_type} onValueChange={(v) => handleSelectChange("property_type", v)}>
                  <SelectTrigger className="bg-gray-50"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                  <SelectTrigger className="bg-gray-50"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FormRow>
            
            <FormRow label="Availability">
               <Input name="availability" value={formData.availability} onChange={handleChange} className="bg-gray-50" placeholder="e.g. Upon agreement" />
            </FormRow>

            <FormRow label="Description">
              <Textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={6} 
                className="bg-gray-50 resize-none" 
                placeholder="Full description..." 
              />
            </FormRow>
          </FormSection>

          {/* 2. ADDRESS & BUILDING */}
          <FormSection title="Location & Building">
            <FormRow label="Address">
               <Input name="address" value={formData.address} onChange={handleChange} className="bg-gray-50" placeholder="Street name and number" />
            </FormRow>
            
            <FormRow label="City / Zip">
              <div className="flex gap-2">
                <Input name="city" value={formData.city} onChange={handleChange} className="bg-gray-50 flex-1" placeholder="City" />
                <Input name="zip_code" value={formData.zip_code} onChange={handleChange} className="bg-gray-50 w-28" placeholder="Zip" />
              </div>
            </FormRow>

            <FormRow label="Views / Orient.">
              <div className="flex gap-2">
                <Input name="views" value={formData.views} onChange={handleChange} className="bg-gray-50 flex-1" placeholder="e.g. Sea View" />
                <Input name="orientation" value={formData.orientation} onChange={handleChange} className="bg-gray-50 flex-1" placeholder="e.g. South" />
              </div>
            </FormRow>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormRow label="Year Built">
                <Input type="number" name="year_built" value={formData.year_built} onChange={handleChange} className="bg-gray-50" />
              </FormRow>
              <FormRow label="Renovated">
                 <Input type="number" name="last_renovation" value={formData.last_renovation} onChange={handleChange} className="bg-gray-50" placeholder="Year" />
              </FormRow>
            </div>

            <FormRow label="Condition">
               <div className="flex gap-2">
                 <Input name="condition" value={formData.condition} onChange={handleChange} className="bg-gray-50" placeholder="e.g. Good" />
                 <Input name="equipment_quality" value={formData.equipment_quality} onChange={handleChange} className="bg-gray-50" placeholder="Quality (High/Std)" />
               </div>
            </FormRow>
            
            <FormRow label="Floor Info">
               <div className="flex gap-2">
                 <Input name="floors" value={formData.floors} onChange={handleChange} className="bg-gray-50" placeholder="Total Floors" />
                 <Input name="floor_block" value={formData.floor_block} onChange={handleChange} className="bg-gray-50" placeholder="Floor/Block" />
               </div>
            </FormRow>
          </FormSection>

          {/* 3. ENERGY CERTIFICATE */}
          <FormSection title="Energy Efficiency">
            <FormRow label="Certified?">
               <Select value={formData.energy_certificate_available} onValueChange={(v) => handleSelectChange("energy_certificate_available", v)}>
                  <SelectTrigger className="bg-gray-50 w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="in_process">In Process</SelectItem>
                  </SelectContent>
                </Select>
            </FormRow>

            {formData.energy_certificate_available === "yes" && (
              <>
                <FormRow label="Class / Index">
                  <div className="flex gap-2">
                    <Input name="energy_class" value={formData.energy_class} onChange={handleChange} className="bg-gray-50 w-20 text-center font-bold" placeholder="A" />
                    <Input name="energy_consumption_index" value={formData.energy_consumption_index} onChange={handleChange} className="bg-gray-50 flex-1" placeholder="kWh/m²a" />
                  </div>
                </FormRow>
                <FormRow label="Heating / Src">
                  <div className="flex gap-2">
                     <Input name="heating_type" value={formData.heating_type} onChange={handleChange} className="bg-gray-50" placeholder="Type (Underfloor)" />
                     <Input name="main_energy_source" value={formData.main_energy_source} onChange={handleChange} className="bg-gray-50" placeholder="Source (Gas/Solar)" />
                  </div>
                </FormRow>
                 <FormRow label="Valid Dates">
                  <div className="flex gap-2">
                     <Input type="date" name="certificate_issued_at" value={formData.certificate_issued_at} onChange={handleChange} className="bg-gray-50" />
                     <span className="self-center text-gray-400">-</span>
                     <Input type="date" name="certificate_expires_at" value={formData.certificate_expires_at} onChange={handleChange} className="bg-gray-50" />
                  </div>
                </FormRow>
              </>
            )}
          </FormSection>

          {/* 4. IMAGES */}
          <FormSection title="Media Gallery">
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6">
              <ImageUploader 
                value={formData.images || []}
                onChange={handleImagesChange}
                onRemove={(url) => {
                  setFormData((prev:any) => ({
                    ...prev,
                    images: prev.images.filter((img: string) => img !== url)
                  }));
                }}
                propertyId={propertyId}
              />
            </div>
          </FormSection>

        </div>

        {/* === COLUMNA DERECHA (40%) === */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* 5. PRICE & FINANCIALS */}
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
             <h3 className="text-[#0048BC] font-bold mb-4 uppercase text-sm tracking-wide">Financial Details</h3>
             
             <FormRow label="Price (€)">
                <Input type="number" name="price" value={formData.price} onChange={handleChange} className="bg-white border-blue-200 text-lg font-bold text-[#0048BC]" placeholder="0" />
             </FormRow>

             <FormRow label="Community">
                <div className="relative">
                  <Input type="number" name="community_fee" value={formData.community_fee} onChange={handleChange} className="bg-white" placeholder="0" />
                  <span className="absolute right-3 top-2 text-xs text-gray-400">/month</span>
                </div>
             </FormRow>

             <FormRow label="IBI (Tax)">
                <div className="relative">
                  <Input type="number" name="property_tax" value={formData.property_tax} onChange={handleChange} className="bg-white" placeholder="0" />
                  <span className="absolute right-3 top-2 text-xs text-gray-400">/year</span>
                </div>
             </FormRow>

             <FormRow label="Garbage">
                <div className="relative">
                   <Input type="number" name="garbage_fee" value={formData.garbage_fee} onChange={handleChange} className="bg-white" placeholder="0" />
                   <span className="absolute right-3 top-2 text-xs text-gray-400">/year</span>
                </div>
             </FormRow>
          </div>

          {/* 6. AREAS & ROOMS */}
          <FormSection title="Areas & Specs">
             <FormRow label="Bedrooms">
                <Input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="bg-gray-50" />
             </FormRow>
             <FormRow label="Bathrooms">
                <Input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="bg-gray-50" />
             </FormRow>
             
             <div className="border-t border-gray-100 my-4 pt-4"></div>

             <FormRow label="Usable Area">
                <div className="relative">
                  <Input type="number" name="usable_area" value={formData.usable_area} onChange={handleChange} className="bg-gray-50 pr-8" />
                  <span className="absolute right-3 top-2 text-gray-400 text-xs">m²</span>
                </div>
             </FormRow>

             <FormRow label="Built Area">
                <div className="relative">
                  <Input type="number" name="built_area" value={formData.built_area} onChange={handleChange} className="bg-gray-50 pr-8" />
                  <span className="absolute right-3 top-2 text-gray-400 text-xs">m²</span>
                </div>
             </FormRow>

             <FormRow label="Terrace">
                <div className="relative">
                  <Input type="number" name="terrace_m2" value={formData.terrace_m2} onChange={handleChange} className="bg-gray-50 pr-8" />
                  <span className="absolute right-3 top-2 text-gray-400 text-xs">m²</span>
                </div>
             </FormRow>

             <FormRow label="Garden">
                <div className="relative">
                   <Input type="number" name="garden_m2" value={formData.garden_m2} onChange={handleChange} className="bg-gray-50 pr-8" />
                   <span className="absolute right-3 top-2 text-gray-400 text-xs">m²</span>
                </div>
             </FormRow>

             <FormRow label="Parking">
                <Input type="number" name="parking_spaces" value={formData.parking_spaces} onChange={handleChange} className="bg-gray-50" placeholder="Slots" />
             </FormRow>
          </FormSection>

          {/* 7. AGENT */}
          <FormSection title="Agent Assignment">
             <FormRow label="Name">
                <Input name="agent_name" value={formData.agent_name} onChange={handleChange} className="bg-gray-50" placeholder="Agent Name" />
             </FormRow>
             <FormRow label="Phone">
                <Input name="agent_phone" value={formData.agent_phone} onChange={handleChange} className="bg-gray-50" placeholder="+34..." />
             </FormRow>
             <FormRow label="Email">
                <Input name="agent_email" value={formData.agent_email} onChange={handleChange} className="bg-gray-50" placeholder="email@..." />
             </FormRow>
             <FormRow label="Photo URL">
                <Input name="agent_photo_url" value={formData.agent_photo_url} onChange={handleChange} className="bg-gray-50 text-xs" placeholder="https://..." />
             </FormRow>
          </FormSection>

          {/* 8. FEATURES TAGS */}
          <FormSection title="Features">
            <div className="flex gap-2 mb-3">
              <Input 
                value={featureInput} 
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={addFeature}
                className="bg-gray-50" 
                placeholder="Type feature + Enter" 
              />
              <Button type="button" size="icon" variant="outline" onClick={() => {
                if(featureInput.trim()) {
                  setFormData((prev: any) => ({ ...prev, main_features: [...(prev.main_features || []), featureInput.trim()] }));
                  setFeatureInput("");
                }
              }}>
                <Plus size={16} />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {(formData.main_features || []).map((feature: string, idx: number) => (
                <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {feature}
                  <button type="button" onClick={() => removeFeature(idx)} className="ml-1.5 text-blue-400 hover:text-blue-600">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </FormSection>

        </div>
      </div>
    </form>
  );
}