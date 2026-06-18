import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';
import './Lists.css';

const Watchlist = () => {
  const { watchlist } = useWatchlist();

  return (
    <div className="lists-page">
      <div className="list-header">
        <h1>My Watchlist</h1>
        <p>{watchlist.length} {watchlist.length === 1 ? 'item' : 'items'}</p>
      </div>

      {watchlist.length === 0 ? (
        <div className="empty-list">
          <i className="ri-bookmark-line"></i>
          <h2>Your watchlist is empty</h2>
          <p>Add movies and TV shows to watch later!</p>
        </div>
      ) : (
        <div className="list-grid">
          {watchlist.map((item) => (
            <MovieCard key={item.id} item={item} type={item.media_type || (item.title ? 'movie' : 'tv')} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
