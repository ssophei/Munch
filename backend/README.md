# Munch Backend API

Node.js + Express backend for the Munch restaurant discovery app.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express
- **Database**: Firebase Firestore
- **External API**: Yelp Fusion API
- **Validation**: Zod

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration (Firebase, env)
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # Route definitions
│   └── services/        # Business logic (Yelp, Firestore)
├── index.js             # Entry point
├── package.json
├── .env.example         # Environment variables template
└── .gitignore
```

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and set:

- `YELP_API_KEY` - Your Yelp Fusion API key ([Get one here](https://www.yelp.com/developers))
- `PORT` - Server port (default: 3000)
- Firebase credentials (see below)

### 3. Firebase Setup

**Option A: Service Account File (Recommended for local dev)**

1. Download your Firebase service account key JSON file
2. Save it as `serviceAccountKey.json` in the `backend/` folder
3. In `.env`: `GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json`

**Option B: Environment Variable (For deployment)**

Set the entire JSON as an environment variable:
```bash
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...","private_key":"..."}'
```

### 4. Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Health Check
- `GET /health` - Check server and services status

### Restaurants
- `GET /api/restaurants/search` - Search restaurants via Yelp
  - Query params: `term`, `location`, `latitude`, `longitude`, `categories`, `price`, `radius`, `sort_by`, `limit`, `offset`
- `GET /api/restaurants/:id` - Get restaurant details

### Swipes
- `POST /api/swipes` - Save a user swipe (like/pass)
  - Body: `{ userId, restaurantId, action }`
- `GET /api/swipes/:userId` - Get user's swipes
- `GET /api/swipes/:userId/likes` - Get user's liked restaurants

### Users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/:userId/preferences` - Get user preferences
- `PUT /api/users/:userId/preferences` - Update user preferences
  - Body: `{ cuisines: [], dietaryRestrictions: [] }`

## Response Format

All responses follow a standard envelope:

**Success:**
```json
{
  "ok": true,
  "data": { ... },
  "requestId": "uuid"
}
```

**Error:**
```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  },
  "requestId": "uuid"
}
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `YELP_API_KEY` | Yelp Fusion API key | Yes | - |
| `YELP_API_URL` | Yelp API base URL | No | https://api.yelp.com/v3 |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Firebase service account JSON | Yes* | - |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firebase service account JSON string | Yes* | - |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | No | localhost:19000,localhost:19006 |

*Either `GOOGLE_APPLICATION_CREDENTIALS` or `FIREBASE_SERVICE_ACCOUNT_JSON` is required.

## Network Access

The server binds to `0.0.0.0` to allow access from:

- **iOS Simulator**: `http://localhost:3000`
- **Android Emulator**: `http://10.0.2.2:3000`
- **Physical Device**: `http://<YOUR_LOCAL_IP>:3000`

Find your local IP:
- macOS/Linux: `ifconfig | grep "inet "`
- Windows: `ipconfig`

## Troubleshooting

### "YELP_API_KEY is required"
Make sure your `.env` file has `YELP_API_KEY=your_key_here`

### "Could not load serviceAccountKey.json"
1. Ensure `serviceAccountKey.json` exists in `backend/` folder
2. Or set `FIREBASE_SERVICE_ACCOUNT_JSON` environment variable

### "Firebase health check failed"
Check that your Firebase credentials are valid and the project exists.

### CORS errors from frontend
Add your Expo dev server URL to `CORS_ORIGINS` in `.env`:
```
CORS_ORIGINS=http://localhost:19000,http://localhost:19006,exp://192.168.1.x:19000
```

## Development

### Adding a New Endpoint

1. Create controller in `src/controllers/`
2. Add route in `src/routes/`
3. Import and mount in `src/routes/index.js`
4. Add validation schema in `shared/types.ts`

### Running Tests

```bash
npm test
```

## Deployment

This backend can be deployed to:
- Railway
- Render
- Heroku
- Google Cloud Run
- AWS (EC2, ECS, Lambda)

Make sure to:
1. Set all environment variables
2. Use `FIREBASE_SERVICE_ACCOUNT_JSON` for credentials
3. Set `NODE_ENV=production`

