import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { tmdbServices } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const Movies = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['movies-popular'],
    queryFn: () => tmdbServices.getPopularMovies(),
  });

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-poppins font-black uppercase tracking-tighter mb-12 italic">
          Archive: <span className="text-primary">Cinema</span>
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {data?.results.map((item) => (
            <MovieCard key={item.id} item={{ ...item, media_type: 'movie' }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Movies;
