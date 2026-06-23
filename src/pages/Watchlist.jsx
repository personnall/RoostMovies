import React from 'react';

const Watchlist = () => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h1 className="text-4xl font-poppins font-black uppercase tracking-tighter mb-12 italic">
          Scheduled: <span className="text-accent">Watchlist</span>
        </h1>
        <div className="glass py-20 rounded-3xl border border-dashed border-white/10">
           <p className="text-white/40">Your queue is currently empty.</p>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
