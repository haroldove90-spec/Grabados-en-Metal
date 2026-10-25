import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  align?: 'left' | 'center';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  align = 'left',
  className = ''
}) => {
  const iconDimensions = {
    sm: { w: 32, h: 32 },
    md: { w: 42, h: 42 },
    lg: { w: 56, h: 56 },
    xl: { w: 76, h: 76 }
  }[size];

  const titleSizes = {
    sm: 'text-base font-black tracking-wider',
    md: 'text-xl font-black tracking-wide',
    lg: 'text-2xl font-black tracking-wide',
    xl: 'text-3xl font-black tracking-wide'
  }[size];

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  }[size];

  return (
    <div className={`flex items-center gap-3.5 select-none ${align === 'center' ? 'justify-center flex-col sm:flex-row text-center sm:text-left' : 'justify-start'} ${className}`}>
      {/* Unencapsulated Vector Logomark: Open geometric silhouette of precision chisel, CNC milling diamond, and injection mold geometry */}
      <svg
        width={iconDimensions.w}
        height={iconDimensions.h}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105 drop-shadow-[0_2px_10px_rgba(2,132,199,0.25)]"
      >
        <defs>
          <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="40%" stopColor="#cbd5e1" />
            <stop offset="70%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="brassTipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>

        {/* Technical Coordinate Crosshairs (No boundary capsule) */}
        <line x1="50" y1="4" x2="50" y2="96" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1="4" y1="50" x2="96" y2="50" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        {/* Left Polished Steel Facet (Letter M/Chisel bevel) */}
        <path
          d="M24 78 L24 32 L50 14 L50 40 L35 50 L35 78 Z"
          fill="url(#bladeGrad)"
          stroke="#334155"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Right Mold Cavity Facet (Injection/Plastics angle) */}
        <path
          d="M76 78 L76 32 L50 14 L50 40 L65 50 L65 78 Z"
          fill="#1e293b"
          stroke="#0284c7"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Center Laser / Diamond V-Carve Core */}
        <polygon
          points="50,22 62,44 50,66 38,44"
          fill="url(#laserBeamGrad)"
          stroke="#ffffff"
          strokeWidth="1.2"
        />

        {/* Machining Burr / High-speed CNC spindle tip */}
        <polygon
          points="50,46 55,56 50,86 45,56"
          fill="url(#brassTipGrad)"
          stroke="#78350f"
          strokeWidth="1"
        />

        {/* Precision Laser Etching concentric arcs */}
        <path
          d="M38 72 Q50 82 62 72"
          stroke="#0284c7"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M32 78 Q50 90 68 78"
          stroke="#38bdf8"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* Top Zero-Point Indicator */}
        <circle cx="50" cy="14" r="3.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`text-slate-900 uppercase font-black font-sans tracking-tight ${titleSizes}`}>
            Grabados <span className="text-cyan-600 font-extrabold">en Metal</span>
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-2 mt-1">
            <span className={`font-mono font-semibold uppercase tracking-widest text-slate-500 ${subSizes}`}>
              Moldes • Inyección • Envases • CNC
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
