import React from 'react';

export function DreamyBackground() {
  return (
    <div className="fixed inset-0 -z-50 h-full w-full overflow-hidden bg-white pointer-events-none">
      {/* Top Blue Gradient/Glow - Lighter blur on mobile */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-linear-to-b from-blue-100/60 via-blue-50/20 to-transparent blur-xl md:blur-3xl" />
      
      {/* Diagonal Light Beam (Top Left) - Lighter blur on mobile */}
      <div className="absolute -top-[10%] -left-[10%] h-[900px] w-[600px] rotate-45 bg-linear-to-b from-white via-white/80 to-transparent opacity-60 blur-lg md:blur-2xl" />

      {/* Minimalist Soft Orbs - Lighter blur on mobile */}
      {/* Soft Pink (Left) */}
      <div className="absolute top-[40%] left-[-5%] h-[400px] w-[400px] rounded-full bg-pink-200/40 blur-2xl md:blur-[100px]" />
      
      {/* Soft Purple (Right) */}
      <div className="absolute top-[50%] right-[-5%] h-[500px] w-[500px] rounded-full bg-blue-200/40 blur-2xl md:blur-[100px]" />
    </div>
  );
}

