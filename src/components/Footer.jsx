import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">
            <i className="ri-play-circle-fill logo-icon"></i>
            <span className="logo-roost">Roost</span>
            <span className="logo-movies">Movies</span>
          </div>
          <p className="brand-tagline">
            Experience the best of movies and TV shows with RoostMovies.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><i className="ri-facebook-fill"></i></a>
            <a href="#" aria-label="Twitter"><i className="ri-twitter-fill"></i></a>
            <a href="#" aria-label="Instagram"><i className="ri-instagram-line"></i></a>
            <a href="#" aria-label="YouTube"><i className="ri-youtube-fill"></i></a>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <h3>Browse</h3>
            <ul>
              <li><Link to="/movies">Movies</Link></li>
              <li><Link to="/tv">TV Shows</Link></li>
              <li><Link to="/popular">Popular</Link></li>
              <li><Link to="/top-rated">Top Rated</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Account</h3>
            <ul>
              <li><Link to="/favorites">My Favorites</Link></li>
              <li><Link to="/watchlist">Watchlist</Link></li>
              <li><Link to="/history">Watch History</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Support</h3>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Terms of Use</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} RoostMovies. All rights reserved.</p>
        <p className="tmdb-attribution">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
