import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tmdbServices, getImageUrl } from '../api/tmdb';
import { useFavorites } from '../context/FavoritesContext';
import { useWatchlist } from '../context/WatchlistContext';
import SectionRow from '../components/SectionRow';
import { HeroSkeleton } from '../components/Skeletons';
import './Details.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovieDetails = useCallback(async () => {
    setLoading(true);
    try {
      const [movieData, creditsData, videosData, recommendationsData, reviewsData] = await Promise.all([
        tmdbServices.getMovieDetails(id),
        tmdbServices.getMovieCredits(id),
        tmdbServices.getMovieVideos(id),
        tmdbServices.getMovieRecommendations(id),
        tmdbServices.getMovieReviews(id)
      ]);

      setMovie(movieData);
      setCredits(creditsData);
      setVideos(videosData.results.filter(v => v.type === 'Trailer' || v.type === 'Teaser').slice(0, 4));
      setRecommendations(recommendationsData.results);
      setReviews(reviewsData.results.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieDetails();
    window.scrollTo(0, 0);
  }, [fetchMovieDetails]);

  if (loading) return <HeroSkeleton />;
  if (!movie) return <div className="error-state">Movie not found</div>;

  const isFavorite = favorites.some(fav => fav.id === movie.id);
  const isInWatchlist = watchlist.some(item => item.id === movie.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const toggleWatchlist = () => {
    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div className="details-page">
      <div className="details-hero">
        <div className="details-backdrop">
          <img src={getImageUrl(movie.backdrop_path)} alt={movie.title} />
          <div className="details-hero-overlay"></div>
        </div>
      </div>

      <div className="details-container">
        <div className="details-poster">
          <img src={getImageUrl(movie.poster_path, 'w500')} alt={movie.title} />
        </div>

        <div className="details-info">
          <h1 className="details-title">{movie.title}</h1>
          {movie.tagline && <p className="details-tagline">"{movie.tagline}"</p>}

          <div className="details-meta">
            <div className="meta-item meta-rating">
              <i className="ri-star-fill"></i>
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <div className="meta-item">
              <span>{movie.runtime} min</span>
            </div>
            <div className="meta-item">
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </div>
          </div>

          <p className="details-overview">{movie.overview}</p>

          <div className="details-genres">
            {movie.genres.map(genre => (
              <span key={genre.id} className="genre-tag">{genre.name}</span>
            ))}
          </div>

          <div className="details-btns">
            <button
              className="details-btn primary"
              onClick={() => navigate(`/player/movie/${id}`)}
            >
              <i className="ri-play-fill"></i>
              <span>Watch Now</span>
            </button>
            <button
              className={`details-btn icon-btn ${isFavorite ? 'active' : ''}`}
              onClick={toggleFavorite}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <i className={isFavorite ? "ri-heart-fill" : "ri-heart-line"}></i>
            </button>
            <button
              className={`details-btn icon-btn ${isInWatchlist ? 'active' : ''}`}
              onClick={toggleWatchlist}
              title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <i className={isInWatchlist ? "ri-bookmark-fill" : "ri-bookmark-line"}></i>
            </button>
            {videos.length > 0 && (
              <button
                className="details-btn secondary"
                onClick={() => {
                  const trailer = videos.find(v => v.type === 'Trailer') || videos[0];
                  window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
                }}
              >
                <i className="ri-video-line"></i>
                <span>Watch Trailer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="details-sections">
        {credits?.cast?.length > 0 && (
          <div className="details-section">
            <h2 className="section-h2">Cast</h2>
            <div className="cast-slider">
              {credits.cast.slice(0, 15).map(person => (
                <Link to={`/person/${person.id}`} key={person.id} className="cast-card">
                  <div className="cast-image">
                    <img
                      src={getImageUrl(person.profile_path, 'w185') || 'https://via.placeholder.com/185x185?text=No+Image'}
                      alt={person.name}
                    />
                  </div>
                  <div className="cast-info">
                    <p className="cast-name">{person.name}</p>
                    <p className="cast-character">{person.character}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {videos.length > 0 && (
          <div className="details-section">
            <h2 className="section-h2">Videos & Trailers</h2>
            <div className="videos-grid">
              {videos.map(video => (
                <div key={video.key} className="video-card">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="details-section">
            <h2 className="section-h2">Reviews</h2>
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">
                      <img
                        src={review.author_details.avatar_path?.startsWith('/http')
                          ? review.author_details.avatar_path.substring(1)
                          : getImageUrl(review.author_details.avatar_path, 'w185') || `https://api.dicebear.com/7.x/initials/svg?seed=${review.author}`}
                        alt={review.author}
                      />
                    </div>
                    <span className="review-author">{review.author}</span>
                  </div>
                  <p className="review-content">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <SectionRow
            title="Recommendations"
            items={recommendations}
            type="movie"
          />
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
