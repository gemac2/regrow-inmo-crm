import React from "react";

interface LogoProps {
  className?: string;     // Para ajustar tamaños si hace falta
  showText?: boolean;     // Por si a veces quieres solo el icono
  lightMode?: boolean;    // Por si lo usas sobre fondo oscuro
}

export const Logo = ({ className = "", showText = true, lightMode = false }: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* --- ICONO: LA PIEDRA ANGULAR --- */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          {/* Base del cubo (Azul / Primary) */}
          <path 
            d="M12 21L4 16.5V7.5L12 3L20 7.5V16.5L12 21Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            className={lightMode ? "text-white" : "text-primary"}
          />
          <path 
            d="M12 3V12M12 21V12M4 7.5L12 12M20 7.5L12 12" 
            stroke="currentColor" 
            strokeWidth="2" 
            className={lightMode ? "text-white" : "text-primary"}
          />
          {/* La Piedra Angular (Dorado / Secondary) */}
          <path 
            d="M12 3L20 7.5L12 12L4 7.5L12 3Z" 
            fill="currentColor" 
            className="text-secondary" 
            fillOpacity="0.4" 
          />
        </svg>
      </div>

      {/* --- TEXTO --- */}
      {showText && (
        <div className={`text-2xl font-bold tracking-tight ${lightMode ? "text-white" : "text-primary"}`}>
          TheWay<span className={lightMode ? "text-blue-200" : "text-gray-900"}>CRM</span>
        </div>
      )}
    </div>
  );
};

export default Logo;