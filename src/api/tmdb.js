import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Reusable service functions (placeholders)
export const tmdbServices = {
  // Movies
  getPopularMovies: () => tmdbApi.get('/movie/popular'),
  getMovieDetails: (id) => tmdbApi.get(`/movie/${id}`),
  getMovieCredits: (id) => tmdbApi.get(`/movie/${id}/credits`),
  getMovieVideos: (id) => tmdbApi.get(`/movie/${id}/videos`),

  // TV Shows
  getPopularTV: () => tmdbApi.get('/tv/popular'),
  getTVDetails: (id) => tmdbApi.get(`/tv/${id}`),
  getTVCredits: (id) => tmdbApi.get(`/tv/${id}/credits`),
  getTVVideos: (id) => tmdbApi.get(`/tv/${id}/videos`),
  getTVSeasonDetails: (id, seasonNumber) => tmdbApi.get(`/tv/${id}/season/${seasonNumber}`),

  // Person
  getPersonDetails: (id) => tmdbApi.get(`/person/${id}`),
  getPersonCombinedCredits: (id) => tmdbApi.get(`/person/${id}/combined_credits`),

  // Search
  searchMulti: (query) => tmdbApi.get('/search/multi', { params: { query } }),

  // Trending
  getTrending: (type = 'all', timeWindow = 'day') => tmdbApi.get(`/trending/${type}/${timeWindow}`),
};

export default tmdbApi;
