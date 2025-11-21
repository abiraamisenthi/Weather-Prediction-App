# 📖 Complete Setup Guide

## Step-by-Step Installation Instructions

### Prerequisites Check

Before starting, verify you have these installed:

```bash
# Check Node.js version (should be 14+)
node --version

# Check npm version
npm --version

# Check MongoDB (if using local installation)
mongod --version
```

If any are missing:
- **Node.js & npm**: Download from [nodejs.org](https://nodejs.org/)
- **MongoDB**: Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

---

## 🔧 Detailed Setup Steps

### Step 1: Get OpenWeatherMap API Key

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click "Sign Up" (top right)
3. Create a free account
4. Verify your email
5. Go to your profile → "API Keys" section
6. Copy the default API key (or generate a new one)
7. **Important**: Wait 10 minutes for API key activation

### Step 2: MongoDB Setup

#### Option A: Local MongoDB Installation

**Windows:**
```bash
# Download from mongodb.com and install
# Start MongoDB service
net start MongoDB
```

**macOS:**
```bash
# Install with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Option B: MongoDB Atlas (Cloud - Recommended for Beginners)

1. Visit [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (select FREE tier)
4. Wait for cluster creation (5-10 minutes)
5. Click "Connect" on your cluster
6. Add your IP address (or allow access from anywhere: 0.0.0.0/0)
7. Create a database user with password
8. Choose "Connect your application"
9. Copy the connection string
10. Replace `<password>` with your database user password
11. Use this as your `MONGODB_URI` in `.env`

Example Atlas connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/weather-prediction?retryWrites=true&w=majority
```

### Step 3: Project Installation

```bash
# Create project directory
mkdir weather-prediction-app
cd weather-prediction-app

# Copy all project files to this directory
# (client/ and server/ folders)
```

### Step 4: Backend Configuration

```bash
# Navigate to server directory
cd server

# Install all dependencies
npm install

# This installs:
# - express (web framework)
# - mongoose (MongoDB ODM)
# - cors (cross-origin resource sharing)
# - dotenv (environment variables)
# - axios (HTTP client)
# - body-parser (request parsing)
# - nodemon (dev dependency)
```

Create `.env` file in `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weather-prediction
WEATHER_API_KEY=your_actual_api_key_here
```

**Important**: 
- Replace `your_actual_api_key_here` with your OpenWeatherMap API key
- If using MongoDB Atlas, replace the MONGODB_URI with your Atlas connection string
- Don't use quotes around values
- No spaces before/after the `=` sign

### Step 5: Frontend Configuration

```bash
# Navigate to client directory
cd ../client

# Install all dependencies
npm install

# This installs:
# - react & react-dom (UI library)
# - react-scripts (build tools)
# - axios (API requests)
# - react-icons (icons)
```

No additional configuration needed for the client!

### Step 6: Verify Installation

**Check Backend:**
```bash
cd server
npm start
```

You should see:
```
Server is running on port 5000
MongoDB connected successfully
```

**Check Frontend:**
```bash
# Open new terminal
cd client
npm start
```

Browser should automatically open to `http://localhost:3000`

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm start
```

### Production Mode

**Build Frontend:**
```bash
cd client
npm run build
```

**Serve with Backend:**
```bash
cd server
# Add this to server.js before app.listen():
app.use(express.static(path.join(__dirname, '../client/build')));

npm start
```

---

## ✅ Testing the Application

### 1. Test Backend API

Open browser or use curl:

```bash
# Health check
curl http://localhost:5000

# Get weather (replace YOUR_API_KEY)
curl "http://localhost:5000/api/weather/current/London"
```

### 2. Test Frontend

1. Open `http://localhost:3000`
2. Enter a city name (e.g., "London")
3. Click "Search"
4. Verify weather data displays
5. Check 5-day forecast appears
6. Scroll down to see search history

### 3. Test Geolocation

1. Click "📍 My Location" button
2. Allow location access when prompted
3. Verify your local weather displays

---

## 🐛 Common Issues & Solutions

### Issue 1: "API key not found" or "401 Unauthorized"

**Solution:**
- Verify API key in `.env` file
- Wait 10-15 minutes after creating API key
- Check for extra spaces or quotes in `.env`
- Restart the server after changing `.env`

### Issue 2: "MongoDB connection error"

**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod

# For Atlas, verify:
# - Connection string is correct
# - IP address is whitelisted
# - Database user credentials are correct
```

### Issue 3: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port
lsof -ti:3000

# Kill the process
kill -9 <PID>

# Or change port
# In client/package.json, change the start script:
"start": "PORT=3001 react-scripts start"
```

### Issue 4: "Port 5000 already in use"

**Solution:**
Change PORT in `server/.env`:
```env
PORT=5001
```

Also update proxy in `client/package.json`:
```json
"proxy": "http://localhost:5001"
```

### Issue 5: CORS errors

**Solution:**
Already handled by `cors` middleware in server.js, but if issues persist:

```javascript
// In server/server.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue 6: Module not found errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Next Steps

After successful setup:

1. **Customize the UI**: Edit CSS files in `client/src/styles/`
2. **Add Features**: 
   - Weather alerts
   - Multiple city comparison
   - Weather maps
   - Historical data charts
3. **Deploy**: 
   - Frontend: Vercel, Netlify
   - Backend: Heroku, Railway, Render
   - Database: MongoDB Atlas

---

## 📞 Getting Help

If you encounter issues:

1. Check this guide thoroughly
2. Review error messages carefully
3. Verify all prerequisites are installed
4. Check `.env` file configuration
5. Ensure MongoDB is running
6. Verify API key is activated

---

## 🎉 Success Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB running (local or Atlas)
- [ ] OpenWeatherMap API key obtained
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] `.env` file configured correctly
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can search for weather by city
- [ ] Can use current location feature
- [ ] Search history is saving and displaying

**Congratulations! Your Weather Prediction App is ready! 🎊**
