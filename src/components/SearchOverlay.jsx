import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center px-4"
        >
          <button
            onClick={onClose}
            className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full glass hover:text-primary transition-colors"
          >
            <HiOutlineX className="text-3xl" />
          </button>

          <div className="w-full max-w-2xl">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4 text-center">
              Search The Verse
            </h2>
            <form onSubmit={handleSubmit} className="relative">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Movies, anime, people..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-16 text-2xl font-poppins focus:outline-none focus:border-primary transition-colors shadow-neon-pink/10"
              />
              <HiOutlineSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-white/30" />
            </form>

            <div className="mt-8">
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Cyberpunk', 'Arcane', 'John Wick', 'Spider-Man', 'Attack on Titan'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setQuery(item);
                      navigate(`/search?q=${encodeURIComponent(item)}`);
                      onClose();
                    }}
                    className="px-4 py-2 glass rounded-lg text-xs font-medium hover:border-primary hover:text-primary transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
