import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'horizontal' | 'vertical' | 'badge';
}

/**
 * High-precision vector component for "UNIDAD VETERINARIA" official logo
 * depicting the iconic 3 animal heads (bovine, equine, swine) in green circle.
 */
export const UnidadVeterinariaEmblem: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="250" cy="250" r="240" fill="#00823B" />

      {/* Main Animals Outline & Shapes (White outer boundary) */}
      <g fill="#FFFFFF" stroke="#FFFFFF">
        {/* Outer White Silhouette enclosing Cow, Horse & Pig */}
        <path
          d="
            M 250 80
            C 255 80 262 90 265 105
            C 285 100 295 105 305 125
            C 310 135 320 155 350 165
            C 390 170 415 180 435 220
            C 455 260 445 290 415 325
            C 385 355 340 340 310 335
            C 290 365 270 380 250 385
            C 230 380 210 365 190 335
            C 160 340 115 355 85 325
            C 55 290 45 260 65 220
            C 85 180 110 170 150 165
            C 180 155 190 135 195 125
            C 205 105 215 100 235 105
            C 238 90 245 80 250 80 Z
          "
          strokeWidth="12"
          strokeLinejoin="round"
        />
      </g>

      {/* Detail Green Layer overlaying white silhouette */}
      <g fill="#00823B" stroke="#00823B" strokeWidth="2">
        {/* Center Horse Head details */}
        {/* Jagged Mane Top */}
        <path d="M 230 110 L 240 130 L 250 115 L 260 130 L 270 110 L 280 145 L 270 160 L 230 160 L 220 145 Z" />
        
        {/* Horse Face Green Channels / Sides */}
        <path d="M 210 170 C 205 200 200 260 215 315 L 230 325 L 228 280 L 220 220 C 220 190 225 175 230 170 Z" />
        <path d="M 290 170 C 295 200 300 260 285 315 L 270 325 L 272 280 L 280 220 C 280 190 275 175 270 170 Z" />
        
        {/* Horse Nostrils */}
        <ellipse cx="232" cy="328" rx="6" ry="8" />
        <ellipse cx="268" cy="328" rx="6" ry="8" />

        {/* Left Cow Head Inner Green Contours */}
        <path
          d="
            M 195 180
            C 160 190 110 220 100 250
            C 95 265 95 275 102 280
            C 105 270 115 255 130 245
            C 150 235 180 225 198 215 Z
          "
        />
        {/* Cow eye slot */}
        <ellipse cx="140" cy="218" rx="5" ry="3" />

        {/* Right Pig Head Inner Green Contours */}
        <path
          d="
            M 305 180
            C 340 190 390 220 400 250
            C 405 265 405 275 398 280
            C 395 270 385 255 370 245
            C 350 235 320 225 302 215 Z
          "
        />
        {/* Pig eye slot */}
        <ellipse cx="360" cy="218" rx="5" ry="3" />
      </g>
    </svg>
  );
};

export const UnidadVeterinariaLogoHorizontal: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`inline-flex items-center gap-3 bg-[#00823B] text-white rounded-2xl p-2 pr-5 shadow-md border border-emerald-600/30 ${className}`}>
      {/* Badge Circle Icon */}
      <div className="w-11 h-11 shrink-0 bg-white/10 rounded-xl p-1 backdrop-blur-xs border border-white/20 flex items-center justify-center">
        <UnidadVeterinariaEmblem className="w-full h-full" />
      </div>

      {/* Text Branding */}
      <div className="flex flex-col justify-center leading-none">
        <span className="text-base sm:text-lg font-black tracking-wider uppercase font-sans text-white">
          UNIDAD
        </span>
        <span className="text-xs sm:text-sm font-extrabold tracking-widest uppercase font-sans text-emerald-100 mt-0.5">
          VETERINARIA
        </span>
      </div>
    </div>
  );
};

export const UnidadVeterinariaLogoVertical: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center text-center bg-[#00823B] text-white rounded-2xl p-4 shadow-lg border border-emerald-600/30 ${className}`}>
      {/* Big Badge Icon */}
      <UnidadVeterinariaEmblem className="w-20 h-20 mb-2" />

      {/* Text Box */}
      <div className="w-full bg-white text-[#00823B] font-black text-xl tracking-widest uppercase py-1 px-3 rounded-lg shadow-xs">
        UNIDAD
      </div>
      <div className="font-extrabold text-sm tracking-widest uppercase text-white mt-1.5">
        VETERINARIA
      </div>
    </div>
  );
};

export const UnidadVeterinariaLogoBadge: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <UnidadVeterinariaEmblem className="w-full h-full drop-shadow-md" />
    </div>
  );
};
