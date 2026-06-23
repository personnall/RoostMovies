import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlay, HiPlus, HiHeart, HiStar, HiClock, HiCalendar, HiTrendingUp } from 'react-icons/hi';
import { RiShareForwardFill } from 'react-icons/ri';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { tmdbServices, getImageUrl } from '../api/tmdb';
import { useDynamicTheme } from '../context/DynamicThemeContext';
import Loader from '../components/Loader';
import SectionSlider from '../components/SectionSlider';

import 'swiper/css';
import 'swiper/css/free-mode';

const MovieDetails = () => {
  const { id } = useParams();
  const { updateThemeColor } = useDynamicTheme();

  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => tmdbServices.getMovieDetails(id),
  });

  const { data: credits } = useQuery({
    queryKey: ['movie-credits', id],
    queryFn: () => tmdbServices.getMovieCredits(id),
  });

  const { data: recommendations } = useQuery({
    queryKey: ['movie-recommendations', id],
    queryFn: () => tmdbServices.getMovieRecommendations(id),
  });

  // Calculate AI Match Score
  const aiMatch = useMemo(() => {
    if (!movie) return 0;
    const base = movie.vote_average * 10;
    const popularityBonus = Math.min(movie.popularity / 500, 5);
    return Math.min(Math.round(base + popularityBonus), 99);
  }, [movie]);

  // Determine Heat Level
  const heatLevel = useMemo(() => {
    if (!movie) return 'COLD';
    if (movie.popularity > 2000) return 'VIRAL';
    if (movie.popularity > 500) return 'HOT';
    return 'TRENDING';
  }, [movie]);

  if (isLoading) return <Loader />;
  if (isError) return <div className="h-screen flex items-center justify-center text-red-500">Failed to load movie data.</div>;

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Parallax Backdrop */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={getImageUrl(movie.backdrop_path)}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/20" />
        </motion.div>

        {/* Floating Particles (Fake via overlay) */}
        <div className="absolute inset-0 z-1 pointer-events-none opacity-30">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-12 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

            {/* Poster - Desktop Only */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:block lg:col-span-3"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="relative rounded-2xl shadow-2xl w-full border border-white/10"
                />
              </div>
            </motion.div>

            {/* Info */}
            <div className="lg:col-span-9 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
              >
                {/* AI Match Badge */}
                <div className="relative px-4 py-1 rounded-full border border-primary/50 bg-primary/10 backdrop-blur-md overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative text-xs font-bold text-primary tracking-widest uppercase">
                    {aiMatch}% Match
                  </span>
                </div>

                {/* Heat Badge */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black tracking-widest uppercase">
                  <HiTrendingUp />
                  {heatLevel}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-4xl md:text-7xl font-poppins font-black leading-none mb-2 uppercase tracking-tighter">
                  {movie.title}
                </h1>
                <p className="text-xl md:text-2xl text-primary font-medium italic opacity-80 mb-6">
                  {movie.tagline}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-white/70">
                  <div className="flex items-center gap-2">
                    <HiStar className="text-yellow-400 text-lg" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiClock className="text-primary text-lg" />
                    <span>{movie.runtime} Min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiCalendar className="text-accent text-lg" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  <div className="px-2 py-0.5 border border-white/20 rounded text-[10px] uppercase">
                    {movie.status}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link
                  to={`/player/movie/${movie.id}`}
                  className="group relative px-8 py-4 bg-primary text-background rounded-xl font-black text-lg flex items-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-neon-pink"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform" />
                  <HiPlay className="text-2xl" />
                  WATCH NOW
                </Link>

                <button className="px-8 py-4 glass rounded-xl font-bold flex items-center gap-3 hover:bg-white/10 transition-all border border-white/10">
                  <HiPlus className="text-2xl" />
                  WATCHLIST
                </button>

                <button className="w-14 h-14 glass rounded-xl flex items-center justify-center hover:text-red-500 transition-colors border border-white/10 group">
                  <HiHeart className="text-2xl group-hover:scale-125 transition-transform" />
                </button>

                <button className="w-14 h-14 glass rounded-xl flex items-center justify-center hover:text-primary transition-colors border border-white/10">
                  <RiShareForwardFill className="text-2xl" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 mt-12 space-y-24">

        {/* Cinematic Stats Panel */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { label: 'Popularity', value: Math.round(movie.popularity), suffix: 'PT', icon: HiTrendingUp, color: 'text-primary' },
            { label: 'Rating', value: movie.vote_average.toFixed(1), suffix: '/10', icon: HiStar, color: 'text-yellow-400' },
            { label: 'Vote Count', value: movie.vote_count, suffix: '', icon: HiHeart, color: 'text-red-500' },
            { label: 'Budget', value: movie.budget > 0 ? `$${(movie.budget / 1000000).toFixed(1)}` : 'N/A', suffix: 'M', icon: RiShareForwardFill, color: 'text-accent' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="text-4xl" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">{stat.label}</p>
              <h3 className={`text-3xl font-poppins font-black ${stat.color}`}>
                {stat.value}<span className="text-sm ml-1 text-white/30 font-medium">{stat.suffix}</span>
              </h3>
            </motion.div>
          ))}
        </section>

        {/* Overview & Genres */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-4">
              <span className="w-8 h-[2px] bg-primary"></span>
              Storyline
            </h2>
            <p className="text-lg text-white/70 leading-relaxed font-light">
              {movie.overview}
            </p>

            <div className="flex flex-wrap gap-2 pt-4">
              {movie.genres.map(genre => (
                <span key={genre.id} className="px-4 py-2 rounded-lg bg-surface border border-white/5 text-xs font-bold hover:border-primary transition-colors cursor-default">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-8">
             <h2 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-4">
              <span className="w-8 h-[2px] bg-accent"></span>
              Production
            </h2>
            <div className="space-y-4">
              {movie.production_companies.slice(0, 3).map(company => (
                <div key={company.id} className="flex items-center gap-4 glass p-3 rounded-xl">
                  {company.logo_path ? (
                    <img src={getImageUrl(company.logo_path, 'w92')} alt={company.name} className="h-8 object-contain filter invert opacity-70" />
                  ) : (
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-[10px]">{company.name[0]}</div>
                  )}
                  <span className="text-sm font-medium">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cast Slider */}
        {credits?.cast?.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-4">
                <span className="w-8 h-[2px] bg-primary"></span>
                Top Cast
              </h2>
            </div>
            <Swiper
              modules={[FreeMode, Navigation]}
              freeMode={true}
              slidesPerView="auto"
              spaceBetween={20}
              className="cast-slider !overflow-visible"
            >
              {credits.cast.slice(0, 15).map((person) => (
                <SwiperSlide key={person.id} className="!w-40">
                  <Link to={`/person/${person.id}`} className="group">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 border border-white/10 group-hover:border-primary transition-colors shadow-2xl">
                      <img
                        src={person.profile_path ? getImageUrl(person.profile_path, 'w342') : 'https://via.placeholder.com/342x513?text=No+Image'}
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                    </div>
                    <h4 className="font-bold text-sm truncate">{person.name}</h4>
                    <p className="text-[10px] text-white/50 truncate uppercase tracking-tighter">{person.character}</p>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

        {/* Recommendations */}
        {recommendations?.results?.length > 0 && (
          <section>
             <h2 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-4 mb-8">
              <span className="w-8 h-[2px] bg-primary"></span>
              Recommended for you
            </h2>
            <SectionSlider items={recommendations.results} type="movie" />
          </section>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
