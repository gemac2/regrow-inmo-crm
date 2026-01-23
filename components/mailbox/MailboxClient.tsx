"use client";

import { useState, useRef } from "react";
import { 
  Inbox, Send, Archive, Trash2, Plus, Search, 
  Reply, Paperclip, Loader2, X 
} from "lucide-react";
import { format } from "date-fns";
import { sendEmail } from "@/app/dashboard/mailbox/actions";
import { toast } from "sonner"; // <--- Importamos toast de Sonner

export default function MailboxClient({ emails, contacts }: any) {
  const [selectedEmail, setSelectedEmail] = useState<any>(emails[0] || null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [sending, setSending] = useState(false);

  // Estados del formulario
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [contactId, setContactId] = useState("none");
  const [attachments, setAttachments] = useState<File[]>([]); 

  // Referencia al input invisible
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Creamos FormData para enviar archivos + texto
    const formData = new FormData();
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("body", body);
    formData.append("contact_id", contactId);
    
    // Adjuntamos cada archivo
    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    // 1. Iniciamos el toast de carga
    const toastId = toast.loading("Sending email...");

    const result = await sendEmail(formData);

    setSending(false);
    
    if (result.success) {
      setIsComposeOpen(false);
      
      // 2. ÉXITO: Actualizamos el toast a verde
      toast.success("Email sent successfully!", {
        id: toastId,
        description: `Message sent to ${to}`,
        duration: 4000,
      });

      // Reset total
      setTo(""); setSubject(""); setBody(""); setContactId("none"); setAttachments([]);
    } else {
      // 3. ERROR: Actualizamos el toast a rojo
      toast.error("Failed to send email", {
        id: toastId,
        description: result.error,
      });
    }
  };

  const handleContactSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cId = e.target.value;
    const contact = contacts.find((c: any) => c.id === cId);
    setContactId(cId);
    if (contact) setTo(contact.email);
  };

  // Manejar selección de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  // Eliminar un adjunto de la lista
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* 1. SIDEBAR */}
      <div className="w-16 md:w-48 bg-gray-50 border-r border-gray-200 flex flex-col py-4 shrink-0">
        <button 
            onClick={() => setIsComposeOpen(true)}
            className="mx-3 mb-6 flex items-center justify-center md:justify-start gap-2 bg-[#0048BC] text-white p-3 md:px-4 md:py-2.5 rounded-lg shadow-sm hover:bg-[#003895] transition"
        >
            <Plus size={20} />
            <span className="hidden md:inline font-medium text-sm">Compose</span>
        </button>

        <nav className="space-y-1 px-2">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-medium transition">
                <Inbox size={18} /> <span className="hidden md:inline">Inbox</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 bg-white text-[#0048BC] shadow-sm rounded-md text-sm font-medium transition">
                <Send size={18} /> <span className="hidden md:inline">Sent</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-medium transition">
                <Archive size={18} /> <span className="hidden md:inline">Archived</span>
            </button>
        </nav>
      </div>

      {/* 2. LISTA DE EMAILS */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white shrink-0">
        <div className="p-4 border-b border-gray-100">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="Search emails..." />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {emails.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No emails sent yet.</div>
            ) : (
                emails.map((email: any) => (
                    <div 
                        key={email.id} 
                        onClick={() => setSelectedEmail(email)}
                        className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${selectedEmail?.id === email.id ? 'bg-blue-50/60 border-l-4 border-l-[#0048BC]' : 'border-l-4 border-l-transparent'}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-gray-800 text-sm truncate w-32">{email.recipient}</span>
                            <span className="text-[10px] text-gray-400">{format(new Date(email.created_at), "MMM d")}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-1">{email.subject}</p>
                        <p className="text-xs text-gray-400 line-clamp-2">{email.body}</p>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* 3. LECTURA */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        {selectedEmail ? (
            <>
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                            {selectedEmail.recipient.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedEmail.subject}</h2>
                            <div className="text-sm text-gray-500 flex flex-col sm:flex-row gap-1">
                                <span>To: <span className="text-gray-900 font-medium">{selectedEmail.recipient}</span></span>
                                <span className="hidden sm:inline">•</span>
                                <span>{format(new Date(selectedEmail.created_at), "PPP p")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500" title="Reply"><Reply size={18} /></button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500" title="Delete"><Trash2 size={18} /></button>
                    </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {selectedEmail.body}
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                <Inbox size={64} className="mb-4 opacity-50" />
                <p>Select an email to read</p>
            </div>
        )}
      </div>

      {/* --- MODAL DE REDACCIÓN --- */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:pr-6 pointer-events-none">
            <div className="bg-white w-full sm:w-[500px] h-[600px] shadow-2xl rounded-t-xl sm:rounded-xl border border-gray-200 pointer-events-auto flex flex-col animate-in slide-in-from-bottom-10 duration-300">
                
                {/* Header */}
                <div className="flex justify-between items-center p-3 bg-gray-900 text-white rounded-t-xl">
                    <span className="font-semibold text-sm pl-2">New Message</span>
                    <button onClick={() => setIsComposeOpen(false)} className="text-gray-400 hover:text-white p-1">✕</button>
                </div>

                <form onSubmit={handleSend} className="flex-1 flex flex-col p-4 space-y-3 overflow-hidden">
                    
                    <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                        onChange={handleContactSelect}
                        value={contactId}
                    >
                        <option value="none">-- Select Contact (Optional) --</option>
                        {contacts.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
                        ))}
                    </select>

                    <input 
                        required
                        type="email" 
                        placeholder="To: recipient@example.com" 
                        className="w-full border-b border-gray-100 py-2 text-sm focus:outline-none focus:border-blue-500"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                    />
                    
                    <input 
                        required
                        type="text" 
                        placeholder="Subject" 
                        className="w-full border-b border-gray-100 py-2 text-sm font-medium focus:outline-none focus:border-blue-500"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                    />

                    <textarea 
                        required
                        className="flex-1 resize-none text-sm focus:outline-none p-2 mt-2" 
                        placeholder="Write your message here..."
                        value={body}
                        onChange={e => setBody(e.target.value)}
                    />

                    {/* LISTA DE ADJUNTOS (Chips) */}
                    {attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-2 py-1 bg-gray-50 rounded border border-gray-100">
                            {attachments.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded text-xs text-gray-600 shadow-sm">
                                    <span className="truncate max-w-[150px]">{file.name}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => removeAttachment(idx)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer con botón de Clip real */}
                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                        <div>
                            {/* Input oculto */}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                multiple 
                                onChange={handleFileChange}
                            />
                            {/* Botón que activa el input */}
                            <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-gray-400 hover:bg-gray-100 p-2 rounded transition"
                                title="Attach files"
                            >
                                <Paperclip size={18} />
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            disabled={sending}
                            className="bg-[#0048BC] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#003895] flex items-center gap-2 disabled:opacity-50"
                        >
                            {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}