# ⚡ Quick Start Guide

## 🚀 Get Running in 5 Minutes!

### 1️⃣ Install Dependencies (2 minutes)

```bash
# Backend
cd server
npm install

# Frontend (open new terminal)
cd client
npm install
```

### 2️⃣ Get API Key (1 minute)

1. Visit: https://openweathermap.org/api
2. Sign up (free)
3. Get your API key

### 3️⃣ Configure Environment (1 minute)

Create `server/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weather-prediction
WEATHER_API_KEY=paste_your_api_key_here
```

**Don't have MongoDB?** Use MongoDB Atlas (free cloud):
- Sign up at: https://www.mongodb.com/cloud/atlas
- Get connection string
- Replace MONGODB_URI with Atlas string

### 4️⃣ Start Application (30 seconds)

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### 5️⃣ Open Browser

Navigate to: `http://localhost:3000`

---

## 🎯 Test It Out

1. Type "London" in search bar
2. Click "Search"
3. See weather and forecast! ✨

---

## ❓ Issues?

### MongoDB not installed?
Use MongoDB Atlas (free cloud database) - see SETUP_GUIDE.md

### API key not working?
Wait 10 minutes after creation for activation

### Port already in use?
Change PORT in `server/.env` to 5001

---

## 📚 Need More Help?

Check `SETUP_GUIDE.md` for detailed instructions!

---

**That's it! You're all set! 🎉**
