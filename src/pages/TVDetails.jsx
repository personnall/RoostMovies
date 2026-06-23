import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiPlay, HiPlus, HiHeart, HiStar, HiClock, HiCalendar, HiTrendingUp, HiCollection } from 'react-icons/hi';
import { RiShareForwardFill } from 'react-icons/ri';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { tmdbServices, getImageUrl } from '../api/tmdb';
import Loader from '../components/Loader';
import SectionSlider from '../components/SectionSlider';

import 'swiper/css';
import 'swiper/css/free-mode';

const TVDetails = () => {
  const { id } = useParams();

  const { data: show, isLoading, isError } = useQuery({
    queryKey: ['tv', id],
    queryFn: () => tmdbServices.getTVDetails(id),
  });

  const { data: credits } = useQuery({
    queryKey: ['tv-credits', id],
    queryFn: () => tmdbServices.getTVCredits(id),
  });

  const { data: recommendations } = useQuery({
    queryKey: ['tv-recommendations', id],
    queryFn: () => tmdbServices.getTVRecommendations(id),
  });

  const aiMatch = useMemo(() => {
    if (!show) return 0;
    const base = show.vote_average * 10;
    const popularityBonus = Math.min(show.popularity / 500, 5);
    return Math.min(Math.round(base + popularityBonus), 99);
  }, [show]);

  const heatLevel = useMemo(() => {
    if (!show) return 'COLD';
    if (show.popularity > 1500) return 'VIRAL';
    if (show.popularity > 400) return 'HOT';
    return 'TRENDING';
  }, [show]);

  if (isLoading) return <Loader />;
  if (isError) return <div className="h-screen flex items-center justify-center text-red-500">Failed to load series data.</div>;

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={getImageUrl(show.backdrop_path)}
            alt={show.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/20" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-12 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:block lg:col-span-3"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src={getImageUrl(show.poster_path)}
                  alt={show.name}
                  className="relative rounded-2xl shadow-2xl w-full border border-white/10"
                />
              </div>
            </motion.div>

            <div className="lg:col-span-9 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="relative px-4 py-1 rounded-full border border-primary/50 bg-primary/10 backdrop-blur-md overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative text-xs font-bold text-primary tracking-widest uppercase">
                    {aiMatch}% Match
                  </span>
                </div>

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
                  {show.name}
                </h1>
                <p className="text-xl md:text-2xl text-primary font-medium italic opacity-80 mb-6">
                  {show.tagline}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-white/70">
                  <div className="flex items-center gap-2">
                    <HiStar className="text-yellow-400 text-lg" />
                    <span>{show.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiCollection className="text-primary text-lg" />
                    <span>{show.number_of_seasons} Seasons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiCalendar className="text-accent text-lg" />
                    <span>{new Date(show.first_air_date).getFullYear()}</span>
                  </div>
                  <div className="px-2 py-0.5 border border-white/20 rounded text-[10px] uppercase">
                    {show.status}
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
                  to={`/player/tv/${show.id}/1/1`}
                  className="group relative px-8 py-4 bg-primary text-background rounded-xl font-black text-lg flex items-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-neon-pink"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform" />
                  <HiPlay className="text-2xl" />
                  START STREAMING
                </Link>

                <button className="px-8 py-4 glass rounded-xl font-bold flex items-center gap-3 hover:bg-white/10 transition-all border border-white/10">
                  <HiPlus className="text-2xl" />
                  WATCHLIST
                </button>

                <button className="w-14 h-14 glass rounded-xl flex items-center justify-center hover:text-red-500 transition-colors border border-white/10 group">
                  <HiHeart className="text-2xl group-hover:scale-125 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 mt-12 space-y-24">

        {/* Cinematic Stats Panel */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { label: 'Popularity', value: Math.round(show.popularity), suffix: 'PT', icon: HiTrendingUp, color: 'text-primary' },
            { label: 'Episodes', value: show.number_of_episodes, suffix: 'EPS', icon: HiCollection, color: 'text-accent' },
            { label: 'Rating', value: show.vote_average.toFixed(1), suffix: '/10', icon: HiStar, color: 'text-yellow-400' },
            { label: 'Votes', value: show.vote_count, suffix: '', icon: HiHeart, color: 'text-red-500' },
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

        {/* Seasons Preview */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-4">
            <span className="w-8 h-[2px] bg-primary"></span>
            Seasons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {show.seasons.slice().reverse().slice(0, 6).map((season) => (
              <div key={season.id} className="glass flex gap-4 p-4 rounded-2xl hover:border-primary/30 transition-all cursor-pointer group">
                <div className="w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden border border-white/10">
                  <img src={getImageUrl(season.poster_path, 'w185')} alt={season.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-lg">{season.name}</h4>
                  <p className="text-primary text-xs font-bold mb-2">{season.episode_count} Episodes</p>
                  <p className="text-white/50 text-xs line-clamp-3">{season.overview || 'No description available for this season.'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Overview & Genres */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-4">
              <span className="w-8 h-[2px] bg-primary"></span>
              The Story
            </h2>
            <p className="text-lg text-white/70 leading-relaxed font-light">
              {show.overview}
            </p>

            <div className="flex flex-wrap gap-2 pt-4">
              {show.genres.map(genre => (
                <span key={genre.id} className="px-4 py-2 rounded-lg bg-surface border border-white/5 text-xs font-bold hover:border-primary transition-colors cursor-default">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-8">
             <h2 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-4">
              <span className="w-8 h-[2px] bg-accent"></span>
              Network
            </h2>
            <div className="space-y-4">
              {show.networks.slice(0, 3).map(network => (
                <div key={network.id} className="flex items-center gap-4 glass p-3 rounded-xl">
                  {network.logo_path ? (
                    <img src={getImageUrl(network.logo_path, 'w92')} alt={network.name} className="h-6 object-contain filter invert opacity-70" />
                  ) : (
                    <span className="text-sm font-medium">{network.name}</span>
                  )}
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
              Similar Shows
            </h2>
            <SectionSlider items={recommendations.results} type="tv" />
          </section>
        )}
      </div>
    </div>
  );
};

export default TVDetails;
