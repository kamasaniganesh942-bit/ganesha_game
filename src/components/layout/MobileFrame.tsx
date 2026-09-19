import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex justify-center bg-[#07030F] overflow-x-hidden selection:bg-amber-500 selection:text-white">
      {/* Ambient background glow for wide desktop/tablet screens */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-700 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500 rounded-full blur-[160px]" />
      </div>

      {/* Main Game Screen Container (Mobile Portrait default, max-w-md centered) */}
      <main className="relative w-full max-w-md min-h-screen flex flex-col bg-gradient-to-b from-[#160B29] via-[#10071F] to-[#0A0414] shadow-2xl border-x border-amber-500/15 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
