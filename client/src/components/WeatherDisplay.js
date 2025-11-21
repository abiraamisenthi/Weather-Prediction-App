import React from 'react';
import '../styles/WeatherDisplay.css';

const WeatherDisplay = ({ weather }) => {
  const getWeatherIconUrl = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@4x.png`;
  };

  return (
    <div className="weather-display">
      <div className="weather-main">
        <div className="weather-location">
          <h2>{weather.city}, {weather.country}</h2>
        </div>
        
        <div className="weather-content">
          <div className="weather-icon">
            <img 
              src={getWeatherIconUrl(weather.icon)} 
              alt={weather.description}
            />
          </div>
          
          <div className="weather-temp">
            <h1>{Math.round(weather.temperature)}°C</h1>
            <p className="weather-description">
              {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
            </p>
            <p className="feels-like">Feels like {Math.round(weather.feelsLike)}°C</p>
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <div className="detail-info">
            <p className="detail-label">Humidity</p>
            <p className="detail-value">{weather.humidity}%</p>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">💨</span>
          <div className="detail-info">
            <p className="detail-label">Wind Speed</p>
            <p className="detail-value">{weather.windSpeed} m/s</p>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">🌡️</span>
          <div className="detail-info">
            <p className="detail-label">Pressure</p>
            <p className="detail-value">{weather.pressure} hPa</p>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">☁️</span>
          <div className="detail-info">
            <p className="detail-label">Cloudiness</p>
            <p className="detail-value">{weather.clouds}%</p>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">👁️</span>
          <div className="detail-info">
            <p className="detail-label">Visibility</p>
            <p className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
