const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get weather alerts for a location
router.get('/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    // First get coordinates for the city
    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );

    if (geoResponse.data.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'City not found' 
      });
    }

    const { lat, lon } = geoResponse.data[0];

    // Get One Call API data (includes alerts)
    const oneCallResponse = await axios.get(
      `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const alerts = oneCallResponse.data.alerts || [];
    
    // Generate custom alerts based on weather conditions
    const current = oneCallResponse.data.current;
    const customAlerts = [];

    // Temperature alerts
    if (current.temp > 35) {
      customAlerts.push({
        event: 'Extreme Heat Warning',
        description: 'Temperature is dangerously high. Stay hydrated and avoid prolonged sun exposure.',
        severity: 'extreme',
        start: current.dt,
        end: current.dt + 86400
      });
    } else if (current.temp < 0) {
      customAlerts.push({
        event: 'Freezing Temperature Alert',
        description: 'Temperature is below freezing. Protect pipes and dress warmly.',
        severity: 'moderate',
        start: current.dt,
        end: current.dt + 86400
      });
    }

    // Wind alerts
    if (current.wind_speed > 15) {
      customAlerts.push({
        event: 'High Wind Advisory',
        description: `Strong winds detected at ${current.wind_speed.toFixed(1)} m/s. Secure loose objects.`,
        severity: 'moderate',
        start: current.dt,
        end: current.dt + 86400
      });
    }

    // Rain/Storm alerts
    if (current.weather[0].main === 'Thunderstorm') {
      customAlerts.push({
        event: 'Thunderstorm Warning',
        description: 'Thunderstorm activity detected. Stay indoors and avoid open areas.',
        severity: 'severe',
        start: current.dt,
        end: current.dt + 10800
      });
    }

    // UV Index alerts
    if (current.uvi > 8) {
      customAlerts.push({
        event: 'High UV Index Alert',
        description: `UV Index is ${current.uvi.toFixed(1)}. Use sunscreen and limit sun exposure.`,
        severity: 'moderate',
        start: current.dt,
        end: current.dt + 21600
      });
    }

    // Air quality alerts (if available)
    if (current.air_quality && current.air_quality.aqi > 100) {
      customAlerts.push({
        event: 'Air Quality Alert',
        description: 'Poor air quality detected. Limit outdoor activities.',
        severity: 'moderate',
        start: current.dt,
        end: current.dt + 86400
      });
    }

    const allAlerts = [...alerts, ...customAlerts];

    res.json({ 
      success: true, 
      data: {
        alerts: allAlerts,
        hasAlerts: allAlerts.length > 0,
        alertCount: allAlerts.length
      }
    });

  } catch (error) {
    console.error('Error fetching alerts:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Unable to fetch weather alerts',
      error: error.message 
    });
  }
});

module.exports = router;
