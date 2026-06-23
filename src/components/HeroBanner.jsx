import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { HiPlay, HiInformationCircle } from 'react-icons/hi';
import { getImageUrl } from '../api/tmdb';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroBanner = ({ movies, isLoading }) => {
  if (isLoading) {
    return <div className="h-[70vh] md:h-[85vh] w-full bg-white/5 animate-pulse" />;
  }

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full -mt-32">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="h-full w-full"
      >
        {movies?.slice(0, 5).map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={getImageUrl(movie.backdrop_path)}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full container mx-auto px-4 md:px-8 flex flex-col justify-center max-w-3xl pt-20">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="inline-block px-3 py-1 glass rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-4">
                    Featured Content
                  </span>
                  <h1 className="text-4xl md:text-7xl font-poppins font-black mb-4 leading-tight tracking-tighter">
                    {movie.title}
                  </h1>
                  <p className="text-white/60 text-sm md:text-lg mb-8 line-clamp-3 md:line-clamp-none">
                    {movie.overview}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={`/movie/${movie.id}`}
                      className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-neon-pink"
                    >
                      <HiPlay className="text-2xl" />
                      Watch Now
                    </Link>
                    <Link
                      to={`/movie/${movie.id}`}
                      className="flex items-center gap-2 glass text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all"
                    >
                      <HiInformationCircle className="text-2xl" />
                      Details
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/30">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </div>
  );
};

export default HeroBanner;
