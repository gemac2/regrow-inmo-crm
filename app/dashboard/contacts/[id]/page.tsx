import { getContact } from "@/app/contacts/actions";
import ContactForm from "@/components/contacts/ContactForm";

export default async function EditContactPage({ params }: any) {
  // En Next.js 15, recuerda que params es una promesa
  const { id } = await params;
  const contact = await getContact(id);

  if (!contact) {
    return <div>Contact not found</div>;
  }

  return (
    <div className="py-6">
      <ContactForm initialData={contact} isEdit={true} />
    </div>
  );
}