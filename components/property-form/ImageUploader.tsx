"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import { X, UploadCloud, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  // Cambiamos los nombres para estandarizar con el formulario
  value?: string[]; // Hacemos que sea opcional para evitar el error
  onChange: (urls: string[]) => void;
  onRemove: (url: string) => void;
  propertyId?: string;
}

export default function ImageUploader({ 
  value = [], // Valor por defecto: Array vacío (ESTO ARREGLA EL ERROR DEL MAP)
  onChange, 
  onRemove,
  propertyId = "temp" // Fallback si es una propiedad nueva
}: ImageUploaderProps) {
  
  const [uploading, setUploading] = useState(false);

  // Aseguramos que images sea siempre un array
  const images = Array.isArray(value) ? value : [];

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        // Usamos un nombre único para evitar colisiones
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${propertyId}/${fileName}`;

        const { error: uploadError } = await supabaseBrowser.storage
          .from("property-images")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Error subiendo imagen:", uploadError);
          continue;
        }

        const { data: urlData } = supabaseBrowser.storage
          .from("property-images")
          .getPublicUrl(filePath);

        newUrls.push(urlData.publicUrl);
      }

      // Actualizamos el estado padre con las nuevas imágenes + las anteriores
      onChange([...images, ...newUrls]);

    } catch (error) {
      console.error("Error general:", error);
    } finally {
      setUploading(false);
      // Limpiamos el input para permitir subir el mismo archivo de nuevo si se desea
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-4">
      
      {/* Botón de subida estilizado */}
      <div>
        <label className={`
          flex flex-col items-center justify-center w-full h-32 
          border-2 border-dashed rounded-lg cursor-pointer 
          hover:bg-gray-50 transition-colors
          ${uploading ? 'border-blue-300 bg-blue-50 cursor-wait' : 'border-gray-300'}
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 mb-2 text-blue-500 animate-spin" />
                <p className="text-sm text-blue-500 font-medium">Uploading...</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            multiple 
            onChange={handleUpload} 
            disabled={uploading}
          />
        </label>
      </div>

      {/* Grid de imágenes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((url, idx) => (
            <div key={`${url}-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
              <img
                src={url}
                alt={`Property image ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Overlay oscuro al pasar el mouse */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

              <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}