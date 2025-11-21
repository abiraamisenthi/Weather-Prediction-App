import React from 'react';
import '../styles/ForecastDisplay.css';

const ForecastDisplay = ({ forecast }) => {
  // Group forecast by day and get one entry per day (noon time)
  const getDailyForecast = () => {
    const dailyData = {};
    
    forecast.forEach(item => {
      const date = new Date(item.date);
      const dateKey = date.toLocaleDateString();
      const hour = date.getHours();
      
      // Get forecast around noon (12:00) for each day
      if (!dailyData[dateKey] || Math.abs(hour - 12) < Math.abs(dailyData[dateKey].hour - 12)) {
        dailyData[dateKey] = {
          ...item,
          hour: hour,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
      }
    });
    
    return Object.values(dailyData).slice(0, 5); // Get next 5 days
  };

  const getWeatherIconUrl = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  const dailyForecast = getDailyForecast();

  return (
    <div className="forecast-display">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {dailyForecast.map((day, index) => (
          <div key={index} className="forecast-card">
            <p className="forecast-day">{day.dayName}</p>
            <p className="forecast-date">{day.fullDate}</p>
            <img 
              src={getWeatherIconUrl(day.icon)} 
              alt={day.description}
              className="forecast-icon"
            />
            <p className="forecast-temp">{Math.round(day.temperature)}°C</p>
            <p className="forecast-desc">
              {day.description.charAt(0).toUpperCase() + day.description.slice(1)}
            </p>
            <div className="forecast-details">
              <span>💧 {day.humidity}%</span>
              <span>💨 {day.windSpeed} m/s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastDisplay;
