"use client";

import Link from "next/link";
import { Edit2, Phone, Mail, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ContactsTable({ contacts }: { contacts: any[] }) {
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-purple-100 text-purple-700 hover:bg-purple-200";
      case "buyer": return "bg-green-100 text-green-700 hover:bg-green-200";
      case "tenant": return "bg-orange-100 text-orange-700 hover:bg-orange-200";
      default: return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 font-medium border-b">
          <tr>
            <th className="px-6 py-4">Name / Company</th>
            <th className="px-6 py-4">Contact Info</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-gray-50 transition group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                    {contact.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{contact.full_name}</div>
                    {contact.company && <div className="text-xs text-gray-500">{contact.company}</div>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1 text-gray-600">
                  {contact.email && (
                    <div className="flex items-center gap-2 text-xs">
                      <Mail size={14} className="text-gray-400" /> {contact.email}
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-xs">
                      <Phone size={14} className="text-gray-400" /> {contact.phone}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge className={`shadow-none border-0 ${getRoleColor(contact.role)}`}>
                  {contact.role}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${
                  contact.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                }`}></span>
                <span className="capitalize text-gray-600">{contact.status}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link 
                  href={`/dashboard/contacts/${contact.id}`} 
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <Edit2 size={16} />
                </Link>
              </td>
            </tr>
          ))}
          {contacts.length === 0 && (
             <tr>
               <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                 <User size={48} className="mx-auto mb-3 text-gray-300" />
                 <p>No contacts found. Create your first one!</p>
               </td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}