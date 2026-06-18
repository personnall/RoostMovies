import React, { useState, useEffect, useCallback } from 'react';
import Hero from '../components/Hero';
import SectionRow from '../components/SectionRow';
import { tmdbServices } from '../api/tmdb';

const Home = () => {
  const [sections, setSections] = useState({
    nowPlaying: { title: 'Now Playing', items: [], loading: true, type: 'movie' },
    popularMovies: { title: 'Popular Movies', items: [], loading: true, type: 'movie' },
    topRatedMovies: { title: 'Top Rated Movies', items: [], loading: true, type: 'movie' },
    upcomingMovies: { title: 'Upcoming Movies', items: [], loading: true, type: 'movie' },
    popularTV: { title: 'Popular TV Shows', items: [], loading: true, type: 'tv' },
    topRatedTV: { title: 'Top Rated TV Shows', items: [], loading: true, type: 'tv' },
    airingToday: { title: 'Airing Today on TV', items: [], loading: true, type: 'tv' },
  });

  const fetchSectionData = useCallback(async () => {
    const fetchMap = {
      nowPlaying: tmdbServices.getNowPlayingMovies,
      popularMovies: tmdbServices.getPopularMovies,
      topRatedMovies: tmdbServices.getTopRatedMovies,
      upcomingMovies: tmdbServices.getUpcomingMovies,
      popularTV: tmdbServices.getPopularTV,
      topRatedTV: tmdbServices.getTopRatedTV,
      airingToday: tmdbServices.getAiringToday,
    };

    Object.entries(fetchMap).forEach(async ([key, fetchFn]) => {
      try {
        const res = await fetchFn();
        setSections(prev => ({
          ...prev,
          [key]: { ...prev[key], items: res.results, loading: false }
        }));
      } catch (error) {
        console.error(`Failed to fetch ${key}:`, error);
        setSections(prev => ({
          ...prev,
          [key]: { ...prev[key], loading: false }
        }));
      }
    });
  }, []);

  useEffect(() => {
    fetchSectionData();
  }, [fetchSectionData]);

  return (
    <div className="home-page">
      <Hero />

      <div className="home-content">
        {Object.entries(sections).map(([key, section]) => (
          <SectionRow
            key={key}
            title={section.title}
            items={section.items}
            loading={section.loading}
            type={section.type}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
