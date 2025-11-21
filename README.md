# 🌤️ Weather Prediction App

A full-stack weather prediction application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Get real-time weather information, 5-day forecasts, and track your search history.

## ✨ Features

- **Real-time Weather Data**: Get current weather information for any city worldwide
- **5-Day Forecast**: View detailed weather predictions for the next 5 days
- **Geolocation Support**: Automatically detect and display weather for your current location
- **Search History**: Track your recent weather searches with MongoDB persistence
- **Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile devices
- **Weather Details**: 
  - Temperature (actual and feels like)
  - Humidity levels
  - Wind speed
  - Atmospheric pressure
  - Cloud coverage
  - Visibility

## 🛠️ Technologies Used

### Frontend
- **React.js**: Component-based UI framework
- **Axios**: HTTP client for API requests
- **CSS3**: Custom styling with gradients and animations
- **React Icons**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for storing search history
- **Mongoose**: MongoDB object modeling
- **Axios**: API requests to OpenWeatherMap

### API
- **OpenWeatherMap API**: Real-time weather data provider

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- OpenWeatherMap API key (free tier available)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd weather-prediction-app
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weather-prediction
WEATHER_API_KEY=your_openweathermap_api_key_here
```

**Get your free API key:**
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key to the `.env` file

### 3. Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install
```

### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running on your system
# Default connection: mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` file

## ▶️ Running the Application

### Start Backend Server

```bash
# In the server directory
cd server
npm start

# Or use nodemon for development
npm run dev
```

Server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
# In the client directory
cd client
npm start
```

React app will run on `http://localhost:3000`

## 📱 Usage

1. **Search by City Name**: 
   - Enter any city name in the search bar
   - Click "Search" button
   - View current weather and 5-day forecast

2. **Use Current Location**:
   - Click "📍 My Location" button
   - Allow location access when prompted
   - View weather for your current location

3. **View Search History**:
   - Scroll down to see recent searches
   - Click on any history item to quickly search again
   - Click "🔄 Refresh" to update the list

## 📂 Project Structure

```
weather-prediction-app/
├── client/                    # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── SearchBar.js
│   │   │   ├── WeatherDisplay.js
│   │   │   ├── ForecastDisplay.js
│   │   │   └── SearchHistory.js
│   │   ├── services/         # API service layer
│   │   │   └── weatherService.js
│   │   ├── styles/           # CSS files
│   │   │   ├── App.css
│   │   │   ├── SearchBar.css
│   │   │   ├── WeatherDisplay.css
│   │   │   ├── ForecastDisplay.css
│   │   │   └── SearchHistory.css
│   │   ├── App.js            # Main App component
│   │   └── index.js          # Entry point
│   └── package.json
│
├── server/                    # Express backend
│   ├── models/               # Mongoose models
│   │   └── SearchHistory.js
│   ├── routes/               # API routes
│   │   ├── weather.js
│   │   └── searchHistory.js
│   ├── server.js             # Server entry point
│   ├── .env.example          # Environment variables template
│   └── package.json
│
└── README.md                 # Project documentation
```

## 🔌 API Endpoints

### Weather Endpoints

- `GET /api/weather/current/:city` - Get current weather by city name
- `GET /api/weather/forecast/:city` - Get 5-day forecast by city name
- `GET /api/weather/coordinates?lat=<lat>&lon=<lon>` - Get weather by coordinates

### History Endpoints

- `GET /api/history` - Get all search history
- `DELETE /api/history/:id` - Delete specific history entry
- `DELETE /api/history` - Clear all history

## 🎨 Features Showcase

### Responsive Design
- Mobile-first approach
- Smooth animations and transitions
- Gradient backgrounds
- Card-based layout

### User Experience
- Loading indicators
- Error handling with user-friendly messages
- Hover effects on interactive elements
- Smooth scrolling

### Data Visualization
- Weather icons from OpenWeatherMap
- Temperature in Celsius
- Detailed weather metrics
- Daily forecast cards

## 🔧 Customization

### Change Temperature Units

Edit `server/routes/weather.js`:
```javascript
// Change units=metric to units=imperial for Fahrenheit
const response = await axios.get(
  `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
);
```

### Modify Color Scheme

Edit CSS files in `client/src/styles/`:
- Primary gradient: `#667eea` to `#764ba2`
- Customize in `App.css` and component styles

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### API Key Issues
- Verify API key is correct in `.env`
- Check API key activation (may take 10 minutes)
- Ensure no extra spaces in `.env` file

### Port Already in Use
```bash
# Change PORT in server/.env
# Change proxy in client/package.json
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Created with ❤️ using MERN Stack

## 🙏 Acknowledgments

- [OpenWeatherMap API](https://openweathermap.org/) for weather data
- [React](https://reactjs.org/) for the amazing framework
- [MongoDB](https://www.mongodb.com/) for the database solution

---

**Happy Coding! 🌈**
