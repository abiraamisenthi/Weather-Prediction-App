const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));

// Routes
const weatherRoutes = require('./routes/weather');
const searchHistoryRoutes = require('./routes/searchHistory');
const alertsRoutes = require('./routes/alerts');
const comparisonRoutes = require('./routes/comparison');
const chartsRoutes = require('./routes/charts');

app.use('/api/weather', weatherRoutes);
app.use('/api/history', searchHistoryRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/charts', chartsRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Weather Prediction API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
