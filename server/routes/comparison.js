const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Compare weather for multiple cities
router.post('/cities', async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an array of city names' 
      });
    }

    if (cities.length > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Maximum 5 cities can be compared at once' 
      });
    }

    // Fetch weather data for all cities in parallel
    const weatherPromises = cities.map(city => 
      axios.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => ({
          success: true,
          city: city,
          data: {
            name: response.data.name,
            country: response.data.sys.country,
            temperature: response.data.main.temp,
            feelsLike: response.data.main.feels_like,
            tempMin: response.data.main.temp_min,
            tempMax: response.data.main.temp_max,
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            pressure: response.data.main.pressure,
            icon: response.data.weather[0].icon,
            clouds: response.data.clouds.all,
            visibility: response.data.visibility,
            sunrise: response.data.sys.sunrise,
            sunset: response.data.sys.sunset
          }
        }))
        .catch(error => ({
          success: false,
          city: city,
          error: 'City not found'
        }))
    );

    const results = await Promise.all(weatherPromises);
    
    // Calculate comparison statistics
    const successfulResults = results.filter(r => r.success);
    
    if (successfulResults.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'None of the cities were found' 
      });
    }

    const temperatures = successfulResults.map(r => r.data.temperature);
    const comparison = {
      hottestCity: successfulResults.reduce((prev, current) => 
        (prev.data.temperature > current.data.temperature) ? prev : current
      ),
      coldestCity: successfulResults.reduce((prev, current) => 
        (prev.data.temperature < current.data.temperature) ? prev : current
      ),
      averageTemp: (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1),
      tempDifference: (Math.max(...temperatures) - Math.min(...temperatures)).toFixed(1)
    };

    res.json({ 
      success: true, 
      data: {
        results: results,
        comparison: comparison,
        successCount: successfulResults.length,
        totalCount: cities.length
      }
    });

  } catch (error) {
    console.error('Error comparing cities:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Unable to compare cities',
      error: error.message 
    });
  }
});

// Get detailed comparison for two cities
router.get('/compare/:city1/:city2', async (req, res) => {
  try {
    const { city1, city2 } = req.params;

    const [weather1, weather2] = await Promise.all([
      axios.get(`${BASE_URL}/weather?q=${city1}&appid=${API_KEY}&units=metric`),
      axios.get(`${BASE_URL}/weather?q=${city2}&appid=${API_KEY}&units=metric`)
    ]);

    const comparison = {
      city1: {
        name: weather1.data.name,
        temperature: weather1.data.main.temp,
        humidity: weather1.data.main.humidity,
        windSpeed: weather1.data.wind.speed,
        description: weather1.data.weather[0].description
      },
      city2: {
        name: weather2.data.name,
        temperature: weather2.data.main.temp,
        humidity: weather2.data.main.humidity,
        windSpeed: weather2.data.wind.speed,
        description: weather2.data.weather[0].description
      },
      differences: {
        temperature: (weather1.data.main.temp - weather2.data.main.temp).toFixed(1),
        humidity: weather1.data.main.humidity - weather2.data.main.humidity,
        windSpeed: (weather1.data.wind.speed - weather2.data.wind.speed).toFixed(1)
      }
    };

    res.json({ success: true, data: comparison });

  } catch (error) {
    console.error('Error comparing cities:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Unable to compare cities',
      error: error.message 
    });
  }
});

module.exports = router;
