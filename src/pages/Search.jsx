import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiFilter, HiCollection, HiUser, HiFilm } from 'react-icons/hi';
import { tmdbServices } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('movie'); // movie, tv, person

  const { data: movies, isLoading: moviesLoading } = useQuery({
    queryKey: ['search-movie', query],
    queryFn: () => tmdbServices.searchMovies(query),
    enabled: !!query && activeTab === 'movie',
  });

  const { data: tv, isLoading: tvLoading } = useQuery({
    queryKey: ['search-tv', query],
    queryFn: () => tmdbServices.searchTV(query),
    enabled: !!query && activeTab === 'tv',
  });

  const { data: people, isLoading: peopleLoading } = useQuery({
    queryKey: ['search-person', query],
    queryFn: () => tmdbServices.searchPeople(query),
    enabled: !!query && activeTab === 'person',
  });

  const isLoading = moviesLoading || tvLoading || peopleLoading;

  const tabs = [
    { id: 'movie', label: 'Movies', icon: HiFilm },
    { id: 'tv', label: 'TV Shows', icon: HiCollection },
    { id: 'person', label: 'People', icon: HiUser },
  ];

  const results = activeTab === 'movie' ? movies?.results : activeTab === 'tv' ? tv?.results : people?.results;

  return (
    <div className="min-h-screen bg-background text-white pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8">

        {/* Search Header */}
        <div className="mb-12 space-y-8">
          <div>
            <h1 className="text-sm font-bold text-primary uppercase tracking-[0.4em] mb-2">Search Results for</h1>
            <h2 className="text-4xl md:text-6xl font-poppins font-black tracking-tighter uppercase italic">
              "{query}"
            </h2>
          </div>

          {/* Filters/Tabs */}
          <div className="flex flex-wrap gap-4 border-b border-white/5 pb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-background shadow-neon-pink'
                    : 'glass hover:bg-white/10'
                }`}
              >
                <tab.icon className="text-xl" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20"
            >
              <Loader />
            </motion.div>
          ) : results?.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
            >
              {results.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <MovieCard item={{ ...item, media_type: activeTab }} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 glass rounded-3xl border border-dashed border-white/10"
            >
              <HiSearch className="text-8xl text-white/10 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2 uppercase tracking-widest">No Transmissions Found</h3>
              <p className="text-white/40 max-w-md mx-auto">
                The database has no record of your query in this sector. Try adjusting your search parameters.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Search;
