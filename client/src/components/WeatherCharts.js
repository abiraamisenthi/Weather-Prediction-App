import React, { useState, useEffect } from 'react';
import '../styles/WeatherCharts.css';

const WeatherCharts = ({ city }) => {
  const [chartData, setChartData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeChart, setActiveChart] = useState('temperature');

  useEffect(() => {
    if (city) {
      fetchChartData();
      fetchTrendData();
    }
  }, [city]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/charts/history/${city}?days=7`);
      const data = await response.json();
      
      if (data.success) {
        setChartData(data.data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendData = async () => {
    try {
      const response = await fetch(`/api/charts/trend/${city}`);
      const data = await response.json();
      
      if (data.success) {
        setTrendData(data.data);
      }
    } catch (error) {
      console.error('Error fetching trend data:', error);
    }
  };

  const renderSimpleChart = (dataPoints, dataKey, label, color) => {
    if (!dataPoints || dataPoints.length === 0) return null;

    const values = dataPoints.map(d => d[dataKey]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    return (
      <div className="simple-chart">
        <h4>{label}</h4>
        <div className="chart-container">
          <div className="chart-bars">
            {dataPoints.map((point, index) => {
              const height = ((point[dataKey] - minValue) / range) * 100;
              return (
                <div key={index} className="chart-bar-wrapper">
                  <div 
                    className="chart-bar"
                    style={{ 
                      height: `${height}%`,
                      backgroundColor: color
                    }}
                  >
                    <span className="chart-value">{point[dataKey].toFixed(1)}</span>
                  </div>
                  <span className="chart-label">
                    {new Date(point.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderLineChart = (dataPoints, dataKey, label, color) => {
    if (!dataPoints || dataPoints.length === 0) return null;

    const values = dataPoints.map(d => d[dataKey]);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    // Create SVG path for line chart
    const points = dataPoints.map((point, index) => {
      const x = (index / (dataPoints.length - 1)) * 100;
      const y = 100 - ((point[dataKey] - minValue) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="line-chart">
        <h4>{label}</h4>
        <svg className="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {dataPoints.map((point, index) => {
            const x = (index / (dataPoints.length - 1)) * 100;
            const y = 100 - ((point[dataKey] - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                fill={color}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        <div className="chart-data-points">
          {dataPoints.map((point, index) => (
            <div key={index} className="data-point">
              <span className="data-value">{point[dataKey].toFixed(1)}</span>
              <span className="data-date">
                {new Date(point.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const chartTypes = [
    { id: 'temperature', name: 'Temperature', icon: '🌡️', color: '#ff6b6b' },
    { id: 'humidity', name: 'Humidity', icon: '💧', color: '#4ecdc4' },
    { id: 'windSpeed', name: 'Wind Speed', icon: '💨', color: '#95e1d3' },
    { id: 'pressure', name: 'Pressure', icon: '🔽', color: '#f38181' }
  ];

  if (loading) {
    return (
      <div className="charts-loading">
        <div className="spinner"></div>
        <p>Loading weather charts...</p>
      </div>
    );
  }

  return (
    <div className="weather-charts">
      <h3>📊 Weather Analytics</h3>

      {trendData && (
        <div className="trend-summary">
          <div className="trend-card">
            <span className="trend-icon">📈</span>
            <div>
              <p className="trend-label">Temperature Trend</p>
              <p className="trend-value">
                {trendData.trend === 'rising' ? '↗️ Rising' : 
                 trendData.trend === 'falling' ? '↘️ Falling' : '➡️ Stable'}
              </p>
            </div>
          </div>
          <div className="trend-card">
            <span className="trend-icon">🔺</span>
            <div>
              <p className="trend-label">Maximum</p>
              <p className="trend-value">{trendData.maximum}°C</p>
            </div>
          </div>
          <div className="trend-card">
            <span className="trend-icon">📊</span>
            <div>
              <p className="trend-label">Average</p>
              <p className="trend-value">{trendData.average}°C</p>
            </div>
          </div>
          <div className="trend-card">
            <span className="trend-icon">🔻</span>
            <div>
              <p className="trend-label">Minimum</p>
              <p className="trend-value">{trendData.minimum}°C</p>
            </div>
          </div>
        </div>
      )}

      <div className="chart-type-selector">
        {chartTypes.map((type) => (
          <button
            key={type.id}
            className={`chart-type-btn ${activeChart === type.id ? 'active' : ''}`}
            onClick={() => setActiveChart(type.id)}
          >
            <span>{type.icon}</span>
            {type.name}
          </button>
        ))}
      </div>

      {chartData && chartData.length > 0 ? (
        <div className="charts-display">
          {activeChart === 'temperature' && renderLineChart(chartData, 'temperature', 'Temperature (°C)', '#ff6b6b')}
          {activeChart === 'humidity' && renderSimpleChart(chartData, 'humidity', 'Humidity (%)', '#4ecdc4')}
          {activeChart === 'windSpeed' && renderLineChart(chartData, 'windSpeed', 'Wind Speed (m/s)', '#95e1d3')}
          {activeChart === 'pressure' && renderSimpleChart(chartData, 'pressure', 'Pressure (hPa)', '#f38181')}
        </div>
      ) : (
        <div className="no-chart-data">
          <p>📊 No historical data available. Showing forecast data.</p>
        </div>
      )}
    </div>
  );
};

export default WeatherCharts;
