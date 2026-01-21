import PropertyForm from "@/components/property-form/PropertyForm";

export default function NewPropertyPage() {
  return (
    // Usamos 'w-full' para que ocupe el espacio disponible junto al sidebar
    <div className="w-full max-w-[1600px] mx-auto p-6">
      <PropertyForm />
    </div>
  );
}