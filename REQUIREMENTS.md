# Requirements

Complete list of requirements and dependencies for the Munch app.

## System Requirements

### Required Software

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher (comes with Node.js)
- **Git**: Any recent version

### Platform-Specific Requirements

#### For iOS Development (macOS only)
- **macOS**: 10.15 (Catalina) or higher
- **Xcode**: 13.0 or higher
- **Xcode Command Line Tools**
- **CocoaPods**: Latest version
- **iOS Simulator**: Installed via Xcode

#### For Android Development
- **Android Studio**: Latest version
- **Android SDK**: API 31 or higher
- **Android Emulator**: Configured and working
- **Java Development Kit (JDK)**: 11 or higher

#### For Physical Device Testing
- **Expo Go App**: Installed on device (from App Store/Play Store)
- **Same WiFi Network**: Device and computer must be on same network

---

## External Service Requirements

### Required Services

1. **Yelp Fusion API**
   - Account: https://www.yelp.com/developers
   - API Key (free tier available)
   - Rate Limit: 5000 calls/day (free tier)

2. **Firebase**
   - Project: https://console.firebase.google.com/
   - Firestore Database enabled
   - Service Account Key downloaded
   - Billing: Free tier (Spark plan) is sufficient for development

---

## Frontend Dependencies

**File:** `package.json`

### Production Dependencies

```json
{
  "@expo-google-fonts/montserrat": "^0.4.2",
  "@expo/vector-icons": "^15.0.3",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-navigation/native": "^7.1.8",
  "autoprefixer": "^10.4.21",
  "core-js": "^3.47.0",
  "expo": "54.0.20",
  "expo-constants": "~18.0.9",
  "expo-font": "~14.0.9",
  "expo-linear-gradient": "~15.0.7",
  "expo-linking": "~8.0.8",
  "expo-location": "~19.0.7",
  "expo-router": "~6.0.13",
  "expo-splash-screen": "~31.0.10",
  "expo-status-bar": "~3.0.8",
  "expo-web-browser": "~15.0.8",
  "lucide-react-native": "^0.552.0",
  "nativewind": "^4.2.1",
  "postcss": "^8.5.6",
  "prettier-plugin-tailwindcss": "^0.5.14",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "react-native": "0.81.5",
  "react-native-css-interop": "^0.2.1",
  "react-native-deck-swiper": "^2.0.19",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-reanimated": "~4.1.1",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0",
  "react-native-svg": "^15.14.0",
  "react-native-toast-message": "^2.3.3",
  "react-native-web": "~0.21.0",
  "react-native-worklets": "0.5.1",
  "tailwindcss": "^3.3.3",
  "zod": "^3.22.4"
}
```

### Development Dependencies

```json
{
  "@types/react": "~19.1.0",
  "react-test-renderer": "19.1.0",
  "typescript": "~5.9.2"
}
```

### Installation
```bash
npm install
```

---

## Backend Dependencies

**File:** `backend/package.json`

### Production Dependencies

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "firebase-admin": "^12.0.0",
  "dotenv": "^16.3.1",
  "axios": "^1.6.2",
  "uuid": "^9.0.1",
  "zod": "^3.22.4"
}
```

### Development Dependencies

```json
{
  "nodemon": "^3.0.2"
}
```

### Installation
```bash
cd backend
npm install
```

---

## Shared Package Dependencies

**File:** `shared/package.json`

### Production Dependencies

```json
{
  "zod": "^3.22.4"
}
```

### Development Dependencies

```json
{
  "typescript": "~5.9.2"
}
```

### Installation
```bash
cd shared
npm install
```

---

## Environment Variables

### Frontend Environment (.env)

**Required:**
```bash
EXPO_PUBLIC_API_URL=<backend_url>
```

**Values by platform:**
- iOS Simulator: `http://localhost:3000`
- Android Emulator: `http://10.0.2.2:3000`
- Physical Device: `http://192.168.1.XXX:3000` (your local IP)

### Backend Environment (backend/.env)

