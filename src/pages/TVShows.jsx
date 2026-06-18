import React, { useState, useEffect, useCallback } from 'react';
import { tmdbServices } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { SectionSkeleton } from '../components/Skeletons';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import './Lists.css';

const TVShows = () => {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchShows = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const data = await tmdbServices.getPopularTV(page);
      setShows((prev) => [...prev, ...data.results]);
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error('Failed to fetch TV shows:', error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore]);

  useEffect(() => {
    fetchShows();
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
        <h1>Discovery TV Shows</h1>
        <p>Explore the most popular TV shows</p>
      </div>

      <div className="list-grid">
        {shows.map((show) => (
          <MovieCard key={`${show.id}-${page}`} item={show} type="tv" />
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

export default TVShows;
