import { getContact } from "@/app/contacts/actions";
import ContactForm from "@/components/contacts/ContactForm";
import { addToHistory } from "@/app/dashboard/recent/actions";

export default async function EditContactPage({ params }: any) {
  // En Next.js 15, recuerda que params es una promesa
  const { id } = await params;
  const contact = await getContact(id);

  if (!contact) {
    return <div>Contact not found</div>;
  }

  addToHistory({ contact_id: id }).catch(console.error);

  return (
    <div className="py-6">
      <ContactForm initialData={contact} isEdit={true} />
    </div>
  );
}