import pandas as pd

#restaurants is pd data frame 
#user prefs is dictionary, need to find out how to store user prefs in firebase and user them back for filter_businesses 
#TODO: radius, investigate geocoding to see

#user database
    # user_name 
    # allow using location (?)
        # each time the user wants to select 
            # session number (?)
            # then user_prefs 
                # preffered_categories 
                # max_price 
                # user_location to calculate radius

def filter_businesses(restaurants, user_prefs):
    candidates = restaurants.copy()
    candidates = candidates.dropna(subset=['name', 'coordinates.latitude', 'coordinates.longitude'])

    if 'is_closed' in candidates.columns:
        candidates = candidates.drop(candidates[candidates['is_closed'] == True].index)
    if 'is_open_now' in candidates.columns:
        #only want places that user can go to at the very moment I believe, we can change later though
        candidates = candidates[candidates['is_open_now'] == True]
    
    if 'preferred_categories' in user_prefs:
        def matches_category(row):
            if pd.isna(row.get('categories')):
                return False
            #coverting all categories to lowercase
            categories_lower = str(row['categories']).lower()
            for user_cat in user_prefs['preferred_categories']:
                if user_cat.lower() in categories_lower:
                    return True
            return False
        #axis=1 is for applying to rows, not columns 
        candidates = candidates[candidates.apply(matches_category, axis=1)]
    
    if 'max_price' in user_prefs:
        price_map = {"$": 1, "$$": 2, "$$$": 3, "$$$$": 4}
        if 'price' in candidates.columns:
            candidates['price_num'] = candidates['price'].map(price_map)
            candidates = candidates[candidates['price_num'] <= user_prefs['max_price']]
    return candidates

#for testing 
if __name__ == "__main__":
    restaurants = pd.read_csv("yelp_dataset_with_addresses.csv")
    
    user_prefs = {
        'preferred_categories': ['Italian', 'Pizza'],
        'max_price': 3,
        #'user_location'
    }
    
    filtered = filter_businesses(restaurants, user_prefs)
    print(f"Found {len(filtered)} businesses")

