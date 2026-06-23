import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiPlay } from 'react-icons/hi';
import { getImageUrl } from '../api/tmdb';

const MovieCard = ({ item }) => {
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');

  if (item.media_type === 'person') {
    return (
      <Link to={`/person/${item.id}`} className="group block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 border border-white/10 group-hover:border-primary transition-colors">
          <img
            src={item.profile_path ? getImageUrl(item.profile_path, 'w342') : 'https://via.placeholder.com/342x513?text=No+Image'}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
        </div>
        <h4 className="font-bold text-sm truncate">{item.name}</h4>
        <p className="text-[10px] text-white/50 truncate uppercase tracking-tighter">{item.known_for_department}</p>
      </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/${mediaType}/${item.id}`} className="group block">
        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 border border-white/5 group-hover:border-primary/50 transition-all shadow-xl group-hover:shadow-neon-pink/20">
          <img
            src={item.poster_path ? getImageUrl(item.poster_path, 'w342') : 'https://via.placeholder.com/342x513?text=No+Poster'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center self-center mb-auto translate-y-4 group-hover:translate-y-0 transition-transform">
              <HiPlay className="text-background text-2xl" />
            </div>

            <div className="flex items-center justify-between mt-2">
               <div className="flex items-center gap-1">
                  <HiStar className="text-primary text-xs" />
                  <span className="text-[10px] font-bold">{item.vote_average?.toFixed(1)}</span>
               </div>
               <span className="text-[10px] font-bold text-white/50">{date ? new Date(date).getFullYear() : 'N/A'}</span>
            </div>
          </div>

          {/* Rating Badge (Always visible) */}
          <div className="absolute top-2 right-2 px-2 py-1 glass rounded-lg text-[10px] font-bold flex items-center gap-1">
            <HiStar className="text-primary" />
            {item.vote_average?.toFixed(1)}
          </div>
        </div>

        <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{mediaType === 'movie' ? 'Film' : 'Series'}</p>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
