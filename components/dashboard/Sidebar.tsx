"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-8">Regrow CRM</h2>

      <nav className="flex-1 space-y-4">
        <Link href="/dashboard" className="block hover:text-blue-600">
          Dashboard
        </Link>

        <Link href="/dashboard/properties" className="block hover:text-blue-600">
          Properties
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-8 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </aside>
  );
}
