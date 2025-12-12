import PropertyForm from "@/components/property-form/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Property</h1>
      <PropertyForm />
    </div>
  );
}
