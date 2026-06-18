import React, { useState, useEffect, useCallback } from 'react';
import { tmdbServices } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { SectionSkeleton } from '../components/Skeletons';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import './Lists.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const data = await tmdbServices.getPopularMovies(page);
      setMovies((prev) => [...prev, ...data.results]);
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore]);

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  const observerTarget = useInfiniteScroll(loadMore, [loading, hasMore]);

  return (
    <div className="lists-page">
      <div className="list-header">
        <h1>Discovery Movies</h1>
        <p>Explore the most popular movies</p>
      </div>

      <div className="list-grid">
        {movies.map((movie) => (
          <MovieCard key={`${movie.id}-${page}`} item={movie} type="movie" />
        ))}
      </div>

      {(loading || hasMore) && (
        <div ref={observerTarget} className="infinite-loader">
          {loading && <SectionSkeleton />}
        </div>
      )}
    </div>
  );
};

export default Movies;
