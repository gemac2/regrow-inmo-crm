"use client";

import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProperty } from "@/app/properties/actions";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { updatePropertyImages } from "@/app/properties/actions";

export default function PropertyForm() {
  const router = useRouter();

  const [form, setForm] = useState<any>({
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

  });

  const [images, setImages] = useState([]);
  const [createdId, setCreatedId] = useState<string | null>(null);


  function setValue(key: string, value: any) {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    // 1. Crear propiedad sin imágenes
    const newId = await createProperty({
      ...form,
      price: Number(form.price),
      images: []  // empty value by default
    });

    setCreatedId(newId);
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">

      <Accordion type="multiple" className="w-full space-y-4">

        {/* GENERAL INFORMATION */}
        <AccordionItem value="general">
          <AccordionTrigger className="text-lg font-semibold">
            General Information
          </AccordionTrigger>
          <AccordionContent className="space-y-4">

            <div>
              <Label>Reference</Label>
              <Input
                value={form.reference}
                onChange={(e) => setValue("reference", e.target.value)}
              />
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setValue("title", e.target.value)}
              />
            </div>

            <div>
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={(e) => setValue("city", e.target.value)}
              />
            </div>

            <div>
              <Label>Price (€)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setValue("price", e.target.value)}
              />
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* DESCRIPTION SECTION */}
        <AccordionItem value="description">
          <AccordionTrigger className="text-lg font-semibold">
            Description
          </AccordionTrigger>
          <AccordionContent className="space-y-4">

            <div>
              <Label>Property Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setValue("description", e.target.value)}
                rows={6}
              />
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* PROPERTY DETAILS */}
        <AccordionItem value="details">
          <AccordionTrigger className="text-lg font-semibold">
            Property Details
          </AccordionTrigger>

          <AccordionContent className="space-y-4">

            <div>
              <Label>Year Built</Label>
              <Input
                type="number"
                value={form.year_built || ""}
                onChange={(e) => setValue("year_built", e.target.value)}
              />
            </div>

            <div>
              <Label>Construction Type</Label>
              <Input
                value={form.construction_type || ""}
                onChange={(e) => setValue("construction_type", e.target.value)}
              />
            </div>

            <div>
              <Label>Condition</Label>
              <Input
                value={form.condition || ""}
                onChange={(e) => setValue("condition", e.target.value)}
              />
            </div>

            <div>
              <Label>Equipment Quality</Label>
              <Input
                value={form.equipment_quality || ""}
                onChange={(e) => setValue("equipment_quality", e.target.value)}
              />
            </div>

            <div>
              <Label>Community Fee</Label>
              <Input
                value={form.community_fee || ""}
                onChange={(e) => setValue("community_fee", e.target.value)}
              />
            </div>

            <div>
              <Label>Property Tax (IBI)</Label>
              <Input
                value={form.property_tax || ""}
                onChange={(e) => setValue("property_tax", e.target.value)}
              />
            </div>

            <div>
              <Label>Garbage Fee</Label>
              <Input
                value={form.garbage_fee || ""}
                onChange={(e) => setValue("garbage_fee", e.target.value)}
              />
            </div>

            <div>
              <Label>Last Renovation</Label>
              <Input
                value={form.last_renovation || ""}
                onChange={(e) => setValue("last_renovation", e.target.value)}
              />
            </div>

            <div>
              <Label>Availability</Label>
              <Input
                value={form.availability || ""}
                onChange={(e) => setValue("availability", e.target.value)}
              />
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* DIMENSIONS & ROOMS */}
        <AccordionItem value="dimensions">
          <AccordionTrigger className="text-lg font-semibold">
            Dimensions & Rooms
          </AccordionTrigger>

          <AccordionContent className="space-y-4">

            <div>
              <Label>Floors</Label>
              <Input
                type="number"
                value={form.floors || ""}
                onChange={(e) => setValue("floors", e.target.value)}
              />
            </div>

            <div>
              <Label>Floor / Block</Label>
              <Input
                value={form.floor_block || ""}
                onChange={(e) => setValue("floor_block", e.target.value)}
              />
            </div>

            <div>
              <Label>Bedrooms</Label>
              <Input
                type="number"
                value={form.bedrooms || ""}
                onChange={(e) => setValue("bedrooms", e.target.value)}
              />
            </div>

            <div>
              <Label>Bathrooms</Label>
              <Input
                type="number"
                value={form.bathrooms || ""}
                onChange={(e) => setValue("bathrooms", e.target.value)}
              />
            </div>

            <div>
              <Label>Usable Area (m²)</Label>
              <Input
                type="number"
                value={form.usable_area || ""}
                onChange={(e) => setValue("usable_area", e.target.value)}
              />
            </div>

            <div>
              <Label>Built Area (m²)</Label>
              <Input
                type="number"
                value={form.built_area || ""}
                onChange={(e) => setValue("built_area", e.target.value)}
              />
            </div>

            <div>
              <Label>Terrace (m²)</Label>
              <Input
                type="number"
                value={form.terrace_m2 || ""}
                onChange={(e) => setValue("terrace_m2", e.target.value)}
              />
            </div>

            <div>
              <Label>Garden (m²)</Label>
              <Input
                type="number"
                value={form.garden_m2 || ""}
                onChange={(e) => setValue("garden_m2", e.target.value)}
              />
            </div>

            <div>
              <Label>Parking Spaces</Label>
              <Input
                type="number"
                value={form.parking_spaces || ""}
                onChange={(e) => setValue("parking_spaces", e.target.value)}
              />
            </div>

            <div>
              <Label>Orientation</Label>
              <Input
                value={form.orientation || ""}
                onChange={(e) => setValue("orientation", e.target.value)}
              />
            </div>

            <div>
              <Label>Views</Label>
              <Input
                value={form.views || ""}
                onChange={(e) => setValue("views", e.target.value)}
              />
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* ENERGY CERTIFICATE */}
        <AccordionItem value="energy">
          <AccordionTrigger className="text-lg font-semibold">
            Energy Certificate
          </AccordionTrigger>

          <AccordionContent className="space-y-4">

            <div>
              <Label>Energy Certificate Available</Label>
              <Input
                placeholder="yes / no"
                value={form.energy_certificate_available || ""}
                onChange={(e) => setValue("energy_certificate_available", e.target.value)}
              />
            </div>

            <div>
              <Label>Certificate Issued At</Label>
              <Input
                type="date"
                value={form.certificate_issued_at || ""}
                onChange={(e) => setValue("certificate_issued_at", e.target.value)}
              />
            </div>

            <div>
              <Label>Energy Class</Label>
              <Input
                placeholder="A, B, C, D, E, F, G"
                value={form.energy_class || ""}
                onChange={(e) => setValue("energy_class", e.target.value)}
              />
            </div>

            <div>
              <Label>Certificate Expires At</Label>
              <Input
                type="date"
                value={form.certificate_expires_at || ""}
                onChange={(e) => setValue("certificate_expires_at", e.target.value)}
              />
            </div>

            <div>
              <Label>Heating Type</Label>
              <Input
                placeholder="electric, gas, solar..."
                value={form.heating_type || ""}
                onChange={(e) => setValue("heating_type", e.target.value)}
              />
            </div>

            <div>
              <Label>Energy Consumption Index</Label>
              <Input
                placeholder="kWh/m² per year"
                value={form.energy_consumption_index || ""}
                onChange={(e) => setValue("energy_consumption_index", e.target.value)}
              />
            </div>

            <div>
              <Label>Main Energy Source</Label>
              <Input
                placeholder="electricity, gas, solar..."
                value={form.main_energy_source || ""}
                onChange={(e) => setValue("main_energy_source", e.target.value)}
              />
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* AGENT INFORMATION */}
        <AccordionItem value="agent">
          <AccordionTrigger className="text-lg font-semibold">
            Agent Information
          </AccordionTrigger>

          <AccordionContent className="space-y-4">

            <div>
              <Label>Agent Name</Label>
              <Input
                value={form.agent_name || ""}
                onChange={(e) => setValue("agent_name", e.target.value)}
              />
            </div>

            <div>
              <Label>Agent Phone</Label>
              <Input
                value={form.agent_phone || ""}
                onChange={(e) => setValue("agent_phone", e.target.value)}
              />
            </div>

            <div>
              <Label>Agent Email</Label>
              <Input
                type="email"
                value={form.agent_email || ""}
                onChange={(e) => setValue("agent_email", e.target.value)}
              />
            </div>

            <div>
              <Label>Agent Address</Label>
              <Input
                value={form.agent_address || ""}
                onChange={(e) => setValue("agent_address", e.target.value)}
              />
            </div>

            <div>
              <Label>Agent Photo URL</Label>
              <Input
                value={form.agent_photo_url || ""}
                onChange={(e) => setValue("agent_photo_url", e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* MAIN FEATURES (TAGS) */}
        <AccordionItem value="features">
          <AccordionTrigger className="text-lg font-semibold">
            Main Features
          </AccordionTrigger>

          <AccordionContent className="space-y-4">

            <div className="space-y-2">
              <Label>Add Feature</Label>
              <Input
                placeholder="Type a feature and press Enter"
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

            <div className="flex flex-wrap gap-2 mt-3">
              {(form.main_features || []).map((feature: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {feature}
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
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

          </AccordionContent>
        </AccordionItem>

        {/* IMAGES */}
        <AccordionItem value="images">
          <AccordionTrigger className="text-lg font-semibold">
            Photos
          </AccordionTrigger>

          <AccordionContent className="space-y-4">
            <ImageUploader
              images={images}
              setImages={setImages}
              propertyId={createdId || "temp"}
            />
            {createdId && (
              <Button
                type="button"
                className="w-full bg-green-600 text-white"
                onClick={async () => {
                  await updatePropertyImages(createdId, images);
                  router.push("/properties");
                }}
              >
                Finish & Save Photos
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <Button type="submit" className="w-full">
        Save Property
      </Button>

    </form>
  );
}
