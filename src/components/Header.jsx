import React from 'react';
import './Header.css';

const Header = ({ onMenuClick }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <i className="ri-menu-2-line"></i>
        </button>
      </div>

      <div className="header-right">
        <div className="header-search">
          <i className="ri-search-line"></i>
          <input type="text" placeholder="Search movies, tv shows, people..." />
        </div>
        <div className="header-actions">
          <button className="icon-btn">
            <i className="ri-notification-3-line"></i>
          </button>
          <div className="user-profile">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Roost"
              alt="User Avatar"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
