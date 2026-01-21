// app/dashboard/page.tsx
import DashboardHome from "@/components/dashboard/DashboardHome";
import { getProperties } from "@/app/dashboard/properties/actions";

export default async function Page() {
  const properties = await getProperties(); // Carga datos reales

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
      </div>
      <DashboardHome properties={properties || []} />
    </div>
  );
}