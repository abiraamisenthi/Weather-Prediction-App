import React, { useState, useEffect } from 'react';
import '../styles/WeatherAlerts.css';

const WeatherAlerts = ({ city }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (city) {
      fetchAlerts();
    }
  }, [city]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/alerts/${city}`);
      const data = await response.json();
      
      if (data.success && data.data.alerts) {
        setAlerts(data.data.alerts);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'extreme':
        return '#d32f2f';
      case 'severe':
        return '#f57c00';
      case 'moderate':
        return '#ffa726';
      case 'minor':
        return '#fdd835';
      default:
        return '#42a5f5';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'extreme':
        return '🚨';
      case 'severe':
        return '⚠️';
      case 'moderate':
        return '⚡';
      case 'minor':
        return '📢';
      default:
        return 'ℹ️';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (loading) {
    return (
      <div className="alerts-loading">
        <div className="spinner-small"></div>
        <p>Checking for weather alerts...</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="no-alerts">
        <span className="no-alerts-icon">✅</span>
        <p>No active weather alerts for this location</p>
      </div>
    );
  }

  return (
    <div className="weather-alerts">
      <h3>🔔 Weather Alerts ({alerts.length})</h3>
      <div className="alerts-container">
        {alerts.map((alert, index) => (
          <div 
            key={index} 
            className="alert-card"
            style={{ borderLeftColor: getSeverityColor(alert.severity) }}
          >
            <div className="alert-header">
              <span className="alert-icon">{getSeverityIcon(alert.severity)}</span>
              <div className="alert-title-section">
                <h4>{alert.event}</h4>
                <span 
                  className="alert-severity"
                  style={{ backgroundColor: getSeverityColor(alert.severity) }}
                >
                  {alert.severity || 'Advisory'}
                </span>
              </div>
            </div>
            
            <p className="alert-description">{alert.description}</p>
            
            {alert.start && (
              <div className="alert-times">
                <p><strong>Start:</strong> {formatDate(alert.start)}</p>
                {alert.end && <p><strong>End:</strong> {formatDate(alert.end)}</p>}
              </div>
            )}

            {alert.sender_name && (
              <p className="alert-sender">
                <strong>Source:</strong> {alert.sender_name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAlerts;
