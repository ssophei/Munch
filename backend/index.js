// backend/index.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json'); // keep this file local, git-ignored

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// sanity root route
app.get('/', (req, res) => {
  res.send('Munch backend is running ✅');
});

/**
 * GET /restaurants
 * Query params:
 *   price: "1,2,3"   -> maps to ["$", "$$", "$$$"]
 *   category: string -> matched (case-insensitive) against categories
 *   sort: "rating" | "distance"
 *   lat, lon: numbers (required for sort=distance)
 */
app.get('/restaurants', async (req, res) => {
  try {
    const { price, category, sort = 'rating', lat, lon } = req.query;

    // Parse price filter (e.g. "1,2" -> ["$", "$$"])
    let priceSymbols = null;
    if (price) {
      const nums = price
        .split(',')
        .map((p) => parseInt(p.trim(), 10))
        .filter((n) => !isNaN(n) && n >= 1 && n <= 4);

      if (nums.length > 0) {
        priceSymbols = nums.map((n) => '$'.repeat(n));
      }
    }

    // Base query: just order by rating, no Firestore filters
    let query = db.collection('restaurants').orderBy('rating', 'desc').limit(200);
    const snapshot = await query.get();

    let restaurants = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // ----- Filter by price in Node -----
    if (priceSymbols) {
      restaurants = restaurants.filter((r) =>
        r.price ? priceSymbols.includes(r.price) : false
      );
    }

    // ----- Filter by category in Node -----
    if (category) {
      const catLower = category.toLowerCase();
      restaurants = restaurants.filter((r) => {
        if (!r.categories) return false;
        const cats = Array.isArray(r.categories) ? r.categories : [];
        return cats.some((c) => {
          const title = typeof c === 'string' ? c : c.title;
          return title && title.toLowerCase().includes(catLower);
        });
      });
    }

    // ----- Distance-based ordering (optional) -----
    if (sort === 'distance' && lat && lon) {
      const userLat = parseFloat(lat);
      const userLon = parseFloat(lon);

      if (!isNaN(userLat) && !isNaN(userLon)) {
        const toRad = (deg) => (deg * Math.PI) / 180;
        const distanceMeters = (aLat, aLon, bLat, bLon) => {
          const R = 6371000;
          const dLat = toRad(bLat - aLat);
          const dLon = toRad(bLon - aLon);
          const lat1 = toRad(aLat);
          const lat2 = toRad(bLat);
          const sinDLat = Math.sin(dLat / 2);
          const sinDLon = Math.sin(dLon / 2);
          const a =
            sinDLat * sinDLat +
            Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        restaurants = restaurants.map((r) => {
          const coords = r.coordinates;
          let distance = null;
          if (coords && coords.latitude != null && coords.longitude != null) {
            distance = distanceMeters(
              userLat,
              userLon,
              coords.latitude,
              coords.longitude
            );
          }
          return { ...r, distanceMeters: distance };
        });

        restaurants.sort((a, b) => {
          if (a.distanceMeters == null) return 1;
          if (b.distanceMeters == null) return -1;
          return a.distanceMeters - b.distanceMeters;
        });
      }
    }

    res.json(restaurants);
  } catch (err) {
    console.error('Error in /restaurants:', err);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// optional: log swipes (likes/dislikes) per user
app.post('/swipes', async (req, res) => {
  try {
    const { userId, requestId, restaurantId, action } = req.body;

    if (!userId || !restaurantId || !action) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const swipeId = `${requestId || 'default'}_${restaurantId}`;
    const swipeRef = db
      .collection('users')
      .doc(userId)
      .collection('swipes')
      .doc(swipeId);

    await swipeRef.set({
      userId,
      requestId: requestId || null,
      restaurantId,
      action, // 'like' | 'dislike' | 'skip'
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Error in /swipes:', err);
    res.status(500).json({ error: 'Failed to save swipe' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
