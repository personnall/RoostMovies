import React from 'react';
import './Header.css';

const Header = ({ onMenuClick }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <i className="ri-menu-line"></i>
        </button>
        <div className="logo">
          <span className="logo-roost">Roost</span>
          <span className="logo-movies">Movies</span>
        </div>
      </div>

      <div className="header-right">
        <div className="search-bar">
          <i className="ri-search-line"></i>
          <input type="text" placeholder="Search movies, tv shows, people..." />
        </div>
        <div className="user-profile">
          <i className="ri-user-3-line"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
