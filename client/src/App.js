import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import ForecastDisplay from './components/ForecastDisplay';
import SearchHistory from './components/SearchHistory';
import WeatherAlerts from './components/WeatherAlerts';
import CityComparison from './components/CityComparison';
import WeatherMap from './components/WeatherMap';
import WeatherCharts from './components/WeatherCharts';
import { getCurrentWeather, getForecast, getSearchHistory } from './services/weatherService';
import './styles/App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('weather');
  const [coordinates, setCoordinates] = useState(null);

  // Load search history on component mount
  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const historyData = await getSearchHistory();
      setHistory(historyData);
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const weatherData = await getCurrentWeather(city);
      setWeather(weatherData);

      // Store coordinates if available
      if (weatherData.coordinates) {
        setCoordinates(weatherData.coordinates);
      }

      // Fetch forecast
      const forecastData = await getForecast(city);
      setForecast(forecastData);

      // Reload history
      await loadSearchHistory();
    } catch (err) {
      setError(err.message || 'City not found. Please try again.');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLoading(true);
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `/api/weather/coordinates?lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            
            if (data.success) {
              setWeather(data.data);
              // Also get forecast for the location
              const forecastData = await getForecast(data.data.city);
              setForecast(forecastData);
              await loadSearchHistory();
            }
          } catch (err) {
            setError('Unable to fetch weather for your location');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError('Unable to retrieve your location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>🌤️ Weather Prediction</h1>
          <p>Get real-time weather information and forecasts</p>
        </header>

        <SearchBar 
          onSearch={handleSearch} 
          onGetLocation={handleGetCurrentLocation}
          loading={loading}
        />

        {error && <div className="error-message">{error}</div>}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="feature-tabs">
          <button 
            className={`tab-btn ${activeTab === 'weather' ? 'active' : ''}`}
            onClick={() => setActiveTab('weather')}
          >
            🌤️ Weather
          </button>
          <button 
            className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            🔔 Alerts
          </button>
          <button 
            className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            🌍 Compare
          </button>
          <button 
            className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            🗺️ Map
          </button>
          <button 
            className={`tab-btn ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
          >
            📊 Charts
          </button>
        </div>

        {/* Weather Tab */}
        {activeTab === 'weather' && weather && !loading && (
          <>
            <WeatherDisplay weather={weather} />
            {forecast && <ForecastDisplay forecast={forecast} />}
          </>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && weather && !loading && (
          <WeatherAlerts city={weather.city} />
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <CityComparison />
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <WeatherMap city={weather?.city} coordinates={coordinates} />
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && weather && !loading && (
          <WeatherCharts city={weather.city} />
        )}

        <SearchHistory 
          history={history} 
          onHistoryClick={handleSearch}
          onRefresh={loadSearchHistory}
        />
      </div>
    </div>
  );
}

export default App;
