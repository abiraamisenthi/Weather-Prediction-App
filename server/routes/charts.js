const express = require('express');
const router = express.Router();
const WeatherData = require('../models/WeatherData');
const axios = require('axios');

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get historical data for charts (last 7 days)
router.get('/history/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const historicalData = await WeatherData.find({
      city: new RegExp(city, 'i'),
      recordedDate: { $gte: startDate }
    })
    .sort({ recordedDate: 1 })
    .limit(100);

    // If no historical data, fetch forecast instead
    if (historicalData.length === 0) {
      const response = await axios.get(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      const forecastData = response.data.list.map(item => ({
        date: new Date(item.dt * 1000),
        temperature: item.main.temp,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        pressure: item.main.pressure
      }));

      return res.json({ 
        success: true, 
        data: forecastData,
        type: 'forecast',
        message: 'No historical data available, showing forecast'
      });
    }

    const chartData = historicalData.map(record => ({
      date: record.recordedDate,
      temperature: record.temperature,
      humidity: record.humidity,
      windSpeed: record.windSpeed,
      pressure: record.pressure
    }));

    res.json({ 
      success: true, 
      data: chartData,
      type: 'historical'
    });

  } catch (error) {
    console.error('Error fetching chart data:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Unable to fetch historical data',
      error: error.message 
    });
  }
});

// Record current weather data for historical tracking
router.post('/record', async (req, res) => {
  try {
    const { city } = req.body;

    const response = await axios.get(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const weatherRecord = new WeatherData({
      city: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      pressure: response.data.main.pressure,
      description: response.data.weather[0].description
    });

    await weatherRecord.save();

    res.json({ 
      success: true, 
      message: 'Weather data recorded successfully',
      data: weatherRecord
    });

  } catch (error) {
    console.error('Error recording weather data:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Unable to record weather data',
      error: error.message 
    });
  }
});

// Get temperature trend analysis
router.get('/trend/:city', async (req, res) => {
  try {
    const { city } = req.params;

    const response = await axios.get(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    const temperatures = response.data.list.map(item => item.main.temp);
    const avg = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    const max = Math.max(...temperatures);
    const min = Math.min(...temperatures);

    // Calculate trend (simple linear regression)
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    temperatures.forEach((temp, i) => {
      sumX += i;
      sumY += temp;
      sumXY += i * temp;
      sumXX += i * i;
    });

    const n = temperatures.length;
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const trend = slope > 0.1 ? 'rising' : slope < -0.1 ? 'falling' : 'stable';

    res.json({
      success: true,
      data: {
        average: avg.toFixed(1),
        maximum: max.toFixed(1),
        minimum: min.toFixed(1),
        trend: trend,
        trendValue: slope.toFixed(3),
        dataPoints: temperatures.length
      }
    });

  } catch (error) {
    console.error('Error analyzing trend:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Unable to analyze temperature trend',
      error: error.message 
    });
  }
});

module.exports = router;
