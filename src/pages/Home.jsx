import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { tmdbServices } from '../api/tmdb';
import HeroBanner from '../components/HeroBanner';
import SectionSlider from '../components/SectionSlider';
import Loader from '../components/Loader';

const Home = () => {
  const { data: trendingMovies, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-movies'],
    queryFn: () => tmdbServices.getPopularMovies(),
  });

  const { data: popularTV, isLoading: tvLoading } = useQuery({
    queryKey: ['popular-tv'],
    queryFn: () => tmdbServices.getPopularTV(),
  });

  const { data: topRated, isLoading: topLoading } = useQuery({
    queryKey: ['top-rated'],
    queryFn: () => tmdbServices.getTopRatedMovies(),
  });

  if (trendingLoading && !trendingMovies) return <Loader />;

  return (
    <div className="space-y-20 pb-20">
      <HeroBanner movies={trendingMovies?.results} isLoading={trendingLoading} />

      <div className="container mx-auto px-4 md:px-8 space-y-20 relative z-10">
        <SectionSlider
          title="Trending Now"
          items={trendingMovies?.results}
          type="movie"
        />

        <SectionSlider
          title="Popular TV Shows"
          items={popularTV?.results}
          type="tv"
        />

        <SectionSlider
          title="Top Rated Classics"
          items={topRated?.results}
          type="movie"
        />
      </div>
    </div>
  );
};

export default Home;
