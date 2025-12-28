# Munch - Restaurant Discovery App

A Tinder-style restaurant discovery app built with React Native (Expo) and Node.js.

## 📱 Tech Stack

**Frontend:**
- React Native + Expo
- TypeScript
- NativeWind (Tailwind CSS)
- Expo Router (file-based routing)
- Expo Location

**Backend:**
- Node.js + Express
- Firebase Admin SDK (Firestore)
- Yelp Fusion API
- Zod validation

**Shared:**
- TypeScript types with Zod schemas

## 🏗️ Project Structure

```
Munch/
├── app/                    # Expo app screens
│   ├── (auth)/            # Auth flow screens
│   ├── (tabs)/            # Main tabs (Discover, Matches, Profile)
│   └── _layout.tsx        # Root layout
├── api/                   # Frontend API client
│   └── client.ts          # Centralized API client
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── config/        # Firebase, env config
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   └── services/      # Business logic (Yelp, Firestore)
│   ├── index.js           # Entry point
│   └── package.json
├── components/            # React components
├── constants/             # App constants & config
├── shared/                # Shared types between FE/BE
│   └── types.ts           # TypeScript + Zod schemas
└── package.json           # Frontend dependencies
```

## 📖 Documentation

**New to Munch?** See our comprehensive documentation:

- 🚀 **[START HERE](./START_HERE.md)** - Best starting point for everyone
- ⚡ **[Quick Start](./QUICK_START.md)** - Get running in 5 minutes
- 📚 **[Complete Setup Guide](./SETUP.md)** - Detailed instructions with troubleshooting
- ✅ **[Setup Checklist](./CHECKLIST.md)** - Verify your configuration
- 📡 **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- 🏗️ **[Architecture](./ARCHITECTURE.md)** - Technical deep dive
- 📊 **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - What was built
- 🎯 **[Project Status](./PROJECT_STATUS.md)** - Current status and next steps
- 🗺️ **[Documentation Index](./DOCS_INDEX.md)** - Find the right docs for you

**Not sure where to start?** → [START_HERE.md](./START_HERE.md)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Studio (Android Emulator)
- Yelp Fusion API key ([Get one here](https://www.yelp.com/developers))
- Firebase project with Firestore enabled

### 1. Clone & Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install shared package dependencies
cd shared
npm install
cd ..
```

### 2. Configure Backend

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env and set:
# - YELP_API_KEY=your_yelp_api_key
# - GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json

# Add your Firebase service account key
# Download from Firebase Console > Project Settings > Service Accounts
# Save as: backend/serviceAccountKey.json
```

### 3. Configure Frontend

```bash
cd ..  # Back to root

# Copy environment template
cp .env.example .env

# Edit .env and set API URL based on your setup:
# iOS Simulator:     EXPO_PUBLIC_API_URL=http://localhost:3000
# Android Emulator:  EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
# Physical Device:   EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000
```

### 4. Start Backend

```bash
cd backend
npm run dev
```

Backend will start on `http://localhost:3000`

### 5. Start Frontend

In a new terminal:

```bash
# From project root
npm start

# Then press:
# - 'i' for iOS Simulator
# - 'a' for Android Emulator
# - Scan QR code for physical device
```

## 📱 Running on Different Devices

### iOS Simulator (macOS only)

```bash
# .env
EXPO_PUBLIC_API_URL=http://localhost:3000

# Start backend, then:
npm run ios
```

### Android Emulator

```bash
# .env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000

# Start Android Studio emulator, then:
npm run android
```

### Physical Device (Same WiFi)

1. Find your computer's local IP:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

2. Update `.env`:
   ```bash
   EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000
   ```
   (Replace XXX with your IP)

3. Ensure backend is accessible on your network:
   ```bash
   cd backend
   npm run dev  # Backend already binds to 0.0.0.0
   ```

4. Start Expo and scan QR code:
   ```bash
   npm start
   ```

## 🔗 API Endpoints

Base URL: `http://localhost:3000`

### Health
- `GET /health` - Check server health

### Restaurants
- `GET /api/restaurants/search` - Search restaurants
  - Params: `term`, `location`, `latitude`, `longitude`, `categories`, `price`, `radius`, `sort_by`, `limit`
- `GET /api/restaurants/:id` - Get restaurant details

### Swipes
- `POST /api/swipes` - Save swipe (like/pass)
- `GET /api/swipes/:userId` - Get user's swipes
- `GET /api/swipes/:userId/likes` - Get liked restaurants

### Users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/:userId/preferences` - Get preferences
- `PUT /api/users/:userId/preferences` - Update preferences

## 🧪 Testing the Integration

1. **Check backend health:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Test restaurant search:**
   ```bash
   curl "http://localhost:3000/api/restaurants/search?location=Berkeley,CA&limit=5"
   ```

3. **Open the app and:**
   - View restaurants in Discover tab (fetched from Yelp via backend)
   - Swipe right to like (saved to Firestore)
   - View liked restaurants in Matches tab
   - Update preferences in Profile tab (saved to Firestore)

## 📝 Environment Variables

### Frontend (.env)
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000  # Backend URL
```

### Backend (backend/.env)
```bash
PORT=3000
NODE_ENV=development
YELP_API_KEY=your_yelp_api_key_here
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
CORS_ORIGINS=http://localhost:19000,http://localhost:19006,exp://localhost:19000
```

## 🔧 Troubleshooting

### "Network request failed"
- Check backend is running (`cd backend && npm run dev`)
- Verify `EXPO_PUBLIC_API_URL` in `.env` matches your setup
- For physical devices, ensure phone and computer are on same WiFi

### "YELP_API_KEY is required"
- Add your Yelp API key to `backend/.env`
- Get one at https://www.yelp.com/developers

### "Firebase health check failed"
- Ensure `serviceAccountKey.json` exists in `backend/` folder
- Download from Firebase Console > Project Settings > Service Accounts

### "No restaurants found"
- Check Yelp API key is valid
- Try a different location (e.g., "San Francisco, CA")
- Check backend logs for Yelp API errors

### CORS errors
- Add your Expo dev server URL to `backend/.env`:
  ```
  CORS_ORIGINS=http://localhost:19000,exp://192.168.1.x:19000
  ```

## 📚 Documentation

- [Backend README](./backend/README.md) - Backend API documentation
- [Shared Types](./shared/README.md) - Type definitions and schemas
- [Expo Docs](https://docs.expo.dev/)
- [Yelp Fusion API](https://www.yelp.com/developers/documentation/v3)

## 🎯 Features

- ✅ Swipe through restaurants (Tinder-style)
- ✅ Real-time restaurant data from Yelp
- ✅ Location-based search
- ✅ Save likes/passes to Firestore
- ✅ View matched restaurants
- ✅ Customize cuisine & dietary preferences
- ✅ Persistent preferences in Firestore

## 🚢 Deployment

### Backend
Deploy to Railway, Render, Heroku, or any Node.js hosting:

1. Set environment variables (including `FIREBASE_SERVICE_ACCOUNT_JSON`)
2. Deploy backend folder
3. Update frontend `EXPO_PUBLIC_API_URL` to production URL

### Frontend
Build and submit to app stores:

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## 📄 License

MIT
