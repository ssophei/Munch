import pandas as pd
import requests

GOOGLE_MAPS_API_KEY = "AIzaSyAN-c6fsRDGOs_vmPoUDeXe2w9X0W1cGjg"

def match_address(lat, lng):
    "match coordinates to addresses"
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "latlng": f"{lat},{lng}",
        "key": GOOGLE_MAPS_API_KEY,
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data.get("status") == "OK" and data.get("results"):
            return data["results"][0].get("formatted_address")
    return None

#read yelp
df = pd.read_csv("yelp_dataset.csv")


addresses = []
for idx, row in df.iterrows():
    lat = row.get("coordinates.latitude")
    lng = row.get("coordinates.longitude")
    
    if pd.isna(lat) or pd.isna(lng):
        addresses.append(None)
    else:
        address = match_address(float(lat), float(lng))
        addresses.append(address)
        print(f"Processed {idx + 1}/{len(df)}: {address}")

# Add addresses and save
df["full_address"] = addresses
df.to_csv("yelp_dataset_with_addresses.csv", index=False)
print(f"\nSaved {len(df)} businesses with addresses to yelp_dataset_with_addresses.csv")
