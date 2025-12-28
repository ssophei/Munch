# @munch/shared

Shared TypeScript types and Zod schemas for the Munch app.

## Usage

### Backend (Node.js)
```typescript
import { RestaurantSchema, SearchRestaurantsRequestSchema } from '../shared/types';

// Validate request
const result = SearchRestaurantsRequestSchema.safeParse(req.query);
```

### Frontend (React Native)
```typescript
import type { Restaurant, ApiResponse } from '../shared/types';

const response: ApiResponse<Restaurant[]> = await api.get('/restaurants');
```

## Types

- **API Envelope**: `SuccessResponse`, `ErrorResponse`, `ApiResponse`
- **Restaurant**: `Restaurant`, `Category`, `Coordinates`
- **Search**: `SearchRestaurantsRequest`, `SearchRestaurantsResponse`
- **Swipes**: `Swipe`, `SwipeRequest`, `SwipeAction`
- **User**: `UserProfile`, `UserPreferences`
- **Health**: `HealthCheckResponse`

