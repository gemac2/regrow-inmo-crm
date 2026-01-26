"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Inbox, Send, Archive, Trash2, Plus, Search, 
  Reply, Paperclip, Loader2, X, Eye, FileText, Code, Save, Check 
} from "lucide-react";
import { format } from "date-fns";
import { sendEmail, getComposeData, createTemplate } from "@/app/dashboard/mailbox/actions";
import { getProperties } from "@/app/dashboard/properties/actions"; 
import { toast } from "sonner";

export default function MailboxClient({ emails, contacts }: any) {
  const [selectedEmail, setSelectedEmail] = useState<any>(emails[0] || null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  // Estados del formulario
  const [to, setTo] = useState("");
  const [cc, setCc] = useState(""); 
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(""); 
  const [contactId, setContactId] = useState("none");
  const [attachments, setAttachments] = useState<File[]>([]); 
  
  // Datos servidor
  const [templates, setTemplates] = useState<any[]>([]);
  const [agentProfile, setAgentProfile] = useState<any>(null);

  // Estados Buscador Propiedades
  const [propSearch, setPropSearch] = useState("");
  const [propResults, setPropResults] = useState<any[]>([]);
  const [showPropResults, setShowPropResults] = useState(false);
  const [isSearchingProps, setIsSearchingProps] = useState(false);

  // Estado Modo HTML
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  // Estado Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // --- NUEVO: ESTADOS PARA GUARDAR PLANTILLA (UX MEJORADO) ---
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // 1. CARGAR DATOS
  useEffect(() => {
    if (isComposeOpen) {
      loadTemplates();
    }
  }, [isComposeOpen]);

  const loadTemplates = async () => {
    setIsLoadingTemplates(true);
    const data = await getComposeData();
    setTemplates(data.templates);
    setAgentProfile(data.agentProfile);
    setIsLoadingTemplates(false);
  };

  // Sincronizar editor visual
  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = body;
    }
  }, [body, isComposeOpen, isHtmlMode]);

  // --- NUEVO: GUARDAR PLANTILLA (INLINE) ---
  const confirmSaveTemplate = async () => {
    if (!newTemplateName.trim()) {
        toast.error("Please enter a name");
        return;
    }

    let contentToSave = body;
    if (!isHtmlMode && editorRef.current) {
        contentToSave = editorRef.current.innerHTML;
    }

    if (!contentToSave || contentToSave.trim() === "<br>") {
        toast.error("Cannot save an empty template");
        return;
    }

    const toastId = toast.loading("Saving template...");
    const result = await createTemplate(newTemplateName, contentToSave, "general");

    if (result.success) {
        toast.success("Template saved!", { id: toastId });
        loadTemplates(); 
        // Reset states
        setIsSavingTemplate(false);
        setNewTemplateName("");
    } else {
        toast.error("Error saving template", { id: toastId, description: result.error });
    }
  };

  // Funciones auxiliares
  const handlePropSearch = async (term: string) => {
    setPropSearch(term);
    if (term.length > 2) {
        setIsSearchingProps(true);
        setShowPropResults(true);
        const results = await getProperties({ query: term }); 
        setPropResults(results || []);
        setIsSearchingProps(false);
    } else { setShowPropResults(false); }
  };

  const attachProperty = (p: any) => {
    const propertyHtml = `<br /><div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; max-width: 400px; font-family: sans-serif; margin: 10px 0;">${p.images && p.images[0] ? `<img src="${p.images[0]}" style="width: 100%; height: 200px; object-fit: cover;" />` : ''}<div style="padding: 15px;"><h3 style="margin: 0 0 5px 0; color: #111;">${p.title}</h3><p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">${p.city} • ${p.bedrooms} Beds • ${p.usable_area} m²</p><p style="margin: 0; font-weight: bold; color: #0048BC; font-size: 16px;">${p.price?.toLocaleString()} €</p><br/><a href="https://thewaycrm.com/properties/${p.id}" style="background-color: #0048BC; color: white; padding: 8px 12px; text-decoration: none; border-radius: 4px; font-size: 13px;">View Details</a></div></div><br />`;
    setBody(body + propertyHtml);
    setPropSearch(""); setShowPropResults(false);
    toast.success("Property attached");
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    if (!templateId) return;
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    if (template.subject) setSubject(template.subject);
    let processedBody = template.body;
    if (agentProfile) {
        processedBody = processedBody.replace(/{{agent_name}}/g, agentProfile.full_name || 'Agent');
        processedBody = processedBody.replace(/{{agent_email}}/g, agentProfile.email || '');
    }
    setBody(processedBody);
    e.target.value = ""; 
    toast.success(`Template "${template.title}" inserted`);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const formData = new FormData();
    formData.append("to", to);
    if (cc) formData.append("cc", cc);
    formData.append("subject", subject);
    let finalBody = body;
    if (!isHtmlMode && editorRef.current) finalBody = editorRef.current.innerHTML;
    formData.append("body", finalBody);
    formData.append("contact_id", contactId);
    attachments.forEach((file) => formData.append("attachments", file));
    const toastId = toast.loading("Sending email...");
    const result = await sendEmail(formData);
    setSending(false);
    if (result.success) {
      setIsComposeOpen(false);
      toast.success("Email sent successfully!", { id: toastId });
      setTo(""); setCc(""); setShowCc(false); setSubject(""); setBody(""); setContactId("none"); setAttachments([]);
    } else {
      toast.error("Failed to send email", { id: toastId, description: result.error });
    }
  };
  
  const handleContactSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cId = e.target.value;
    const contact = contacts.find((c: any) => c.id === cId);
    setContactId(cId);
    if (contact) setTo(contact.email);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
  };
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };


  return (
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="w-16 md:w-48 bg-gray-50 border-r border-gray-200 flex flex-col py-4 shrink-0">
        <button onClick={() => setIsComposeOpen(true)} className="mx-3 mb-6 flex items-center justify-center md:justify-start gap-2 bg-[#0048BC] text-white p-3 md:px-4 md:py-2.5 rounded-lg shadow-sm hover:bg-[#003895] transition">
            <Plus size={20} /> <span className="hidden md:inline font-medium text-sm">Compose</span>
        </button>
        <nav className="space-y-1 px-2">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-medium transition"><Inbox size={18} /> <span className="hidden md:inline">Inbox</span></button>
            <button className="w-full flex items-center gap-3 px-3 py-2 bg-white text-[#0048BC] shadow-sm rounded-md text-sm font-medium transition"><Send size={18} /> <span className="hidden md:inline">Sent</span></button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md text-sm font-medium transition"><Archive size={18} /> <span className="hidden md:inline">Archived</span></button>
        </nav>
      </div>

      <div className="w-80 border-r border-gray-200 flex flex-col bg-white shrink-0">
        <div className="p-4 border-b border-gray-100">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="Search emails..." />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {emails.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No emails sent yet.</div> : emails.map((email: any) => (
                <div key={email.id} onClick={() => setSelectedEmail(email)} className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${selectedEmail?.id === email.id ? 'bg-blue-50/60 border-l-4 border-l-[#0048BC]' : 'border-l-4 border-l-transparent'}`}>
                    <div className="flex justify-between items-start mb-1"><span className="font-semibold text-gray-800 text-sm truncate w-32">{email.recipient}</span><span className="text-[10px] text-gray-400">{format(new Date(email.created_at), "MMM d")}</span></div>
                    <p className="text-sm text-gray-600 truncate mb-1">{email.subject}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{email.body}</p>
                </div>
            ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white min-w-0">
        {selectedEmail ? (
            <>
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">{selectedEmail.recipient.charAt(0).toUpperCase()}</div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedEmail.subject}</h2>
                            <div className="text-sm text-gray-500 flex flex-col sm:flex-row gap-1"><span>To: <span className="text-gray-900 font-medium">{selectedEmail.recipient}</span></span><span className="hidden sm:inline">•</span><span>{format(new Date(selectedEmail.created_at), "PPP p")}</span></div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="prose max-w-none text-gray-700 font-sans text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedEmail.body.replace(/\n/g, '<br>') }} />
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300"><Inbox size={64} className="mb-4 opacity-50" /><p>Select an email to read</p></div>
        )}
      </div>

      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b bg-gray-50 shrink-0">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">New Message</h3>
                    <div className="flex gap-2">
                        <button onClick={() => setIsPreviewOpen(true)} className="text-gray-500 hover:text-blue-600 flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-gray-200 transition"><Eye size={14}/> Preview</button>
                        <button onClick={() => setIsComposeOpen(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
                    {isPreviewOpen && (
                        <div className="absolute inset-0 bg-white z-20 p-8 overflow-y-auto flex flex-col animate-in slide-in-from-right-10">
                            <div className="flex justify-between items-center mb-6 pb-2 border-b">
                                <h2 className="text-xl font-bold text-gray-800">Email Preview</h2>
                                <button onClick={() => setIsPreviewOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={24}/></button>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-lg border shadow-sm prose max-w-none min-h-[300px]">
                                <div dangerouslySetInnerHTML={{ __html: !isHtmlMode && editorRef.current ? editorRef.current.innerHTML : body }} />
                            </div>
                        </div>
                    )}
                    <select className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" onChange={handleContactSelect} value={contactId}>
                        <option value="none">-- Quick Select Contact --</option>
                        {contacts.map((c: any) => (<option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>))}
                    </select>

                    <div className="space-y-2">
                        <div className="flex items-center border-b border-gray-200 pb-2 focus-within:border-blue-500 transition">
                            <span className="text-gray-500 w-16 text-sm shrink-0 font-medium">To</span>
                            <input required type="email" className="flex-1 outline-none text-sm" value={to} onChange={e => setTo(e.target.value)} placeholder="recipient@example.com" />
                            {!showCc && <button onClick={() => setShowCc(true)} className="text-xs text-gray-400 hover:text-blue-600 px-2 font-medium">CC</button>}
                        </div>
                        {showCc && (
                            <div className="flex items-center border-b border-gray-200 pb-2 focus-within:border-blue-500 transition animate-in slide-in-from-top-2">
                                <span className="text-gray-500 w-16 text-sm shrink-0 font-medium">CC</span>
                                <input type="text" className="flex-1 outline-none text-sm" value={cc} onChange={e => setCc(e.target.value)} placeholder="manager@example.com" />
                            </div>
                        )}
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center border-b border-gray-200 pb-2">
                            <span className="text-gray-500 w-16 text-sm shrink-0 font-medium">Props</span>
                            <div className="flex-1 flex items-center relative">
                                <Search size={14} className="mr-2 text-gray-400"/>
                                <input type="text" placeholder="Search properties to attach (type 3 chars)..." className="flex-1 outline-none text-sm" value={propSearch} onChange={(e) => handlePropSearch(e.target.value)} />
                                {isSearchingProps && <Loader2 size={14} className="animate-spin text-gray-400"/>}
                            </div>
                        </div>
                        {showPropResults && (
                            <div className="absolute top-full left-16 right-0 bg-white border border-gray-200 rounded-b-lg shadow-xl max-h-60 overflow-y-auto mt-1 z-20">
                                {propResults.length === 0 ? (<div className="p-3 text-xs text-gray-500">No properties found.</div>) : (propResults.map((p) => (
                                    <div key={p.id} onClick={() => attachProperty(p)} className="p-2 hover:bg-blue-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0">
                                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">{p.images && p.images[0] ? <img src={p.images[0]} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><Inbox size={12}/></div>}</div>
                                        <div className="flex-1 min-w-0"><div className="font-medium text-sm truncate text-gray-800">{p.title}</div><div className="text-xs text-gray-500">{p.city} • {p.price?.toLocaleString()} €</div></div>
                                        <Plus size={14} className="text-blue-600"/>
                                    </div>
                                )))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center border-b border-gray-200 pb-2 focus-within:border-blue-500 transition">
                        <input required type="text" placeholder="Subject" className="flex-1 outline-none font-bold text-gray-700 placeholder:font-normal" value={subject} onChange={e => setSubject(e.target.value)} />
                    </div>

                    {/* --- TOOLBAR INTELIGENTE --- */}
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-t-lg border border-b-0 border-gray-200 mt-4 min-h-[46px]">
                        {isSavingTemplate ? (
                            // MODO: Guardar Nombre de Plantilla
                            <div className="flex items-center gap-2 flex-1 animate-in fade-in slide-in-from-left-2">
                                <input 
                                    autoFocus
                                    type="text" 
                                    placeholder="Template name (e.g., Welcome Email)..." 
                                    className="flex-1 text-xs border border-blue-300 rounded px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newTemplateName}
                                    onChange={(e) => setNewTemplateName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && confirmSaveTemplate()}
                                />
                                <button onClick={confirmSaveTemplate} className="bg-green-600 text-white p-1 rounded hover:bg-green-700" title="Confirm Save"><Check size={14} /></button>
                                <button onClick={() => { setIsSavingTemplate(false); setNewTemplateName(""); }} className="bg-gray-300 text-gray-600 p-1 rounded hover:bg-gray-400" title="Cancel"><X size={14} /></button>
                            </div>
                        ) : (
                            // MODO: Toolbar Normal
                            <div className="flex items-center gap-2 animate-in fade-in">
                                <select className="bg-white border border-gray-300 text-gray-700 text-xs rounded px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-[200px]" onChange={handleTemplateSelect} disabled={isLoadingTemplates}>
                                    <option value="">Insert Template...</option>
                                    {isLoadingTemplates ? <option>Loading templates...</option> : (templates.map(t => (<option key={t.id} value={t.id}>{t.title}</option>)))}
                                </select>

                                {/* BOTÓN GUARDAR */}
                                <button 
                                    type="button" 
                                    onClick={() => setIsSavingTemplate(true)}
                                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 p-1.5 rounded transition"
                                    title="Save current text as Template"
                                >
                                    <Save size={16} />
                                </button>

                                <div className="h-4 w-px bg-gray-300 mx-1"></div>
                                
                                <button type="button" onClick={() => setIsHtmlMode(!isHtmlMode)} className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition ${isHtmlMode ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-200'}`}>
                                    {isHtmlMode ? <Code size={12}/> : <FileText size={12}/>} HTML Mode
                                </button>
                            </div>
                        )}
                        
                        {!isSavingTemplate && (
                           <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:bg-gray-200 p-1.5 rounded transition"><Paperclip size={16} /></button>
                        )}
                    </div>

                    <div className="flex-1 border border-gray-200 rounded-b-lg p-0 min-h-[250px] relative overflow-hidden">
                        {isHtmlMode ? (
                            <textarea className="w-full h-full outline-none resize-none p-4 font-mono text-xs bg-gray-900 text-green-400" placeholder="<html>...</html>" value={body} onChange={(e) => setBody(e.target.value)}/>
                        ) : (
                            <div ref={editorRef} className="w-full h-full outline-none p-4 font-sans text-sm overflow-y-auto prose max-w-none" contentEditable suppressContentEditableWarning onBlur={(e) => setBody(e.currentTarget.innerHTML)}></div>
                        )}
                    </div>
                    {attachments.length > 0 && (<div className="flex flex-wrap gap-2 pt-2">{attachments.map((file, idx) => (<div key={idx} className="flex items-center gap-1 bg-blue-50 border border-blue-100 px-2 py-1 rounded text-xs text-blue-700 shadow-sm"><Paperclip size={10}/><span className="truncate max-w-[150px]">{file.name}</span><button type="button" onClick={() => removeAttachment(idx)} className="ml-1 text-blue-400 hover:text-red-500"><X size={12} /></button></div>))}</div>)}
                    <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
                    <button onClick={() => setIsComposeOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Discard</button>
                    <button onClick={handleSend} disabled={sending} className="flex items-center gap-2 px-6 py-2 bg-[#0048BC] text-white rounded-lg text-sm font-medium hover:bg-[#003895] disabled:opacity-50 transition shadow-sm">{sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} Send Email</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}