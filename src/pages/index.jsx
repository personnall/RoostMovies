import React from 'react';

const PagePlaceholder = ({ title }) => {
  return (
    <div className="page-placeholder">
      <h1>{title}</h1>
      <p>Content for {title} will be implemented in future phases.</p>
    </div>
  );
};

export const Home = () => <PagePlaceholder title="Home" />;
export const Movies = () => <PagePlaceholder title="Movies" />;
export const TVShows = () => <PagePlaceholder title="TV Shows" />;
export const MovieDetails = () => <PagePlaceholder title="Movie Details" />;
export const TVDetails = () => <PagePlaceholder title="TV Details" />;
export const PersonDetails = () => <PagePlaceholder title="Person Details" />;
export const Search = () => <PagePlaceholder title="Search" />;
export const Favorites = () => <PagePlaceholder title="Favorites" />;
export const Watchlist = () => <PagePlaceholder title="Watchlist" />;
export const Player = () => (
  <div className="player-page">
    <h1>Player</h1>
    <div className="player-container" style={{
      aspectRatio: '16/9',
      backgroundColor: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid var(--border)',
      marginTop: '2rem'
    }}>
      <p style={{ color: 'var(--secondary-text)' }}>Video Player Placeholder</p>
    </div>
  </div>
);
