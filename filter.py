import pandas as pd
import numpy as np
#restaurants is pd data frame 
#user prefs is dictionary, need to find out how to store user prefs in firebase and user them back for filter_businesses 
#TODO: radius, investigate geocoding to see

#user database
    # user_id
        # user_name
        # email 
        # user_requests (another collection) 
            # "user"+request_number
                #prefs 
                    # preffered_categories 
                    # max_price 
                    # user_location to calculate radius
            

#according to gemini these are some steps 
 # food app will make a request to the geolocation api 
 # geolocation api will process request and return users estimated location 
 # use firebase to store location data 


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

'''
Score restaurants based on:
    - price proximity
    - category match count
    - review count
    - actual rating
'''
def score(restaurants, user_prefs, k=5):
    weights = {'price': 0.25, 'category': 0.25, 'review_count': 0.25, 'rating': 0.25}
    scores = []
    # Normalize review_count (0-1)
    if 'review_count' in restaurants.columns and len(restaurants) > 0:
        max_reviews = restaurants['review_count'].max()
        min_reviews = restaurants['review_count'].min()
        if max_reviews == min_reviews:
            review_scores = np.ones(len(restaurants))
        else:
            review_scores = (restaurants['review_count'] - min_reviews) / (max_reviews - min_reviews)
    else:
        review_scores = np.zeros(len(restaurants))

    # Normalize rating (assuming 1-5)
    if 'rating' in restaurants.columns:
        rating_scores = (restaurants['rating'] - 1) / 4  # normalize 1-5 -> 0-1
    else:
        rating_scores = np.zeros(len(restaurants))

    for i, row in enumerate(restaurants.itertuples()):
        # Price score
        price_score = 0
        if 'max_price' in user_prefs and hasattr(row, 'price_num'):
            max_price = user_prefs['max_price']
            price_score = 1 - abs(row.price_num - max_price) / max_price
            price_score = max(price_score, 0)

        # Category match count score
        category_score = 0
        if 'preferred_categories' in user_prefs:
            categories_lower = str(getattr(row, 'categories', '')).lower()
            match_count = sum(1 for cat in user_prefs['preferred_categories'] if cat.lower() in categories_lower)
            category_score = match_count / len(user_prefs['preferred_categories'])

        # Review count score
        review_score = review_scores.iloc[i]

        # Actual rating score
        rating_score = rating_scores.iloc[i]

        # Weighted total score
        total_score = (weights['price'] * price_score +
                       weights['category'] * category_score +
                       weights['review_count'] * review_score +
                       weights['rating'] * rating_score)
        scores.append(total_score)

    restaurants['score'] = scores
    top_restaurants = restaurants.sort_values('score', ascending=False).head(k)
    return top_restaurants


#for testing, comment out with actual application
if __name__ == "__main__":
    restaurants = pd.read_csv("yelp_dataset_with_addresses.csv")
    
    user_prefs = {
        'category_prefs': ['Italian', 'Pizza'],
        'max_price': 3,
        #'user_location'
    }
    
    filtered = filter_businesses(restaurants, user_prefs)
    print(f"Found {len(filtered)} businesses")
    print(filtered)
    top_k = score(filtered, user_prefs, k=3)
    print(top_k[['name', 'categories', 'price', 'review_count', 'rating', 'score']])

