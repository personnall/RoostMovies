import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiStar, HiCalendar, HiTrendingUp, HiUser, HiLocationMarker, HiBriefcase } from 'react-icons/hi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { tmdbServices, getImageUrl } from '../api/tmdb';
import Loader from '../components/Loader';
import MovieCard from '../components/MovieCard';

import 'swiper/css';
import 'swiper/css/free-mode';

const PersonDetails = () => {
  const { id } = useParams();

  const { data: person, isLoading, isError } = useQuery({
    queryKey: ['person', id],
    queryFn: () => tmdbServices.getPersonDetails(id),
  });

  const { data: credits } = useQuery({
    queryKey: ['person-credits', id],
    queryFn: () => tmdbServices.getPersonCombinedCredits(id),
  });

  const sortedCredits = useMemo(() => {
    if (!credits?.cast) return [];
    return [...credits.cast]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20);
  }, [credits]);

  if (isLoading) return <Loader />;
  if (isError) return <div className="h-screen flex items-center justify-center text-red-500">Failed to load profile.</div>;

  return (
    <div className="min-h-screen bg-background text-white pb-20 pt-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Sidebar: Profile Info */}
          <aside className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-b from-primary to-accent rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden border border-white/10">
                <img
                  src={getImageUrl(person.profile_path, 'h632')}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <div className="space-y-6">
              <h1 className="text-4xl font-poppins font-black uppercase tracking-tighter leading-none">
                {person.name}
              </h1>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: 'Profession', value: person.known_for_department, icon: HiBriefcase, color: 'text-primary' },
                  { label: 'Born', value: person.birthday || 'Unknown', icon: HiCalendar, color: 'text-accent' },
                  { label: 'Birthplace', value: person.place_of_birth || 'Unknown', icon: HiLocationMarker, color: 'text-yellow-400' },
                  { label: 'Popularity', value: `${Math.round(person.popularity)} Points`, icon: HiTrendingUp, color: 'text-red-500' },
                ].map((item) => (
                  <div key={item.label} className="glass p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${item.color}`}>
                      <item.icon className="text-xl" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{item.label}</p>
                      <p className="font-bold text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-8 space-y-16">

            {/* Biography */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-4">
                <span className="w-8 h-[2px] bg-primary"></span>
                The Legend
              </h2>
              <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <HiUser className="text-9xl" />
                </div>
                <p className="text-lg text-white/70 leading-relaxed font-light whitespace-pre-line italic">
                  {person.biography || `${person.name} is a renowned professional in the ${person.known_for_department} department with a significant contribution to the entertainment industry.`}
                </p>
              </div>
            </section>

            {/* Filmography Slider */}
            {sortedCredits.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-4">
                    <span className="w-8 h-[2px] bg-accent"></span>
                    Known For
                  </h2>
                </div>
                <Swiper
                  modules={[FreeMode, Navigation]}
                  freeMode={true}
                  slidesPerView="auto"
                  spaceBetween={20}
                  className="filmography-slider !overflow-visible"
                >
                  {sortedCredits.map((item) => (
                    <SwiperSlide key={item.id + item.media_type} className="!w-48">
                      <MovieCard item={item} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </section>
            )}

            {/* Career Summary Stats */}
            <section className="grid grid-cols-2 md:grid-cols-3 gap-6">
               <div className="glass p-6 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Total Credits</p>
                  <h4 className="text-3xl font-black text-primary">{(credits?.cast?.length || 0) + (credits?.crew?.length || 0)}</h4>
               </div>
               <div className="glass p-6 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Cast Roles</p>
                  <h4 className="text-3xl font-black text-accent">{credits?.cast?.length || 0}</h4>
               </div>
               <div className="glass p-6 rounded-2xl border border-white/5 text-center col-span-2 md:col-span-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Avg. Rating</p>
                  <h4 className="text-3xl font-black text-yellow-400">
                    {(sortedCredits.reduce((acc, curr) => acc + curr.vote_average, 0) / sortedCredits.length || 0).toFixed(1)}
                  </h4>
               </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;
