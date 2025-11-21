# 🚀 Deployment Guide

Complete guide for deploying the Weather Prediction App to various cloud platforms.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [x] OpenWeatherMap API Key
- [x] MongoDB Atlas account (for production database)
- [x] Git repository created
- [x] All environment variables ready
- [x] Application tested locally

---

## 🌐 Deployment Options

### 1. Vercel (Frontend) + Railway/Render (Backend)

**Recommended for:** Beginners, Free tier available

#### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from client directory
cd client
vercel

# Follow prompts:
# - Set up and deploy: Y
# - Which scope: Your account
# - Link to existing project: N
# - Project name: weather-prediction-frontend
# - Directory: n
# - Override settings: N
```

**Environment Variables (Vercel Dashboard):**
- No environment variables needed for frontend

#### Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Click "Add variables" and add:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   WEATHER_API_KEY=your_openweathermap_api_key
   NODE_ENV=production
   ```
6. Railway will automatically deploy
7. Get your backend URL from Railway dashboard

**Update Frontend:**
```bash
# In client/package.json, update proxy:
"proxy": "https://your-railway-app.railway.app"
```

---

### 2. Render (Full Stack)

**Recommended for:** Simple all-in-one deployment

#### Step 1: Prepare Repository

```bash
# Commit all changes
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Deploy Backend

1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name:** weather-prediction-api
   - **Environment:** Node
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Instance Type:** Free

6. Add Environment Variables:
   ```
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_uri
   WEATHER_API_KEY=your_api_key
   NODE_ENV=production
   ```

7. Click "Create Web Service"

#### Step 3: Deploy Frontend

1. Click "New +" → "Static Site"
2. Connect same repository
3. Configure:
   - **Name:** weather-prediction-frontend
   - **Build Command:** `cd client && npm install && npm run build`
   - **Publish Directory:** `client/build`

4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://weather-prediction-api.onrender.com
   ```

5. Update `client/src/services/weatherService.js`:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
   ```

---

### 3. Heroku (Full Stack)

**Note:** Heroku removed free tier, but still popular

#### Deploy Backend

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd server
heroku create weather-prediction-api

# Add MongoDB addon (paid) or use Atlas
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set WEATHER_API_KEY=your_api_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Open app
heroku open
```

#### Deploy Frontend

```bash
cd client

# Create separate Heroku app for frontend
heroku create weather-prediction-frontend

# Add buildpack
heroku buildpacks:set mars/create-react-app

# Set API URL
heroku config:set REACT_APP_API_URL=https://weather-prediction-api.herokuapp.com

# Deploy
git push heroku main
```

---

### 4. Netlify (Frontend) + Railway (Backend)

#### Deploy Backend to Railway (see Railway section above)

#### Deploy Frontend to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd client
netlify deploy

# Follow prompts:
# - Create new site
# - Team: Your team
# - Site name: weather-prediction-frontend
# - Publish directory: build

# Build first
npm run build

# Deploy to production
netlify deploy --prod
```

**Configure Netlify:**
1. Go to Netlify dashboard
2. Site Settings → Build & Deploy → Environment
3. Add variables:
   ```
   REACT_APP_API_URL=https://your-railway-backend.railway.app
   ```

4. Redeploy site

---

### 5. Docker + Any Cloud Provider

#### Build and Run with Docker

```bash
# Build the image
docker build -t weather-prediction-app .

# Run with docker-compose
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

#### Deploy to DigitalOcean App Platform

1. Push code to GitHub
2. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
3. Click "Create App" → "GitHub"
4. Select repository
5. Configure components:
   - **Backend:** Docker, Dockerfile path, Port 5000
   - **Database:** MongoDB (or use Atlas)
6. Add environment variables
7. Deploy

#### Deploy to AWS ECS

```bash
# Install AWS CLI
aws configure

# Create ECR repository
aws ecr create-repository --repository-name weather-prediction

# Build and push Docker image
docker tag weather-prediction-app:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/weather-prediction:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/weather-prediction:latest

# Create ECS cluster, task definition, and service (use AWS Console or CLI)
```

