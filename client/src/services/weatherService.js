import axios from 'axios';

const API_BASE_URL = '/api';

export const getCurrentWeather = async (city) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather/current/${city}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch weather data');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'City not found');
  }
};

export const getForecast = async (city) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather/forecast/${city}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch forecast data');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Unable to fetch forecast');
  }
};

export const getSearchHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history`);
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

export const deleteHistoryEntry = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/history/${id}`);
    return response.data.success;
  } catch (error) {
    console.error('Error deleting history:', error);
    return false;
  }
};

export const clearHistory = async () => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/history`);
    return response.data.success;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
};
