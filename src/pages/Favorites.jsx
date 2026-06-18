import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';
import './Lists.css';

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="lists-page">
      <div className="list-header">
        <h1>My Favorites</h1>
        <p>{favorites.length} {favorites.length === 1 ? 'item' : 'items'}</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-list">
          <i className="ri-heart-line"></i>
          <h2>Your favorites list is empty</h2>
          <p>Explore movies and TV shows and add them to your favorites!</p>
        </div>
      ) : (
        <div className="list-grid">
          {favorites.map((item) => (
            <MovieCard key={item.id} item={item} type={item.media_type || (item.title ? 'movie' : 'tv')} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
