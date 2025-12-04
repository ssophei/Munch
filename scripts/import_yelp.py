import os
import time
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load .env (must contain MUNCH_YELP_API_KEY)
load_dotenv()

# Firebase setup
cred = credentials.Certificate("./serviceAccountKey.json")  # keep this file local, not in git
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Yelp API
YELP_API_KEY = os.getenv("MUNCH_YELP_API_KEY")
if not YELP_API_KEY:
    raise RuntimeError("MUNCH_YELP_API_KEY not set in .env")

YELP_URL = "https://api.yelp.com/v3/businesses/search"
HEADERS = {"Authorization": f"Bearer {YELP_API_KEY}"}

# UC Berkeley coordinates
UC_LAT = 37.8719
UC_LON = -122.2585

# 2 miles in meters
TWO_MILES = 3219


def import_berkeley_restaurants(limit=50, max_total=1000, radius=TWO_MILES):
    """
    Pull restaurants from Yelp within `radius` meters of UC Berkeley
    and store them in Firestore in the 'restaurants' collection.

    Uses Yelp's latitude/longitude + radius search and respects
    the limit+offset <= 240 constraint.
    """
    offset = 0
    total_imported = 0
    total_available = None

    print(f"Importing restaurants within {radius}m (~{radius/1609:.2f} miles) of UC Berkeley...")

    while True:
        # Stop if we've imported everything Yelp will give us
        if total_available is not None and total_imported >= total_available:
            print("Done — reached Yelp total.")
            break

        # Stop if we hit our own cap
        if total_imported >= max_total:
            print("Done — hit max_total cap.")
            break

        # Yelp hard rule: limit + offset must be <= 240
        if offset + limit > 240:
            print("\nStopping — hit Yelp pagination limit (limit + offset > 240).")
            break

        print(f"\nFetching offset {offset}...")

        params = {
            "latitude": UC_LAT,
            "longitude": UC_LON,
            "radius": radius,
            "categories": "restaurants",
            "limit": limit,
            "offset": offset,
        }

        response = requests.get(YELP_URL, headers=HEADERS, params=params)

        if not response.ok:
            print("Yelp error:", response.status_code)
            print("Response:", response.text)
            break

        data = response.json()

        # Set total_available only once, based on Yelp's reported total,
        # our own max_total, and Yelp's 240 hard cap.
        if total_available is None:
            api_total = data.get("total", 0)
            total_available = min(api_total, max_total, 240)
            print(f"Yelp reports {api_total} total matches | importing up to {total_available}")

            if total_available == 0:
                print("No restaurants found. Stopping.")
                break

        businesses = data.get("businesses", [])
        if not businesses:
            print("No more businesses returned. Stopping.")
            break

        batch = db.batch()

        for b in businesses:
            biz_id = b.get("id")
            if not biz_id:
                continue

            doc_ref = db.collection("restaurants").document(biz_id)

            batch.set(doc_ref, {
                "name": b.get("name"),
                "rating": b.get("rating"),
                "review_count": b.get("review_count"),
                "price": b.get("price", "N/A"),
                "categories": [c.get("title") for c in b.get("categories", [])],
                "location": b.get("location"),
                "coordinates": b.get("coordinates"),
                "image_url": b.get("image_url"),
                "url": b.get("url"),
                "phone": b.get("phone"),
                "yelp_id": biz_id,
            })

        batch.commit()
        print(f"Imported {len(businesses)} businesses")

        total_imported += len(businesses)
        offset += limit

        if total_imported >= total_available:
            print("Imported all available businesses.")
            break

        # Be nice to Yelp's API
        time.sleep(0.5)

    print(f"\nDone! Total imported: {total_imported}")


if __name__ == "__main__":
    import_berkeley_restaurants()
