import React, { createContext, useContext, useState, useEffect } from 'react';
import { get } from '../api/tmdb';

const GenreContext = createContext();

export const GenreProvider = ({ children }) => {
  const [movieGenres, setMovieGenres] = useState({});
  const [tvGenres, setTvGenres] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieRes, tvRes] = await Promise.all([
          get('/genre/movie/list'),
          get('/genre/tv/list')
        ]);

        const movieGenreMap = {};
        movieRes.genres.forEach(genre => {
          movieGenreMap[genre.id] = genre.name;
        });

        const tvGenreMap = {};
        tvRes.genres.forEach(genre => {
          tvGenreMap[genre.id] = genre.name;
        });

        setMovieGenres(movieGenreMap);
        setTvGenres(tvGenreMap);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const getGenreNames = (ids, type = 'movie') => {
    const genreMap = type === 'movie' ? movieGenres : tvGenres;
    return ids.map(id => genreMap[id]).filter(Boolean);
  };

  return (
    <GenreContext.Provider value={{ movieGenres, tvGenres, getGenreNames, loading }}>
      {children}
    </GenreContext.Provider>
  );
};

export const useGenres = () => {
  const context = useContext(GenreContext);
  if (!context) {
    throw new Error('useGenres must be used within a GenreProvider');
  }
  return context;
};
