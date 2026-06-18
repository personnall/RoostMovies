import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { tmdbServices, getImageUrl } from '../api/tmdb';
import { useHistory } from '../context/HistoryContext';
import { useContinueWatching } from '../context/ContinueWatchingContext';
import { useToast } from '../context/ToastContext';
import SectionRow from '../components/SectionRow';
import './Player.css';

const Player = () => {
  const { id, season, episode } = useParams();
  const navigate = useNavigate();
  const { addToHistory } = useHistory();
  const { updateContinueWatching } = useContinueWatching();
  const { addToast } = useToast();

  const [data, setData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [tvDetails, setTVDetails] = useState(null);
  const [currentSeasonData, setCurrentSeasonData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTV = !!season;

  const fetchPlayerData = useCallback(async () => {
    setLoading(true);
    try {
      if (isTV) {
        const [show, recs, seasonInfo] = await Promise.all([
          tmdbServices.getTVDetails(id),
          tmdbServices.getTVRecommendations(id),
          tmdbServices.getSeasonDetails(id, season)
        ]);
        setData(show);
        setTVDetails(show);
        setRecommendations(recs.results);
        setCurrentSeasonData(seasonInfo);

        const epInfo = seasonInfo.episodes.find(e => e.episode_number === Number(episode));

        updateContinueWatching({
          id,
          type: 'tv',
          title: show.name,
          poster: show.poster_path,
          season: Number(season),
          episode: Number(episode),
          episodeTitle: epInfo?.name
        });

        addToHistory({
          id: `${id}-s${season}e${episode}`,
          tmdbId: id,
          type: 'tv',
          title: show.name,
          poster: show.poster_path,
          season,
          episode,
          episodeTitle: epInfo?.name
        });
      } else {
        const [movie, recs] = await Promise.all([
          tmdbServices.getMovieDetails(id),
          tmdbServices.getMovieRecommendations(id)
        ]);
        setData(movie);
        setRecommendations(recs.results);

        updateContinueWatching({
          id,
          type: 'movie',
          title: movie.title,
          poster: movie.poster_path
        });

        addToHistory({
          id,
          type: 'movie',
          title: movie.title,
          poster: movie.poster_path
        });
      }
    } catch (error) {
      console.error('Failed to fetch player data:', error);
      addToast('Failed to load content', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, season, episode, isTV, addToHistory, updateContinueWatching, addToast]);

  useEffect(() => {
    fetchPlayerData();
    window.scrollTo(0, 0);
  }, [fetchPlayerData]);

  if (loading) return <div className="player-loading-full"><div className="spinner"></div><p>Loading Player...</p></div>;
  if (!data) return <div className="error-state">Content not found</div>;

  const title = data.title || data.name;
  const playerUrl = isTV
    ? `https://embed.filmu.in/tv/${id}/${season}/${episode}`
    : `https://embed.filmu.in/movie/${id}`;

  const handleNextEpisode = () => {
    const currentEpNum = Number(episode);
    const nextEp = currentSeasonData.episodes.find(e => e.episode_number === currentEpNum + 1);

    if (nextEp) {
      navigate(`/player/tv/${id}/${season}/${nextEp.episode_number}`);
    } else {
      // Check for next season
      const nextSeason = tvDetails.seasons.find(s => s.season_number === Number(season) + 1);
      if (nextSeason) {
        navigate(`/player/tv/${id}/${nextSeason.season_number}/1`);
      } else {
        addToast('No more episodes', 'info');
      }
    }
  };

  const handlePrevEpisode = () => {
    const currentEpNum = Number(episode);
    if (currentEpNum > 1) {
      navigate(`/player/tv/${id}/${season}/${currentEpNum - 1}`);
    } else if (Number(season) > 1) {
      const prevSeasonNum = Number(season) - 1;
      // We don't have prev season episode count easily without fetching,
      // but usually we can just navigate to s-1 e1 or similar.
      // For simplicity, just toast or go to s-1 e1.
      navigate(`/player/tv/${id}/${prevSeasonNum}/1`);
    }
  };

  return (
    <div className="player-page-refined">
      <Helmet>
        <title>{isTV ? `${data.name} S${season}E${episode}` : data.title} | RoostMovies</title>
      </Helmet>

      <div className="player-top-bar">
        <button className="back-btn-styled" onClick={() => navigate(-1)}>
          <i className="ri-arrow-left-line"></i>
          <span>Back</span>
        </button>
        <div className="player-path">
          <span className="path-main">{title}</span>
          {isTV && (
            <>
              <i className="ri-arrow-right-s-line"></i>
              <span className="path-sub">Season {season}</span>
              <i className="ri-arrow-right-s-line"></i>
              <span className="path-sub">Episode {episode}</span>
            </>
          )}
        </div>
      </div>

      <div className={`player-layout ${isTV ? 'tv-layout' : 'movie-layout'}`}>
        <div className="player-main-content">
          <div className="iframe-container">
            <iframe
              src={playerUrl}
              title={title}
              frameBorder="0"
              allowFullScreen
              scrolling="no"
            ></iframe>
          </div>

          <div className="content-info-section">
            <div className="info-header">
              <h1>{isTV ? `S${season} E${episode}: ${currentSeasonData?.episodes?.find(e => e.episode_number === Number(episode))?.name || title}` : title}</h1>
              {isTV && (
                <div className="ep-nav-btns">
                  <button onClick={handlePrevEpisode} disabled={Number(season) === 1 && Number(episode) === 1}>
                    <i className="ri-skip-back-fill"></i> Previous
                  </button>
                  <button onClick={handleNextEpisode}>
                    Next <i className="ri-skip-forward-fill"></i>
                  </button>
                </div>
              )}
            </div>
            <p className="player-overview-text">{isTV ? currentSeasonData?.episodes?.find(e => e.episode_number === Number(episode))?.overview || data.overview : data.overview}</p>
          </div>
        </div>

        {isTV && (
          <div className="player-sidebar">
            <div className="sidebar-season-picker">
              <label>Season</label>
              <select
                value={season}
                onChange={(e) => navigate(`/player/tv/${id}/${e.target.value}/1`)}
              >
                {tvDetails?.seasons?.filter(s => s.season_number > 0).map(s => (
                  <option key={s.id} value={s.season_number}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="sidebar-episodes">
              <h3>Episodes</h3>
              <div className="ep-list-scroll">
                {currentSeasonData?.episodes?.map(ep => (
                  <div
                    key={ep.id}
                    className={`ep-item ${Number(episode) === ep.episode_number ? 'active' : ''}`}
                    onClick={() => navigate(`/player/tv/${id}/${season}/${ep.episode_number}`)}
                  >
                    <div className="ep-thumb">
                      <img src={getImageUrl(ep.still_path, 'w300') || getImageUrl(data.backdrop_path, 'w300')} alt={ep.name} />
                      <div className="ep-play-overlay"><i className="ri-play-fill"></i></div>
                    </div>
                    <div className="ep-details-mini">
                      <span className="ep-num">Episode {ep.episode_number}</span>
                      <p className="ep-name-mini" title={ep.name}>{ep.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="player-recommendations">
        <SectionRow title="You Might Also Like" items={recommendations} type={isTV ? 'tv' : 'movie'} />
      </div>
    </div>
  );
};

export default Player;