---

## 🗄️ Database Deployment (MongoDB Atlas)

### Setup MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create new cluster (Free M0 Sandbox)
4. Choose cloud provider and region
5. Click "Create Cluster" (takes 3-7 minutes)

### Configure Database

1. **Network Access:**
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

2. **Database User:**
   - Click "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `weather-admin`
   - Password: Generate secure password
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

3. **Get Connection String:**
   - Click "Clusters" → "Connect"
   - Choose "Connect your application"
   - Driver: Node.js, Version: 4.1 or later
   - Copy connection string:
     ```
     mongodb+srv://weather-admin:<password>@cluster0.xxxxx.mongodb.net/weather-prediction?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password

4. **Test Connection:**
   ```bash
   # In your .env file
   MONGODB_URI=your_atlas_connection_string
   
   # Test locally
   cd server
   npm start
   ```

---

## 🔐 Environment Variables Reference

### Backend (.env)

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weather-prediction?retryWrites=true&w=majority

# External APIs
WEATHER_API_KEY=your_openweathermap_api_key
```

### Frontend

```bash
# API Configuration (for production)
REACT_APP_API_URL=https://your-backend-url.com
```

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Backend API is accessible
- [ ] Frontend loads correctly
- [ ] Can search for weather by city
- [ ] Weather data displays correctly
- [ ] 5-day forecast works
- [ ] Search history saves to database
- [ ] Geolocation feature works
- [ ] Weather alerts display
- [ ] City comparison works
- [ ] Weather map loads
- [ ] Charts display correctly
- [ ] All API endpoints respond
- [ ] No CORS errors in console
- [ ] SSL certificate is active (HTTPS)

---

## 🐛 Troubleshooting Deployment

### Common Issues

**1. CORS Errors**
```javascript
// Add to server/server.js
const cors = require('cors');
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true
}));
```

**2. Environment Variables Not Loading**
- Verify all variables are set in platform dashboard
- Restart the service after adding variables
- Check spelling and no extra spaces

**3. MongoDB Connection Failed**
- Whitelist IP address: 0.0.0.0/0 in Atlas
- Check connection string format
- Verify database user credentials
- Ensure password is URL-encoded

**4. Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**5. API Key Issues**
- Verify API key is active (wait 10-15 minutes)
- Check API call limits
- Ensure no extra quotes or spaces

---

## 📊 Monitoring & Maintenance

### Set Up Monitoring

**1. Uptime Monitoring:**
- Use [UptimeRobot](https://uptimerobot.com) (free)
- Add your frontend and backend URLs
- Get alerts when site goes down

**2. Error Tracking:**
- Integrate [Sentry](https://sentry.io) for error logging
- Add to both frontend and backend

**3. Analytics:**
- Add Google Analytics to frontend
- Track user interactions and popular cities

### Backup Database

```bash
# Export MongoDB data
mongodump --uri="your_mongodb_atlas_uri" --out=./backup

# Import to another database
mongorestore --uri="new_mongodb_uri" ./backup
```

---

## 💰 Cost Estimates

### Free Tier Options

| Service | Frontend | Backend | Database |
|---------|----------|---------|----------|
| **Vercel + Railway + Atlas** | Free | $5/mo* | Free |
| **Netlify + Render + Atlas** | Free | Free* | Free |
| **Heroku** | $7/mo | $7/mo | $9/mo |

*Limited resources on free tier

### Recommended Production Setup

- **Frontend:** Vercel ($20/mo)
- **Backend:** Railway ($5-20/mo)
- **Database:** MongoDB Atlas M10 ($57/mo)
- **Total:** ~$82-97/month

---

## 🎉 Congratulations!

Your Weather Prediction App is now live! Share your deployed URL:

```
Frontend: https://your-frontend-url.com
Backend API: https://your-backend-url.com/api
```

---

**Need Help?** Check the troubleshooting section or review platform-specific documentation.
