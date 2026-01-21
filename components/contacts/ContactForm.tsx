"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createContact, updateContact } from "@/app/contacts/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, ArrowLeft } from "lucide-react";

interface ContactFormProps {
  initialData?: any;
  isEdit?: boolean;
}

// Helper visual para filas
const FormRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="grid grid-cols-12 gap-4 items-center mb-4">
    <div className="col-span-12 md:col-span-3">
      <Label className="text-gray-500 font-normal text-sm">{label}</Label>
    </div>
    <div className="col-span-12 md:col-span-9">
      {children}
    </div>
  </div>
);

export default function ContactForm({ initialData, isEdit = false }: ContactFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState(initialData || {
    full_name: "",
    email: "",
    phone: "",
    role: "buyer",
    status: "active",
    company: "",
    address: "",
    city: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateContact(initialData.id, formData);
      } else {
        await createContact(formData);
      }
      router.push("/dashboard/contacts");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-10">
      
      {/* Header Sticky */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-white py-4 border-b z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" type="button" onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Edit Contact" : "New Contact"}
          </h1>
        </div>
        <Button type="submit" disabled={loading} className="bg-[#0048BC] hover:bg-[#003895] text-white">
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
          Save Contact
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Columna Izquierda: Datos Personales */}
        <div>
          <h3 className="text-sm font-bold uppercase text-gray-400 mb-6 tracking-wider">Personal Details</h3>
          
          <FormRow label="Full Name *">
            <Input name="full_name" required value={formData.full_name} onChange={handleChange} className="bg-gray-50" placeholder="e.g. Juan Pérez" />
          </FormRow>

          <FormRow label="Role">
            <Select value={formData.role} onValueChange={(v) => handleSelect("role", v)}>
              <SelectTrigger className="bg-gray-50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buyer (Interessent)</SelectItem>
                <SelectItem value="owner">Owner (Eigentümer)</SelectItem>
                <SelectItem value="tenant">Tenant (Inquilino)</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
              </SelectContent>
            </Select>
          </FormRow>

           <FormRow label="Status">
            <Select value={formData.status} onValueChange={(v) => handleSelect("status", v)}>
              <SelectTrigger className="bg-gray-50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="lead">Lead / Prospect</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </FormRow>

          <FormRow label="Company">
            <Input name="company" value={formData.company} onChange={handleChange} className="bg-gray-50" placeholder="Optional" />
          </FormRow>
        </div>

        {/* Columna Derecha: Contacto y Dirección */}
        <div>
          <h3 className="text-sm font-bold uppercase text-gray-400 mb-6 tracking-wider">Contact Info</h3>
          
          <FormRow label="Email">
            <Input type="email" name="email" value={formData.email} onChange={handleChange} className="bg-gray-50" placeholder="user@example.com" />
          </FormRow>

          <FormRow label="Phone">
            <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="bg-gray-50" placeholder="+34 600..." />
          </FormRow>

          <div className="border-t border-gray-100 my-6"></div>

          <FormRow label="City">
            <Input name="city" value={formData.city} onChange={handleChange} className="bg-gray-50" />
          </FormRow>

          <FormRow label="Address">
            <Textarea name="address" value={formData.address} onChange={handleChange} className="bg-gray-50 resize-none" rows={2} />
          </FormRow>

          <FormRow label="Internal Notes">
            <Textarea name="notes" value={formData.notes} onChange={handleChange} className="bg-yellow-50 border-yellow-200 text-yellow-800" placeholder="Private notes..." rows={3} />
          </FormRow>
        </div>

      </div>
    </form>
  );
}