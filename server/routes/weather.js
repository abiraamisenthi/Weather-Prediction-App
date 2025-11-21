const express = require('express');
const router = express.Router();
const axios = require('axios');
const SearchHistory = require('../models/SearchHistory');

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get current weather by city name
router.get('/current/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    // Fetch weather data from OpenWeatherMap
    const response = await axios.get(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      pressure: response.data.main.pressure,
      icon: response.data.weather[0].icon,
      clouds: response.data.clouds.all,
      visibility: response.data.visibility,
    };

    // Save to search history
    const historyEntry = new SearchHistory({
      city: weatherData.city,
      country: weatherData.country,
      temperature: weatherData.temperature,
      description: weatherData.description,
      humidity: weatherData.humidity,
      windSpeed: weatherData.windSpeed,
      icon: weatherData.icon,
    });

    await historyEntry.save();

    res.json({ success: true, data: weatherData });
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'City not found or API error',
      error: error.message 
    });
  }
});

// Get 5-day forecast
router.get('/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    const response = await axios.get(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    const forecastData = response.data.list.map(item => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    }));

    res.json({ success: true, data: forecastData });
  } catch (error) {
    console.error('Error fetching forecast:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Unable to fetch forecast data',
      error: error.message 
    });
  }
});

// Get weather by coordinates
router.get('/coordinates', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    const response = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      pressure: response.data.main.pressure,
      icon: response.data.weather[0].icon,
    };

    res.json({ success: true, data: weatherData });
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Unable to fetch weather data',
      error: error.message 
    });
  }
});

module.exports = router;
