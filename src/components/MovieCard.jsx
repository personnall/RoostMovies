import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/tmdb';
import './MovieCard.css';

const MovieCard = ({ item, type = 'movie' }) => {
  const {
    id,
    title,
    name,
    poster_path,
    vote_average,
    release_date,
    first_air_date
  } = item;

  const displayTitle = title || name;
  const date = release_date || first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';
  const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
  const linkPath = `/${type}/${id}`;

  return (
    <Link to={linkPath} className="movie-card">
      <div className="card-poster">
        <img
          src={getImageUrl(poster_path, 'w500')}
          alt={displayTitle}
          loading="lazy"
        />
        <div className="card-overlay">
          <div className="rating">
            <i className="ri-star-fill"></i>
            <span>{rating}</span>
          </div>
          <div className="play-icon">
            <i className="ri-play-fill"></i>
          </div>
        </div>
      </div>
      <div className="card-info">
        <h3 className="card-title" title={displayTitle}>{displayTitle}</h3>
        <span className="card-year">{year}</span>
      </div>
    </Link>
  );
};

export default React.memo(MovieCard);
