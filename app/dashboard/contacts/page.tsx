import { getContacts } from "@/app/contacts/actions";
import ContactsTable from "@/components/contacts/ContactsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500 mt-1">Manage your clients, owners, and partners.</p>
        </div>
        <Link href="/dashboard/contacts/new">
          <Button className="bg-[#0048BC] hover:bg-[#003895]">
            <Plus className="mr-2 h-4 w-4" /> New Contact
          </Button>
        </Link>
      </div>

      <ContactsTable contacts={contacts || []} />
    </div>
  );
}