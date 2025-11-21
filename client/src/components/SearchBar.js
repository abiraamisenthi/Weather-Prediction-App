import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, onGetLocation, loading }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity('');
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Enter city name (e.g., London, New York)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
          className="search-input"
        />
        <button 
          type="submit" 
          disabled={loading || !city.trim()}
          className="search-button"
        >
          Search
        </button>
        <button 
          type="button" 
          onClick={onGetLocation}
          disabled={loading}
          className="location-button"
          title="Use my location"
        >
          📍 My Location
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
