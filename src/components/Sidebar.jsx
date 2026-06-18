import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Home', path: '/', icon: 'ri-home-4-line' },
    { name: 'Movies', path: '/movies', icon: 'ri-movie-2-line' },
    { name: 'TV Shows', path: '/tv', icon: 'ri-tv-2-line' },
    { name: 'Popular', path: '/popular', icon: 'ri-fire-line' },
    { name: 'Top Rated', path: '/top-rated', icon: 'ri-star-line' },
    { name: 'Search', path: '/search', icon: 'ri-search-line' },
  ];

  const personalItems = [
    { name: 'Favorites', path: '/favorites', icon: 'ri-heart-line' },
    { name: 'Watchlist', path: '/watchlist', icon: 'ri-bookmark-line' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      ></div>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="ri-play-circle-fill logo-icon"></i>
            <span className="logo-roost">Roost</span>
            <span className="logo-movies">Movies</span>
          </div>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <p className="nav-label">Menu</p>
            <ul>
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onClick={onClose}
                  >
                    <i className={item.icon}></i>
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            <p className="nav-label personal">Personal</p>
            <ul>
              {personalItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onClick={onClose}
                  >
                    <i className={item.icon}></i>
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
