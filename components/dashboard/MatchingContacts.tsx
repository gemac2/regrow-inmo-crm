"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { User, Phone, Mail } from "lucide-react";

export default function MatchingContacts({ propertyId }: { propertyId: string }) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      // Calling the RPC function (make sure the SQL function exists in Supabase)
      const { data, error } = await supabaseBrowser
        .rpc("match_property_to_contacts", { property_id: propertyId });

      if (error) console.error(error);
      else setContacts(data || []);
      
      setLoading(false);
    }

    fetchMatches();
  }, [propertyId]);

  if (loading) return <div className="text-sm text-gray-500">Searching for buyers...</div>;

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <User size={18} className="text-[#0048BC]" />
          Matching Buyers ({contacts.length})
        </h3>
      </div>
      
      <div className="max-h-60 overflow-y-auto">
        {contacts.length === 0 ? (
          <p className="p-4 text-sm text-gray-500 text-center">No matching profiles found for this property.</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Match</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.contact_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.full_name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      c.match_score >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {c.match_score}%
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3 text-gray-500">
                    {c.phone && <a href={`tel:${c.phone}`} title="Call"><Phone size={16} className="hover:text-blue-600"/></a>}
                    {c.email && <a href={`mailto:${c.email}`} title="Email"><Mail size={16} className="hover:text-blue-600"/></a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}