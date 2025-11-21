import React from 'react';
import '../styles/SearchHistory.css';

const SearchHistory = ({ history, onHistoryClick, onRefresh }) => {
  if (!history || history.length === 0) {
    return null;
  }

  const getWeatherIconUrl = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="search-history">
      <div className="history-header">
        <h3>Recent Searches</h3>
        <button onClick={onRefresh} className="refresh-button">
          🔄 Refresh
        </button>
      </div>
      
      <div className="history-list">
        {history.map((entry) => (
          <div 
            key={entry._id} 
            className="history-item"
            onClick={() => onHistoryClick(entry.city)}
          >
            <img 
              src={getWeatherIconUrl(entry.icon)} 
              alt={entry.description}
              className="history-icon"
            />
            <div className="history-info">
              <p className="history-city">{entry.city}, {entry.country}</p>
              <p className="history-temp">{Math.round(entry.temperature)}°C</p>
              <p className="history-desc">{entry.description}</p>
            </div>
            <div className="history-meta">
              <p className="history-date">{formatDate(entry.searchDate)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
