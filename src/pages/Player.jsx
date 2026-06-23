import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { tmdbServices, getImageUrl } from '../api/tmdb';
import { useHistory } from '../context/HistoryContext';
import { useContinueWatching } from '../context/ContinueWatchingContext';
import { useToast } from '../context/ToastContext';
import SectionSlider from '../components/SectionSlider';
import Loader from '../components/Loader';

const Player = () => {
  const { id, season, episode } = useParams();
  const navigate = useNavigate();
  const { addToHistory } = useHistory();
  const { updateContinueWatching } = useContinueWatching();
  const { addToast } = useToast();

  const [data, setData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [seasonData, setSeasonData] = useState(null);
  const [showData, setShowData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTV = !!season;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (isTV) {
        const [show, recs, seasonDetails] = await Promise.all([
          tmdbServices.getTVDetails(id),
          tmdbServices.getTVRecommendations(id),
          tmdbServices.getSeasonDetails(id, season)
        ]);

        setData(show);
        setShowData(show);
        setRecommendations(recs.results);
        setSeasonData(seasonDetails);

        const currentEp = seasonDetails.episodes.find(e => e.episode_number === Number(episode));

        updateContinueWatching({
          id,
          type: 'tv',
          title: show.name,
          poster: show.poster_path,
          season: Number(season),
          episode: Number(episode),
          episodeTitle: currentEp?.name
        });

        addToHistory({
          id: `${id}-s${season}e${episode}`,
          tmdbId: id,
          type: 'tv',
          title: show.name,
          poster: show.poster_path,
          season,
          episode,
          episodeTitle: currentEp?.name
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
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]);

  if (loading) return <Loader />;
  if (!data) return <div className="h-screen flex items-center justify-center">Content not found</div>;

  const title = data.title || data.name;
  const embedUrl = isTV
    ? `https://embed.filmu.in/tv/${id}/${season}/${episode}`
    : `https://embed.filmu.in/movie/${id}`;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Helmet>
        <title>{isTV ? `${data.name} S${season}E${episode}` : data.title} | CineVerse</title>
      </Helmet>

      <div className="container mx-auto px-4 md:px-8 space-y-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm font-bold text-white/40 uppercase tracking-widest">
           <span className="text-primary">{isTV ? 'Series' : 'Film'}</span>
           <span>/</span>
           <span className="text-white">{title}</span>
           {isTV && (
             <>
               <span>/</span>
               <span className="text-accent">S{season} E{episode}</span>
             </>
           )}
        </div>

        {/* Player Container */}
        <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden border border-white/5 bg-black shadow-2xl">
           <iframe
             src={embedUrl}
             title={title}
             className="w-full h-full"
             frameBorder="0"
             allowFullScreen
           />
        </div>

        {/* Content Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
             <h1 className="text-4xl font-poppins font-black uppercase tracking-tighter">
               {isTV ? `S${season} E${episode}: ${seasonData?.episodes.find(e => e.episode_number === Number(episode))?.name || title}` : title}
             </h1>
             <p className="text-lg text-white/60 leading-relaxed font-light">
               {isTV ? seasonData?.episodes.find(e => e.episode_number === Number(episode))?.overview || data.overview : data.overview}
             </p>
          </div>

          {/* Sidebar / More Like This */}
          <div className="space-y-8">
             <div className="glass p-6 rounded-3xl border border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-primary mb-6">Quick Actions</h3>
                <div className="flex flex-col gap-4">
                   <button className="w-full py-4 glass rounded-xl font-bold hover:bg-white/10 transition-all border border-white/5">
                     ADD TO WATCHLIST
                   </button>
                   <button className="w-full py-4 glass rounded-xl font-bold hover:bg-white/10 transition-all border border-white/5">
                     SHARE ACCESS
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="pt-12">
          <SectionSlider title="Recommended Transmissions" items={recommendations} type={isTV ? 'tv' : 'movie'} />
        </div>
      </div>
    </div>
  );
};

export default Player;
