import { getEmails } from "@/app/dashboard/mailbox/actions";
import { getSelectOptions } from "@/app/dashboard/tasks/actions"; // Reutilizamos para obtener contactos
import MailboxClient from "@/components/mailbox/MailboxClient";

export const dynamic = "force-dynamic";

export default async function MailboxPage() {
  // Traemos los emails (por ahora solo 'sent') y los contactos para el autocompletado
  const emails = await getEmails('sent');
  const { contacts } = await getSelectOptions();

  return (
    <div className="h-[calc(100vh-40px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Mailbox</h1>
        <p className="text-gray-500 text-sm">Send and track client communications.</p>
      </div>
      
      <MailboxClient 
        emails={emails || []} 
        contacts={contacts || []} 
      />
    </div>
  );
}