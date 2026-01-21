import DashboardHome from "@/components/dashboard/DashboardHome";
import { getDashboardStats } from "@/app/dashboard/actions"; // Importamos la nueva acción

export const dynamic = "force-dynamic"; // Para que siempre muestre datos frescos

export default async function Page() {
  // Obtenemos todos los datos reales de una sola vez
  const dashboardData = await getDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here is what's happening today.
        </p>
      </div>
      
      {/* Pasamos los datos al componente visual */}
      <DashboardHome data={dashboardData} />
    </div>
  );
}