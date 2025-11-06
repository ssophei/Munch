import requests
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MultiLabelBinarizer, MinMaxScaler

API_KEY = "fitpQmizhts5hPe6-MYsEAW8G-DvdP1U6xNe1tac2ud6NDPcGGv9DJHII5E48fbolm-z5NzbUG0qgk7Yb54FsQ-OTy-mYN7b2PPQ19Gj_qh6upj1uoGKHnL-Ix4AaXYx"

url = "https://api.yelp.com/v3/businesses/search"

# HTTP headers include the API key
headers = {
    "Authorization": f"Bearer {API_KEY}"
}

params = {
    "term": "coffee",
    "location": "Berkeley",
    "limit": 50
}

# Send GET request
response = requests.get(url, headers=headers, params=params)

# Parse JSON data
if response.status_code == 200:
    data = response.json()
    businesses = data["businesses"]
else:
    print("Error:", response.status_code, response.text)
    businesses = []

# Convert to pandas DataFrame and make a copy
df = pd.json_normalize(businesses)
df_subset = df[["name", "rating", "review_count", "price", "location.city", "categories"]].copy()
print(df_subset.head())

# Save to CSV
df_subset.to_csv("yelp_dataset.csv", index=False)
print("Dataset saved as yelp_dataset.csv")

# Filter for Berkeley (optional)
berkeley = df_subset[df_subset['location.city'] == "Berkeley"].copy()
print(berkeley.head())

#Managing Yelp Data 

# Map Yelp price strings to ordinal
price_mapping = {"$": 1, "$$": 2, "$$$": 3, "$$$$": 4}
df_subset['price_encoded'] = df_subset['price'].map(price_mapping)

# Extract category titles for one-hot encoding
def get_category_list(cat_column):
    return [[c['title'] for c in cats] if isinstance(cats, list) else [] for cats in cat_column]

categories_list = get_category_list(df_subset['categories'])
mlb = MultiLabelBinarizer()
categories_encoded = mlb.fit_transform(categories_list)
categories_df = pd.DataFrame(categories_encoded, columns=mlb.classes_)

# Combine numeric features (review_count) and categories
X_numeric = df_subset[['review_count']].fillna(0)
X = pd.concat([X_numeric.reset_index(drop=True), categories_df.reset_index(drop=True)], axis=1)

# Rows with known price
train_rows = df_subset['price_encoded'].notna()
X_train = X.loc[train_rows]
y_train = df_subset.loc[train_rows, 'price_encoded']

# Rows with missing price
missing_rows = df_subset['price_encoded'].isna()
X_missing = X.loc[missing_rows]

# Train Random Forest Regressor
rf = RandomForestRegressor(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# Predict missing prices and assign to new column
predicted_prices = rf.predict(X_missing)
df_subset.loc[missing_rows, 'price_encoded'] = predicted_prices

# Normalize price (0-1)
scaler = MinMaxScaler()
df_subset['price_normalized'] = scaler.fit_transform(df_subset[['price_encoded']])

# Assign predicted prices to display column
df_subset['price_predicted'] = df_subset['price']  # original price
df_subset.loc[missing_rows, 'price_predicted'] = df_subset.loc[missing_rows, 'price_encoded']

# -----------------------
# Heatmap
# -----------------------
rating_bins = np.arange(0, 5.5, 0.5)
review_bins = np.arange(0, df_subset['review_count'].max()+10, 10)

df_subset['rating_bin'] = pd.cut(df_subset['rating'], bins=rating_bins)
df_subset['review_bin'] = pd.cut(df_subset['review_count'], bins=review_bins)

heatmap_data = df_subset.groupby(['rating_bin', 'review_bin'], observed=True)['price_normalized'].mean().unstack()

plt.figure(figsize=(12, 6))
sns.heatmap(
    heatmap_data,
    cmap="PuBu",
    linewidths=0.5,
    linecolor='gray',
    cbar_kws={'label': 'Average Normalized Price'},
    annot=True,
    fmt=".2f"
)
plt.title("Heatmap of Average Normalized Price by Rating and Review Count")
plt.xlabel("Number of Reviews")
plt.ylabel("Rating")
plt.xticks(rotation=45)
plt.yticks(rotation=0)
plt.show()

# -----------------------
# Hexmap
# -----------------------
plt.figure(figsize=(10,6))
plt.hexbin(
    df_subset['review_count'],
    df_subset['rating'],
    C=df_subset['price_normalized'],
    gridsize=10,
    cmap='PuBu',
    reduce_C_function=np.mean
)
plt.colorbar(label='Average Normalized Price')
plt.xlabel("Review Count")
plt.ylabel("Rating")
plt.title("Price vs Rating & Reviews")
plt.show()

# -----------------------
# Show predicted price table
# -----------------------
predicted_table = df_subset.loc[missing_rows, ['name', 'price_predicted', 'price_normalized']]
print(predicted_table)