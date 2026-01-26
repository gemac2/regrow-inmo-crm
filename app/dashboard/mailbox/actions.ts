"use server";

import { createSupabaseServer } from "@/lib/supabase-server";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY);

// --- 1. OBTENER EMAILS (Listado) ---
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

// --- 2. NUEVO: OBTENER DATOS PARA EL MODAL (Perfil + Plantillas) ---
export async function getComposeData() {
  const supabase = await createSupabaseServer();
  
  // A. Obtener usuario autenticado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { agentProfile: null, templates: [] };

  // B. Consultas en paralelo para velocidad
  const profileQuery = supabase
    .from('profiles')
    .select('full_name, email, avatar_url, role') // Agrega otros campos si tienes firma HTML
    .eq('id', user.id)
    .single();

  const templatesQuery = supabase
    .from('email_templates')
    .select('*')
    .order('category', { ascending: true }) // Agrupar por categoría
    .order('title', { ascending: true });   // Ordenar alfabéticamente

  const [profileRes, templatesRes] = await Promise.all([profileQuery, templatesQuery]);

  return {
    agentProfile: profileRes.data,
    templates: templatesRes.data || []
  };
}

// --- 3. ENVIAR EMAIL (Actualizado con CC y Adjuntos) ---
export async function sendEmail(formData: FormData) {
  const supabase = await createSupabaseServer();
  
  const to = formData.get("to") as string;
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;
  const contact_id = formData.get("contact_id") as string;
  
  // Nuevo: Obtener CC
  const ccString = formData.get("cc") as string;
  // Convertir string "a@a.com, b@b.com" a array ["a@a.com", "b@b.com"]
  const cc = ccString ? ccString.split(',').map(email => email.trim()) : undefined;

  // Procesar Archivos adjuntos
  const files = formData.getAll("attachments") as File[];
  
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
    // A. Enviar vía Resend
    const { error: resendError } = await resend.emails.send({
      from: 'TheWay CRM <noreply@thewaycrm.com>', 
      to: [to],
      cc: cc, // <--- Aquí inyectamos el CC
      subject: subject,
      html: body, // Ya no necesitamos replace(\n) si usas un Rich Text Editor que genera HTML
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (resendError) throw new Error(resendError.message);

    // B. Guardar en Base de Datos
    // Nota: Si quieres guardar el CC en la base de datos, tendrías que 
    // agregar la columna 'cc' a tu tabla 'emails' primero. 
    // Por ahora lo enviamos pero guardamos el registro básico.
    const { error: dbError } = await supabase.from("emails").insert({
      sender: "Me",
      recipient: to,
      subject,
      body, 
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

// --- 4. CREAR NUEVA PLANTILLA ---
export async function createTemplate(title: string, body: string, category: string = 'general') {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // --- DEBUGGING ---
  console.log("User found:", user?.id);
  console.log("Auth Error:", authError);
  // ----------------

  if (!user) return { success: false, error: "Unauthorized: No user found" };

  const { error } = await supabase
    .from('email_templates')
    .insert({
      agent_id: user.id,
      title,
      body,
      category,
      subject: title
    });

  if (error) {
    console.error("DB Insert Error:", error); // Ver error en consola
    return { success: false, error: error.message };
  }
  
  revalidatePath("/dashboard/mailbox"); 
  return { success: true };
}