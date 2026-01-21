"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

export default function PropertyGallery({ images }: { images: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Asegurarnos de que images sea un array válido
  const galleryImages = Array.isArray(images) ? images : [];
  const totalImages = galleryImages.length;

  // --- LÓGICA DE NAVEGACIÓN ---
  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    // Bloquear scroll del body
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = useCallback((e?: any) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const prevImage = useCallback((e?: any) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  // Soporte para teclado (Esc, Flechas)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextImage, prevImage]);

  if (totalImages === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
        <div className="flex flex-col items-center">
          <ImageIcon size={48} />
          <span>No images available</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* --- GRID DE IMÁGENES (VISTA PRINCIPAL) --- */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-xl overflow-hidden cursor-pointer">
        
        {/* IMAGEN PRINCIPAL (Ocupa mitad izquierda) */}
        <div 
            className="col-span-2 row-span-2 relative group"
            onClick={() => openGallery(0)}
        >
          <Image
            src={galleryImages[0]}
            alt="Main property"
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
        </div>

        {/* IMÁGENES LATERALES */}
        <div className="col-span-2 row-span-2 grid grid-cols-2 grid-rows-2 gap-2">
            {/* Foto 2 */}
            {totalImages > 1 && (
                <div className="relative group" onClick={() => openGallery(1)}>
                     <Image src={galleryImages[1]} alt="View 2" fill className="object-cover group-hover:scale-105 transition duration-500" />
                </div>
            )}
            
            {/* Foto 3 */}
            {totalImages > 2 && (
                <div className="relative group" onClick={() => openGallery(2)}>
                     <Image src={galleryImages[2]} alt="View 3" fill className="object-cover group-hover:scale-105 transition duration-500" />
                </div>
            )}

            {/* Foto 4 */}
            {totalImages > 3 && (
                <div className="relative group" onClick={() => openGallery(3)}>
                     <Image src={galleryImages[3]} alt="View 4" fill className="object-cover group-hover:scale-105 transition duration-500" />
                </div>
            )}

            {/* Foto 5 + Overlay de "Ver más" */}
            {totalImages > 4 && (
                <div className="relative group" onClick={() => openGallery(4)}>
                     <Image src={galleryImages[4]} alt="View 5" fill className="object-cover group-hover:scale-105 transition duration-500" />
                     {/* Overlay si hay más de 5 fotos */}
                     {totalImages > 5 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] group-hover:bg-black/70 transition">
                             <span className="text-white font-bold text-xl flex items-center gap-2">
                                +{totalImages - 5} photos
                             </span>
                        </div>
                     )}
                </div>
            )}
        </div>
      </div>

      {/* --- LIGHTBOX (MODAL PANTALLA COMPLETA) --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
            
            {/* Botón Cerrar */}
            <button 
                onClick={closeGallery}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 p-2 rounded-full transition z-50"
            >
                <X size={32} />
            </button>

            {/* Botón Anterior */}
            <button 
                onClick={prevImage}
                className="absolute left-4 text-white/70 hover:text-white bg-white/10 p-3 rounded-full transition z-50 hover:bg-white/20"
            >
                <ChevronLeft size={40} />
            </button>

            {/* Imagen Central */}
            <div className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center">
                <Image
                    src={galleryImages[currentIndex]}
                    alt={`Gallery image ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    quality={100}
                />
            </div>

            {/* Botón Siguiente */}
            <button 
                onClick={nextImage}
                className="absolute right-4 text-white/70 hover:text-white bg-white/10 p-3 rounded-full transition z-50 hover:bg-white/20"
            >
                <ChevronRight size={40} />
            </button>

            {/* Contador */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 bg-black/50 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                {currentIndex + 1} / {totalImages}
            </div>
            
            {/* Miniaturas (Opcional, tira inferior) */}
            <div className="absolute bottom-4 right-4 hidden md:flex gap-2">
                {galleryImages.slice(Math.max(0, currentIndex - 2), Math.min(totalImages, currentIndex + 3)).map((img, idx) => {
                    const realIdx = galleryImages.indexOf(img); // Simple find
                    return (
                        <div 
                            key={realIdx} 
                            onClick={() => setCurrentIndex(realIdx)}
                            className={`relative w-16 h-12 rounded overflow-hidden cursor-pointer border-2 ${realIdx === currentIndex ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}
                        >
                            <Image src={img} alt="thumb" fill className="object-cover" />
                        </div>
                    )
                })}
            </div>
        </div>
      )}
    </>
  );
}