import firebase_admin
from firebase_admin import credentials, auth, firestore

# 1. Initialize Firebase Admin SDK
def init_firebase():
    """
    Initialize Firebase Admin SDK with your service account key.
    Make sure the path matches where your JSON actually is.
    """
    cred = credentials.Certificate("userbase/serviceAccountKey.json")  # or "serviceAccountKey.json" if in same folder
    firebase_admin.initialize_app(cred)
    print("Firebase initialized.")


# 2. Example Users
#    You can change/add/remove these as you like.
SEED_USERS = [
    {
        "email": "dylan@example.com",
        "password": "password123",
        "category_pref": ["pizza", "italian"],
        "max": "$$",  # from Yelp: "$", "$$", "$$$", "$$$$"
        "user_locations": {
            "lat": 37.8715,
            "lng": -122.2730,  # Near downtown Berkeley
        },
    },
    {
        "email": "abhi@example.com",
        "password": "password123",
        "category_pref": ["coffee", "bakery"],
        "max": "$",
        "user_locations": {
            "lat": 37.8694,
            "lng": -122.2590,  # Near campus
        },
    },
    {
        "email": "sophie@example.com",
        "password": "password123",
        "category_pref": ["ramen", "japanese"],
        "max": "$$$",
        "user_locations": {
            "lat": 37.8620,
            "lng": -122.2760,  # South Berkeley-ish
        },
    },
]


# 3. Function to create auth user + Firestore profile
def create_user_with_profile(db, user_data):
    """
    Creates a Firebase Auth user and a Firestore profile document.

    :param db: Firestore client
    :param user_data: dict with keys: email, password, category_pref, max, user_locations
    """
    email = user_data["email"]
    password = user_data["password"]

    try:
        # Check if the user already exists (by email)
        try:
            user_record = auth.get_user_by_email(email)
            print(f"User already exists: {email} (uid={user_record.uid})")
        except auth.UserNotFoundError:
            # Create the Auth user if not found
            user_record = auth.create_user(
                email=email,
                password=password,
            )
            print(f"Created user: {email} (uid={user_record.uid})")

        # Create / update Firestore profile using the uid as document ID
        doc_ref = db.collection("users").document(user_record.uid)

        profile_data = {
            "email": email,
            "category_pref": user_data.get("category_pref", []),
            "max": user_data.get("max", "$$"),
            "user_locations": user_data.get("user_locations", {}),
            "createdAt": firestore.SERVER_TIMESTAMP,
        }

        doc_ref.set(profile_data, merge=True)
        print(f"Set Firestore profile for {email}")

    except Exception as e:
        print(f"Error creating user {email}: {e}")


def main():
    init_firebase()
    db = firestore.client()

    for user in SEED_USERS:
        create_user_with_profile(db, user)


if __name__ == "__main__":
    main()
