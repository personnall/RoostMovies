import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    accept: 'application/json',
  },
});

// Centralized error handling helper
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error('TMDB Error:', error.response?.data || error.message);
    throw error;
  }
};

// Generic GET helper
export const get = (endpoint, params = {}) => {
  return handleRequest(tmdbApi.get(endpoint, { params }));
};

export const getImageUrl = (path, size = 'original') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// TMDB Service Methods
export const tmdbServices = {
  // Movies
  getPopularMovies: (page = 1) => get('/movie/popular', { page }),
  getTopRatedMovies: (page = 1) => get('/movie/top_rated', { page }),
  getUpcomingMovies: (page = 1) => get('/movie/upcoming', { page }),
  getNowPlayingMovies: (page = 1) => get('/movie/now_playing', { page }),
  getMovieDetails: (id) => get(`/movie/${id}`),
  getMovieCredits: (id) => get(`/movie/${id}/credits`),
  getMovieVideos: (id) => get(`/movie/${id}/videos`),
  getMovieRecommendations: (id, page = 1) => get(`/movie/${id}/recommendations`, { page }),
  getMovieReviews: (id, page = 1) => get(`/movie/${id}/reviews`, { page }),
  getMovieImages: (id) => get(`/movie/${id}/images`),

  // TV Shows
  getPopularTV: (page = 1) => get('/tv/popular', { page }),
  getTopRatedTV: (page = 1) => get('/tv/top_rated', { page }),
  getAiringToday: (page = 1) => get('/tv/airing_today', { page }),
  getTVDetails: (id) => get(`/tv/${id}`),
  getTVCredits: (id) => get(`/tv/${id}/credits`),
  getTVVideos: (id) => get(`/tv/${id}/videos`),
  getTVRecommendations: (id, page = 1) => get(`/tv/${id}/recommendations`, { page }),

  // Seasons & Episodes
  getSeasonDetails: (tvId, seasonNumber) => get(`/tv/${tvId}/season/${seasonNumber}`),
  getEpisodeDetails: (tvId, seasonNumber, episodeNumber) => get(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`),

  // People
  getPersonDetails: (id) => get(`/person/${id}`),

  // Search
  searchMovies: (query, page = 1) => get('/search/movie', { query, page }),
  searchTV: (query, page = 1) => get('/search/tv', { query, page }),
  searchPeople: (query, page = 1) => get('/search/person', { query, page }),
};

export default tmdbApi;
