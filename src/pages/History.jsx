import React from 'react';
import { useHistory } from '../context/HistoryContext';
import MovieCard from '../components/MovieCard';
import './Lists.css';

const History = () => {
  const { history, clearHistory } = useHistory();

  return (
    <div className="lists-page">
      <div className="list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Watch History</h1>
          <p>Your recently viewed movies and TV shows</p>
        </div>
        {history.length > 0 && (
          <button className="clear-btn" onClick={clearHistory}>
            <i className="ri-delete-bin-line"></i> Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-list">
          <i className="ri-history-line"></i>
          <h2>Your history is empty</h2>
          <p>Start watching something to build your history!</p>
        </div>
      ) : (
        <div className="list-grid">
          {history.map((item) => (
            <div key={item.id} className="history-item-wrapper">
              <MovieCard item={item} type={item.type} />
              {item.type === 'tv' && (
                <div className="history-badge">
                  S{item.season} E{item.episode}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
