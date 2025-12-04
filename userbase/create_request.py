import firebase_admin
from firebase_admin import credentials, auth, firestore

# Initialize Firebase (adjust path if needed)
cred = credentials.Certificate("userbase/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def create_request_for_user(uid, category_pref, max_price, user_locations):
    """
    Create a new 'request' document for a given user.
    This simulates the user opening the app and choosing new preferences.
    """
    requests_ref = db.collection("users").document(uid).collection("requests")

    request_data = {
        "category_pref": category_pref,     # list or string
        "max": max_price,                   # "$", "$$", "$$$", "$$$$"
        "user_locations": user_locations,   # { "lat": ..., "lng": ... }
        "createdAt": firestore.SERVER_TIMESTAMP,
    }

    doc_ref = requests_ref.add(request_data)  # add() creates a doc with auto ID
    print(f"Created request {doc_ref[1].id} for user {uid}")


def main():
    # List of example users + their request data
    test_requests = [
        {
            "email": "dylan@example.com",
            "category_pref": ["coffee", "bakery"],
            "max": "$$",
            "user_locations": {"lat": 37.8694, "lng": -122.2590},
        },
        {
            "email": "abhi@example.com",
            "category_pref": ["ramen", "japanese"],
            "max": "$",
            "user_locations": {"lat": 37.8710, "lng": -122.2720},
        },
        {
            "email": "sophie@example.com",
            "category_pref": ["mexican", "tacos"],
            "max": "$$$",
            "user_locations": {"lat": 37.8650, "lng": -122.2750},
        },
    ]

    # Loop through all users and create requests
    for req in test_requests:
        try:
            user_record = auth.get_user_by_email(req["email"])
            uid = user_record.uid

            create_request_for_user(
                uid,
                req["category_pref"],
                req["max"],
                req["user_locations"],
            )

        except auth.UserNotFoundError:
            print(f"User not found: {req['email']}")


if __name__ == "__main__":
    main()