**Required:**
```bash
PORT=3000
NODE_ENV=development
YELP_API_KEY=<your_yelp_api_key>
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

**Optional:**
```bash
YELP_API_URL=https://api.yelp.com/v3
CORS_ORIGINS=http://localhost:19000,http://localhost:19006,exp://localhost:19000
```

---

## Firebase Requirements

### Service Account Key

**File:** `backend/serviceAccountKey.json`

**How to get:**
1. Go to Firebase Console
2. Project Settings → Service Accounts
3. Generate new private key
4. Download JSON file
5. Save as `backend/serviceAccountKey.json`

**Format:**
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### Firestore Collections

**Auto-created by the app:**
- `users/` - User profiles and preferences
- `users/{userId}/swipes/` - User swipe history
- `restaurants/` - Cached restaurant data (optional)

---

## Network Requirements

### Ports

- **Backend**: 3000 (default, configurable via PORT env var)
- **Expo Dev Server**: 19000, 19001, 19002
- **Metro Bundler**: 8081

### Firewall Rules

- Allow outbound HTTPS (443) for:
  - Yelp API: `api.yelp.com`
  - Firebase: `*.googleapis.com`, `*.firebaseio.com`
- Allow inbound connections on port 3000 (for physical device testing)

### Internet Connectivity

- Required for:
  - Yelp API calls
  - Firebase Firestore operations
  - Expo development
  - Package installations

---

## Storage Requirements

### Disk Space

- **Frontend**: ~500 MB (including node_modules)
- **Backend**: ~100 MB (including node_modules)
- **Xcode** (if iOS): ~15 GB
- **Android Studio** (if Android): ~5 GB
- **Total Minimum**: ~1 GB (without IDEs)

---

## Memory Requirements

### Development

- **Minimum RAM**: 8 GB
- **Recommended RAM**: 16 GB or higher
- **iOS Simulator**: 2-4 GB
- **Android Emulator**: 2-4 GB

---

## API Rate Limits

### Yelp Fusion API

**Free Tier:**
- 5,000 API calls per day
- 5 queries per second (QPS)

**Mitigation:**
- Backend caches results in Firestore
- Reduces redundant API calls

### Firebase Firestore

**Free Tier (Spark Plan):**
- 50,000 document reads/day
- 20,000 document writes/day
- 20,000 document deletes/day
- 1 GB stored data

**Sufficient for:**
- Development and testing
- Small production apps (< 1000 users)

---

## Browser Requirements (for Web Build)

### Supported Browsers

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

---

## Operating System Requirements

### Development Machine

**Supported:**
- **macOS**: 10.15+ (required for iOS development)
- **Windows**: 10 or 11 (Android only)
- **Linux**: Ubuntu 18.04+, other modern distros (Android only)

### Target Devices

**iOS:**
- iOS 13.0 or higher
- iPhone 6s or newer
- iPad (5th generation) or newer

**Android:**
- Android 6.0 (API 23) or higher
- ARM or x86 architecture

---

## Testing Requirements

### For Unit Tests

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native
```

### For E2E Tests

```bash
# Detox (example)
npm install --save-dev detox
```

---

## Quick Install Script

```bash
#!/bin/bash

# Install all dependencies
echo "Installing frontend dependencies..."
npm install

echo "Installing backend dependencies..."
cd backend && npm install && cd ..

echo "Installing shared dependencies..."
cd shared && npm install && cd ..

echo "✅ All dependencies installed!"
echo ""
echo "Next steps:"
echo "1. Configure backend/.env with YELP_API_KEY"
echo "2. Add backend/serviceAccountKey.json"
echo "3. Configure .env with EXPO_PUBLIC_API_URL"
echo "4. Run: cd backend && npm run dev"
echo "5. Run: npm start (in new terminal)"
```

---

## Verification Commands

### Check Node.js Version
```bash
node --version
# Should show v18.x.x or higher
```

### Check npm Version
```bash
npm --version
# Should show 8.x.x or higher
```

### Check Installations
```bash
# Frontend
npm list --depth=0

# Backend
cd backend && npm list --depth=0

# Shared
cd shared && npm list --depth=0
```

### Test Backend
```bash
cd backend
npm run dev
# Then: curl http://localhost:3000/health
```

### Test Frontend
```bash
npm start
# Should show QR code
```

---

## Security Requirements

### API Keys

- ✅ Never commit to git
- ✅ Use environment variables
- ✅ Rotate periodically

### Firebase Credentials

- ✅ Never commit serviceAccountKey.json
- ✅ Keep in .gitignore
- ✅ Use environment variables in production

### CORS

- ✅ Configure allowed origins
- ✅ Restrict in production
- ✅ Use HTTPS in production

---

## Production Requirements (Additional)

### For Deployment

1. **Backend Hosting**
   - Node.js 18+ runtime
   - Environment variable support
   - HTTPS/TLS
   - Persistent storage (optional)

2. **Frontend Build**
   - EAS Build service (Expo)
   - Apple Developer Account (iOS)
   - Google Play Developer Account (Android)

3. **Monitoring**
   - Error tracking (Sentry, etc.)
   - Analytics (Firebase Analytics, etc.)
   - Logging service

4. **CI/CD** (Optional)
   - GitHub Actions
   - CircleCI
   - GitLab CI

---

## Summary

### Must Have
- ✅ Node.js 18+
- ✅ npm 8+
- ✅ Yelp API Key
- ✅ Firebase Project + Firestore
- ✅ Firebase Service Account Key

### Platform Specific
- ✅ macOS + Xcode (for iOS)
- ✅ Android Studio (for Android)
- ✅ Expo Go app (for physical devices)

### Install All Dependencies
```bash
npm install
cd backend && npm install && cd ..
cd shared && npm install && cd ..
```

### Configure
1. Create `.env` files
2. Add API keys
3. Add Firebase credentials

### Run
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
npm start
```

---

**All requirements documented!** Follow the installation steps in order for a smooth setup.

