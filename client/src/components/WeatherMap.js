import React, { useState, useEffect } from 'react';
import '../styles/WeatherMap.css';

const WeatherMap = ({ city, coordinates }) => {
  const [mapLayer, setMapLayer] = useState('temp');
  const [mapUrl, setMapUrl] = useState('');

  const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Will be passed from backend

  useEffect(() => {
    if (coordinates) {
      updateMap();
    }
  }, [mapLayer, coordinates]);

  const updateMap = () => {
    if (!coordinates) return;

    const { lat, lon } = coordinates;
    const zoom = 10;

    // OpenWeatherMap tile layers
    const layers = {
      temp: 'temp_new',      // Temperature
      precipitation: 'precipitation_new',  // Precipitation
      clouds: 'clouds_new',  // Clouds
      pressure: 'pressure_new',  // Pressure
      wind: 'wind_new'       // Wind speed
    };

    // Using OpenStreetMap as base with weather overlay
    const baseMap = `https://tile.openstreetmap.org/${zoom}/${lon}/${lat}.png`;
    const weatherOverlay = `https://tile.openweathermap.org/map/${layers[mapLayer]}/${zoom}/${lon}/${lat}.png?appid=${API_KEY}`;
    
    setMapUrl(weatherOverlay);
  };

  const mapLayers = [
    { id: 'temp', name: 'Temperature', icon: '🌡️' },
    { id: 'precipitation', name: 'Precipitation', icon: '🌧️' },
    { id: 'clouds', name: 'Clouds', icon: '☁️' },
    { id: 'pressure', name: 'Pressure', icon: '🔽' },
    { id: 'wind', name: 'Wind Speed', icon: '💨' }
  ];

  return (
    <div className="weather-map">
      <h3>🗺️ Weather Map</h3>
      
      <div className="map-controls">
        {mapLayers.map((layer) => (
          <button
            key={layer.id}
            className={`map-layer-btn ${mapLayer === layer.id ? 'active' : ''}`}
            onClick={() => setMapLayer(layer.id)}
          >
            <span className="layer-icon">{layer.icon}</span>
            {layer.name}
          </button>
        ))}
      </div>

      <div className="map-container">
        {coordinates ? (
          <div className="map-iframe-container">
            {/* Using Leaflet-based map embed */}
            <iframe
              title="Weather Map"
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://openweathermap.org/weathermap?basemap=map&cities=false&layer=${mapLayer}&lat=${coordinates.lat}&lon=${coordinates.lon}&zoom=10`}
              style={{ border: 0 }}
            />
          </div>
        ) : (
          <div className="map-placeholder">
            <p>🗺️ Search for a city to view the weather map</p>
          </div>
        )}
      </div>

      <div className="map-legend">
        <h4>Map Legend</h4>
        <div className="legend-content">
          {mapLayer === 'temp' && (
            <div className="legend-info">
              <div className="legend-gradient temp-gradient"></div>
              <p>Temperature range from cold (blue) to hot (red)</p>
            </div>
          )}
          {mapLayer === 'precipitation' && (
            <div className="legend-info">
              <div className="legend-gradient precip-gradient"></div>
              <p>Precipitation intensity from light to heavy</p>
            </div>
          )}
          {mapLayer === 'clouds' && (
            <div className="legend-info">
              <div className="legend-gradient clouds-gradient"></div>
              <p>Cloud coverage from clear to overcast</p>
            </div>
          )}
          {mapLayer === 'wind' && (
            <div className="legend-info">
              <p>Arrows indicate wind direction and speed</p>
            </div>
          )}
          {mapLayer === 'pressure' && (
            <div className="legend-info">
              <div className="legend-gradient pressure-gradient"></div>
              <p>Atmospheric pressure levels</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;
