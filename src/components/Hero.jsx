import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbServices, getImageUrl } from '../api/tmdb';
import { useGenres } from '../context/GenreContext';
import { HeroSkeleton } from './Skeletons';
import './Hero.css';

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [movieLogos, setMovieLogos] = useState({});
  const { getGenreNames } = useGenres();
  const navigate = useNavigate();

  const fetchHeroData = useCallback(async () => {
    try {
      const popularRes = await tmdbServices.getPopularMovies();
      const top10 = popularRes.results.slice(0, 10);
      setMovies(top10);

      // Fetch logos for top 10
      const logoPromises = top10.map(movie =>
        tmdbServices.getMovieImages(movie.id).then(res => ({
          id: movie.id,
          logo: res.logos.find(l => l.iso_639_1 === 'en' || !l.iso_639_1)?.file_path
        }))
      );

      const logos = await Promise.all(logoPromises);
      const logoMap = {};
      logos.forEach(l => {
        if (l.logo) logoMap[l.id] = l.logo;
      });
      setMovieLogos(logoMap);
    } catch (error) {
      console.error('Failed to fetch hero data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroData();
  }, [fetchHeroData]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  }, [movies.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (movies.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [movies.length, nextSlide]);

  if (loading) return <HeroSkeleton />;
  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const genres = getGenreNames(currentMovie.genre_ids);
  const year = new Date(currentMovie.release_date).getFullYear();
  const logoPath = movieLogos[currentMovie.id];

  return (
    <div className="hero-container">
      <div className="hero-slide">
        <div className="hero-backdrop">
          <img
            src={getImageUrl(currentMovie.backdrop_path)}
            alt={currentMovie.title}
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-info-top">
            <span className="hero-rating">
              <i className="ri-star-fill"></i>
              {currentMovie.vote_average.toFixed(1)}
            </span>
            <span className="hero-year">{year}</span>
            <div className="hero-genres">
              {genres.slice(0, 3).map(g => (
                <span key={g} className="genre-tag">{g}</span>
              ))}
            </div>
          </div>

          <div className="hero-branding">
            {logoPath ? (
              <img
                src={getImageUrl(logoPath, 'w500')}
                alt={currentMovie.title}
                className="hero-logo"
              />
            ) : (
              <h1 className="hero-title">{currentMovie.title}</h1>
            )}
          </div>

          <p className="hero-overview">{currentMovie.overview}</p>

          <div className="hero-btns">
            <button
              className="hero-btn primary"
              onClick={() => navigate(`/player/movie/${currentMovie.id}`)}
            >
              <i className="ri-play-fill"></i>
              <span>Watch Now</span>
            </button>
            <button
              className="hero-btn secondary"
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
            >
              <i className="ri-information-line"></i>
              <span>More Info</span>
            </button>
          </div>
        </div>

        <div className="hero-nav">
          <button className="hero-nav-btn prev" onClick={prevSlide}>
            <i className="ri-arrow-left-s-line"></i>
          </button>
          <button className="hero-nav-btn next" onClick={nextSlide}>
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>

        <div className="hero-indicators">
          {movies.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              {index === currentIndex && <div className="indicator-progress"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
