"use server";

import { createSupabaseServer } from "@/lib/supabase";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getEmails(folder: string = 'sent') {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("emails")
    .select("*, contacts(full_name, email)")
    .eq("folder", folder)
    .order("created_at", { ascending: false });

  if (error) console.error(error);
  return data || [];
}

// --- ACTUALIZADO: Ahora acepta FormData para manejar archivos ---
export async function sendEmail(formData: FormData) {
  const supabase = await createSupabaseServer();
  
  const to = formData.get("to") as string;
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;
  const contact_id = formData.get("contact_id") as string;
  
  // Procesar Archivos adjuntos
  const files = formData.getAll("attachments") as File[];
  
  // Convertir archivos para Resend
  const attachments = await Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return {
        filename: file.name,
        content: buffer,
      };
    })
  );

  try {
    // A. Enviar vía Resend con adjuntos
    const { error: resendError } = await resend.emails.send({
      from: 'CRM User <onboarding@resend.dev>', // Recuerda cambiar esto en producción
      to: [to],
      subject: subject,
      html: body.replace(/\n/g, '<br>'),
      attachments: attachments.length > 0 ? attachments : undefined, // <--- Aquí va la magia
    });

    if (resendError) throw new Error(resendError.message);

    // B. Guardar en Base de Datos (Solo texto por ahora)
    // Nota: Guardar los archivos en DB requeriría Supabase Storage.
    // Por ahora guardamos el email, pero los adjuntos solo se envían.
    const { error: dbError } = await supabase.from("emails").insert({
      sender: "Me",
      recipient: to,
      subject,
      body, // Podríamos añadir "(Includes attachments)" al body si quisieras
      folder: 'sent',
      contact_id: contact_id !== "none" ? contact_id : null,
      read: true
    });

    if (dbError) throw dbError;

    revalidatePath("/dashboard/mailbox");
    return { success: true };

  } catch (error: any) {
    console.error("Email Error:", error);
    return { success: false, error: error.message };
  }
}