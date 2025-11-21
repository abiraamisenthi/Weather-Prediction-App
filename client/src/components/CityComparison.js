import React, { useState } from 'react';
import '../styles/CityComparison.css';

const CityComparison = () => {
  const [cities, setCities] = useState(['', '', '']);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCityChange = (index, value) => {
    const newCities = [...cities];
    newCities[index] = value;
    setCities(newCities);
  };

  const addCityField = () => {
    if (cities.length < 5) {
      setCities([...cities, '']);
    }
  };

  const removeCityField = (index) => {
    if (cities.length > 2) {
      const newCities = cities.filter((_, i) => i !== index);
      setCities(newCities);
    }
  };

  const handleCompare = async () => {
    const validCities = cities.filter(city => city.trim() !== '');
    
    if (validCities.length < 2) {
      setError('Please enter at least 2 cities to compare');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/comparison/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cities: validCities }),
      });

      const data = await response.json();

      if (data.success) {
        setComparisonData(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to compare cities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIconUrl = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  return (
    <div className="city-comparison">
      <h3>🌍 Compare Cities Weather</h3>
      
      <div className="comparison-input-section">
        {cities.map((city, index) => (
          <div key={index} className="city-input-group">
            <input
              type="text"
              placeholder={`City ${index + 1}`}
              value={city}
              onChange={(e) => handleCityChange(index, e.target.value)}
              className="city-input"
              disabled={loading}
            />
            {cities.length > 2 && (
              <button
                className="remove-city-btn"
                onClick={() => removeCityField(index)}
                disabled={loading}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <div className="comparison-actions">
          {cities.length < 5 && (
            <button
              className="add-city-btn"
              onClick={addCityField}
              disabled={loading}
            >
              ➕ Add City
            </button>
          )}
          <button
            className="compare-btn"
            onClick={handleCompare}
            disabled={loading}
          >
            {loading ? 'Comparing...' : '🔍 Compare'}
          </button>
        </div>
      </div>

      {error && <div className="comparison-error">{error}</div>}

      {loading && (
        <div className="comparison-loading">
          <div className="spinner"></div>
          <p>Comparing cities...</p>
        </div>
      )}

      {comparisonData && !loading && (
        <div className="comparison-results">
          <div className="comparison-summary">
            <div className="summary-card">
              <span className="summary-icon">🔥</span>
              <div>
                <p className="summary-label">Hottest City</p>
                <p className="summary-value">
                  {comparisonData.comparison.hottestCity.data.name} - 
                  {Math.round(comparisonData.comparison.hottestCity.data.temperature)}°C
                </p>
              </div>
            </div>

            <div className="summary-card">
              <span className="summary-icon">❄️</span>
              <div>
                <p className="summary-label">Coldest City</p>
                <p className="summary-value">
                  {comparisonData.comparison.coldestCity.data.name} - 
                  {Math.round(comparisonData.comparison.coldestCity.data.temperature)}°C
                </p>
              </div>
            </div>

            <div className="summary-card">
              <span className="summary-icon">📊</span>
              <div>
                <p className="summary-label">Average Temperature</p>
                <p className="summary-value">{comparisonData.comparison.averageTemp}°C</p>
              </div>
            </div>

            <div className="summary-card">
              <span className="summary-icon">📏</span>
              <div>
                <p className="summary-label">Temperature Range</p>
                <p className="summary-value">{comparisonData.comparison.tempDifference}°C</p>
              </div>
            </div>
          </div>

          <div className="comparison-grid">
            {comparisonData.results.map((result, index) => (
              result.success ? (
                <div key={index} className="comparison-city-card">
                  <h4>{result.data.name}, {result.data.country}</h4>
                  <img 
                    src={getWeatherIconUrl(result.data.icon)} 
                    alt={result.data.description}
                    className="comparison-icon"
                  />
                  <div className="comparison-temp">
                    {Math.round(result.data.temperature)}°C
                  </div>
                  <p className="comparison-desc">
                    {result.data.description.charAt(0).toUpperCase() + result.data.description.slice(1)}
                  </p>
                  
                  <div className="comparison-details">
                    <div className="detail-row">
                      <span>💧 Humidity:</span>
                      <span>{result.data.humidity}%</span>
                    </div>
                    <div className="detail-row">
                      <span>💨 Wind:</span>
                      <span>{result.data.windSpeed} m/s</span>
                    </div>
                    <div className="detail-row">
                      <span>🌡️ Pressure:</span>
                      <span>{result.data.pressure} hPa</span>
                    </div>
                    <div className="detail-row">
                      <span>☁️ Clouds:</span>
                      <span>{result.data.clouds}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={index} className="comparison-city-card error">
                  <h4>{result.city}</h4>
                  <p className="error-text">❌ {result.error}</p>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CityComparison;
