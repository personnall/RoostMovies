import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { tmdbServices, getImageUrl } from '../api/tmdb';
import { useDebounce } from '../hooks/useDebounce';
import MovieCard from '../components/MovieCard';
import { SectionSkeleton } from '../components/Skeletons';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('movie'); // movie, tv, person
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  const fetchResults = useCallback(async () => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      let res;
      if (activeTab === 'movie') {
        res = await tmdbServices.searchMovies(debouncedQuery);
      } else if (activeTab === 'tv') {
        res = await tmdbServices.searchTV(debouncedQuery);
      } else {
        res = await tmdbServices.searchPeople(debouncedQuery);
      }
      setResults(res.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, activeTab]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResults([]);
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="search-input-wrapper">
          <i className="ri-search-line"></i>
          <input
            type="text"
            placeholder="Search for movies, tv shows, or people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="search-tabs">
          <button
            className={`tab-btn ${activeTab === 'movie' ? 'active' : ''}`}
            onClick={() => handleTabChange('movie')}
          >
            Movies
          </button>
          <button
            className={`tab-btn ${activeTab === 'tv' ? 'active' : ''}`}
            onClick={() => handleTabChange('tv')}
          >
            TV Shows
          </button>
          <button
            className={`tab-btn ${activeTab === 'person' ? 'active' : ''}`}
            onClick={() => handleTabChange('person')}
          >
            People
          </button>
        </div>
      </div>

      <div className="search-results">
        {loading ? (
          <SectionSkeleton />
        ) : results.length > 0 ? (
          <div className="results-grid">
            {results.map((item) => (
              activeTab === 'person' ? (
                <Link to={`/person/${item.id}`} key={item.id} className="person-card">
                  <div className="person-image">
                    <img
                      src={getImageUrl(item.profile_path, 'w500') || 'https://via.placeholder.com/500x500?text=No+Image'}
                      alt={item.name}
                    />
                  </div>
                  <div className="person-info">
                    <h3 className="person-name">{item.name}</h3>
                    <p className="person-known">{item.known_for_department}</p>
                  </div>
                </Link>
              ) : (
                <MovieCard key={item.id} item={item} type={activeTab} />
              )
            ))}
          </div>
        ) : debouncedQuery ? (
          <div className="empty-state">
            <i className="ri-search-eye-line"></i>
            <p>No results found for "{debouncedQuery}" in {activeTab === 'movie' ? 'Movies' : activeTab === 'tv' ? 'TV Shows' : 'People'}.</p>
          </div>
        ) : (
          <div className="empty-state">
            <i className="ri-search-line"></i>
            <p>Start typing to search...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
