import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tmdbServices, getImageUrl } from '../api/tmdb';
import { useFavorites } from '../context/FavoritesContext';
import { useWatchlist } from '../context/WatchlistContext';
import SectionRow from '../components/SectionRow';
import { HeroSkeleton } from '../components/Skeletons';
import './Details.css';

const TVDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [tv, setTV] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seasonLoading, setSeasonLoading] = useState(false);

  const fetchTVDetails = useCallback(async () => {
    setLoading(true);
    try {
      const [tvData, creditsData, videosData, recommendationsData] = await Promise.all([
        tmdbServices.getTVDetails(id),
        tmdbServices.getTVCredits(id),
        tmdbServices.getTVVideos(id),
        tmdbServices.getTVRecommendations(id)
      ]);

      setTV(tvData);
      setCredits(creditsData);
      setVideos(videosData.results.filter(v => v.type === 'Trailer' || v.type === 'Teaser').slice(0, 4));
      setRecommendations(recommendationsData.results);

      if (tvData.seasons && tvData.seasons.length > 0) {
        setSelectedSeason(tvData.seasons[0].season_number);
      }
    } catch (error) {
      console.error('Failed to fetch TV details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchSeasonDetails = useCallback(async () => {
    setSeasonLoading(true);
    try {
      const data = await tmdbServices.getSeasonDetails(id, selectedSeason);
      setSeasonData(data);
    } catch (error) {
      console.error('Failed to fetch season details:', error);
    } finally {
      setSeasonLoading(false);
    }
  }, [id, selectedSeason]);

  useEffect(() => {
    fetchTVDetails();
    window.scrollTo(0, 0);
  }, [fetchTVDetails]);

  useEffect(() => {
    if (tv) {
      fetchSeasonDetails();
    }
  }, [tv, fetchSeasonDetails]);

  if (loading) return <HeroSkeleton />;
  if (!tv) return <div className="error-state">TV Show not found</div>;

  const isFavorite = favorites.some(fav => fav.id === tv.id);
  const isInWatchlist = watchlist.some(item => item.id === tv.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(tv.id);
    } else {
      addToFavorites(tv);
    }
  };

  const toggleWatchlist = () => {
    if (isInWatchlist) {
      removeFromWatchlist(tv.id);
    } else {
      addToWatchlist(tv);
    }
  };

  return (
    <div className="details-page">
      <div className="details-hero">
        <div className="details-backdrop">
          <img src={getImageUrl(tv.backdrop_path)} alt={tv.name} />
          <div className="details-hero-overlay"></div>
        </div>
      </div>

      <div className="details-container">
        <div className="details-poster">
          <img src={getImageUrl(tv.poster_path, 'w500')} alt={tv.name} />
        </div>

        <div className="details-info">
          <h1 className="details-title">{tv.name}</h1>
          <div className="details-meta">
            <div className="meta-item meta-rating">
              <i className="ri-star-fill"></i>
              <span>{tv.vote_average.toFixed(1)}</span>
            </div>
            <div className="meta-item">
              <span>{tv.number_of_seasons} Seasons</span>
            </div>
            <div className="meta-item">
              <span>{new Date(tv.first_air_date).getFullYear()}</span>
            </div>
          </div>

          <p className="details-overview">{tv.overview}</p>

          <div className="details-genres">
            {tv.genres.map(genre => (
              <span key={genre.id} className="genre-tag">{genre.name}</span>
            ))}
          </div>

          <div className="details-btns">
            <button
              className="details-btn primary"
              onClick={() => {
                const firstEp = seasonData?.episodes[0] || { episode_number: 1 };
                navigate(`/player/tv/${id}/${selectedSeason}/${firstEp.episode_number}`);
              }}
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
          </div>
        </div>
      </div>

      <div className="details-sections">
        {/* Season Selector */}
        <div className="details-section">
          <div className="section-header-flex">
            <h2 className="section-h2">Episodes</h2>
            <select
              className="season-select"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
            >
              {tv.seasons.map(season => (
                <option key={season.id} value={season.season_number}>
                  {season.name}
                </option>
              ))}
            </select>
          </div>

          {seasonLoading ? (
            <div className="episodes-loading">Loading episodes...</div>
          ) : (
            <div className="episodes-list">
              {seasonData?.episodes.map(episode => (
                <div key={episode.id} className="episode-card">
                  <div className="episode-image">
                    <img
                      src={getImageUrl(episode.still_path, 'w300') || 'https://via.placeholder.com/300x169?text=No+Image'}
                      alt={episode.name}
                    />
                    <div className="episode-overlay">
                      <button
                        className="play-btn-sm"
                        onClick={() => navigate(`/player/tv/${id}/${selectedSeason}/${episode.episode_number}`)}
                      >
                        <i className="ri-play-fill"></i>
                      </button>
                    </div>
                  </div>
                  <div className="episode-info">
                    <div className="episode-top">
                      <h3 className="episode-title">
                        {episode.episode_number}. {episode.name}
                      </h3>
                      <span className="episode-runtime">{episode.runtime || 'N/A'} min</span>
                    </div>
                    <p className="episode-overview">{episode.overview}</p>
                    <button
                      className="watch-ep-btn"
                      onClick={() => navigate(`/player/tv/${id}/${selectedSeason}/${episode.episode_number}`)}
                    >
                      Watch Episode
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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

        {recommendations.length > 0 && (
          <SectionRow
            title="Recommendations"
            items={recommendations}
            type="tv"
          />
        )}
      </div>
    </div>
  );
};

export default TVDetails;
