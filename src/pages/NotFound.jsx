import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page" style={{
      height: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '8rem', color: 'var(--primary-accent)', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Oops! Page Not Found</h2>
      <p style={{ color: 'var(--secondary-text)', maxWidth: '500px', marginBottom: '3rem' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="details-btn primary">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
