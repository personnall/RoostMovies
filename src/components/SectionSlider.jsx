import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import MovieCard from './MovieCard';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

const SectionSlider = ({ title, items, type }) => {
  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest flex items-center gap-4">
            <span className="w-8 h-[2px] bg-primary"></span>
            {title}
          </h2>
        </div>
      )}

      <Swiper
        modules={[FreeMode, Navigation]}
        freeMode={true}
        navigation={true}
        slidesPerView="auto"
        spaceBetween={20}
        className="movie-slider !overflow-visible"
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 15 },
          640: { slidesPerView: 3, spaceBetween: 20 },
          768: { slidesPerView: 4, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 25 },
          1280: { slidesPerView: 6, spaceBetween: 25 },
        }}
      >
        {items?.map((item) => (
          <SwiperSlide key={item.id} className="!w-48">
            <MovieCard item={{ ...item, media_type: type }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SectionSlider;
