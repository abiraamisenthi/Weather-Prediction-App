const mongoose = require('mongoose');

// Model for storing historical weather data for charts
const weatherDataSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  windSpeed: {
    type: Number,
    required: true,
  },
  pressure: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  recordedDate: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
weatherDataSchema.index({ city: 1, recordedDate: -1 });

module.exports = mongoose.model('WeatherData', weatherDataSchema);
