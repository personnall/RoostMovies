import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center gap-6">
      {/* Neon Ring */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin shadow-neon-pink"></div>

        {/* Inner Glitch Square */}
        <div className="absolute inset-4 bg-accent/20 rounded-lg animate-pulse overflow-hidden">
          <div className="w-full h-1 bg-primary/40 absolute top-1/2 -translate-y-1/2 animate-glitch-line"></div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-xl font-poppins font-black tracking-[0.5em] text-white uppercase animate-pulse">
          Cine<span className="text-primary italic">Verse</span>
        </h2>
        <p className="text-[10px] font-bold text-primary/50 tracking-[0.3em] uppercase mt-2">
          Establishing Uplink...
        </p>
      </div>
    </div>
  );
};

export default Loader;
