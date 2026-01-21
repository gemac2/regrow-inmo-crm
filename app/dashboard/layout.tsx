// app/dashboard/layout.tsx
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 1. Header Fijo Arriba */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Sidebar Fijo a la Izquierda */}
        <Sidebar />

        {/* 3. Área Principal de Contenido (Aquí se renderizarán las pages) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}