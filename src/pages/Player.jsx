import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdbServices, getImageUrl } from '../api/tmdb';
import './Player.css';

const Player = () => {
  const { id, season, episode } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isTV = !!season;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isTV) {
          const tvData = await tmdbServices.getTVDetails(id);
          setData(tvData);
        } else {
          const movieData = await tmdbServices.getMovieDetails(id);
          setData(movieData);
        }
      } catch (error) {
        console.error('Failed to fetch player data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id, isTV]);

  if (loading) return <div className="player-loading">Loading Player...</div>;
  if (!data) return <div className="error-state">Content not found</div>;

  const title = data.title || data.name;
  const backdrop = getImageUrl(data.backdrop_path);

  return (
    <div className="player-page">
      <div className="player-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="ri-arrow-left-line"></i>
          <span>Back</span>
        </button>
        <div className="player-info-mini">
          <h1 className="mini-title">{title}</h1>
          {isTV && <span className="mini-meta">S{season} E{episode}</span>}
        </div>
      </div>

      <div className="player-main">
        <div className="video-aspect-container">
          <div className="video-placeholder" style={{ backgroundImage: `url(${backdrop})` }}>
            <div className="video-overlay">
              <i className="ri-play-circle-fill"></i>
              <p>Streaming Source Not Connected</p>
              <span>(This is a UI/Routing prototype)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="player-footer">
        <div className="player-details">
          <h2>{title}</h2>
          <p className="player-overview">{data.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default Player;
