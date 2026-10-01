import React from 'react';

interface RobloxLogoSvgProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const RobloxLogoSvg: React.FC<RobloxLogoSvgProps> = ({
  className = '',
  size = 64,
  glow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow if enabled */}
      {glow && (
        <div
          className="absolute inset-0 rounded-2xl bg-white/10 blur-xl pointer-events-none transform -rotate-12 scale-110"
        />
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative transform -rotate-12 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
      >
        <defs>
          {/* Chrome / Silver metallic gradients */}
          <linearGradient id="robloxOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#e4e4e7" />
            <stop offset="70%" stopColor="#a1a1aa" />
            <stop offset="100%" stopColor="#52525b" />
          </linearGradient>

          <linearGradient id="robloxBevelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#71717a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#18181b" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="robloxHoleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#09090b" />
            <stop offset="60%" stopColor="#18181b" />
            <stop offset="100%" stopColor="#27272a" />
          </linearGradient>

          <filter id="innerBevel" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* 3D Base Drop / Extrusion Layer */}
        <rect
          x="12"
          y="18"
          width="76"
          height="76"
          rx="15"
          fill="#18181b"
          opacity="0.9"
        />

        {/* Main Tilted Block Outer Body */}
        <rect
          x="10"
          y="10"
          width="80"
          height="80"
          rx="16"
          fill="url(#robloxOuterGrad)"
          stroke="url(#robloxBevelGrad)"
          strokeWidth="3.5"
        />

        {/* Specular Edge Highlight */}
        <path
          d="M 26 12 L 74 12 C 82 12 88 18 88 26 L 88 38 L 84 34 L 84 26 C 84 21 80 17 74 17 L 26 17 Z"
          fill="#ffffff"
          opacity="0.8"
        />

        {/* Inner Cutout Bevel Border */}
        <rect
          x="35"
          y="35"
          width="30"
          height="30"
          rx="6"
          fill="none"
          stroke="#52525b"
          strokeWidth="2"
        />

        {/* Inner Cutout Hole */}
        <rect
          x="37"
          y="37"
          width="26"
          height="26"
          rx="5"
          fill="url(#robloxHoleGrad)"
          stroke="#000000"
          strokeWidth="2"
          filter="url(#innerBevel)"
        />

        {/* Hole Inner Shadow Depth */}
        <path
          d="M 38 38 L 62 38 L 60 42 L 42 42 L 42 60 L 38 62 Z"
          fill="#000000"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};
