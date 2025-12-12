import { supabaseBrowser } from "@/lib/supabase";

export default async function Home() {
  const { data, error } = await supabaseBrowser.from("properties").select("*").limit(5);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Regrow Inmo CRM</h1>

      <h2 className="mt-6 text-xl">Test de conexión a Supabase</h2>

      {error && (
        <p className="text-red-600 mt-4">
          Error: {error.message}
        </p>
      )}

      <pre className="mt-4 bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
