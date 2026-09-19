import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex justify-center items-center bg-[#07030F] overflow-x-hidden selection:bg-amber-500 selection:text-white">
      {/* Ambient background glow for wide desktop/tablet screens */}
      <div className="fixed inset-0 pointer-events-none opacity-25">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-purple-700/30 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/20 rounded-full blur-[160px]" />
      </div>

      {/* Main Game Screen Container (Mobile-first full screen, sleek device framing on tablet/desktop) */}
      <main className="relative w-full max-w-md sm:max-w-lg min-h-screen sm:min-h-[844px] sm:max-h-[920px] flex flex-col bg-gradient-to-b from-[#160B29] via-[#10071F] to-[#0A0414] shadow-2xl sm:rounded-[36px] border-x sm:border border-amber-500/20 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

