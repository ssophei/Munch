import { api } from "@/api/client";
import { MatchesContext } from "@/app/(tabs)/_layout";
import Button from "@/components/Button";
import CrossButton from "@/components/CrossButton";
import HeartButton from "@/components/HeartButton";
import RestaurantCard from "@/components/RestaurantCard";
import { APP_CONFIG } from "@/constants/config";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as Location from 'expo-location';
import { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { SafeAreaView } from "react-native-safe-area-context";

type Restaurant = {
  id: string;
  name: string;
  rating: number;
  imageUrl: string;
  categories: Array<{ alias: string; title: string }>;
  price?: string;
  location: {
    city: string;
    state: string;
    displayAddress?: string[];
  };
  distance?: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

type RootStackParamList = {
  Discover: undefined;
  Matches: { matchedRestaurants: Restaurant[] };
};

export default function DiscoverScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { addMatch } = useContext(MatchesContext);
  const swiperRef = useRef<any>(null);

  // Get user location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          console.log('Location permission denied, using default location');
        }
      } catch (err) {
        console.error('Error getting location:', err);
      }
    })();
  }, []);

  // Fetch restaurants from API
  useEffect(() => {
    fetchRestaurants();
  }, [userLocation]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use user location if available, otherwise use default
      const searchParams = userLocation
        ? {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            radius: APP_CONFIG.defaultRadius,
            limit: 20,
            sort_by: 'best_match' as const,
          }
        : {
            location: APP_CONFIG.defaultLocation,
            limit: 20,
            sort_by: 'best_match' as const,
          };

      console.log('🔍 Searching restaurants with params:', searchParams);
      
      const result = await api.restaurants.search(searchParams);
      
      console.log(`✅ Fetched ${result.restaurants.length} restaurants`);
      
      if (result.restaurants.length === 0) {
        setError('No restaurants found in your area. Try adjusting your filters.');
      } else {
        setRestaurants(result.restaurants);
      }
    } catch (err: any) {
      console.error('❌ Error fetching restaurants:', err);
      setError(err.message || 'Failed to load restaurants. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSwipedRight = async (cardIndex: number) => {
    const restaurant = restaurants[cardIndex];
    if (!restaurant) return;

    // Add to local matches
    addMatch(restaurant);
    
    // Save swipe to backend
    try {
      await api.swipes.create({
        userId: APP_CONFIG.defaultUserId,
        restaurantId: restaurant.id,
        action: 'like',
      });
      console.log('✅ Saved like for:', restaurant.name);
    } catch (err) {
      console.error('❌ Failed to save swipe:', err);
    }

    Alert.alert("Added to Matches!", `${restaurant.name} has been added to your Matches.`);
    setCurrentIndex(cardIndex + 1);
  };

  const onSwipedLeft = async (cardIndex: number) => {
    const restaurant = restaurants[cardIndex];
    if (!restaurant) return;

    // Save swipe to backend
    try {
      await api.swipes.create({
        userId: APP_CONFIG.defaultUserId,
        restaurantId: restaurant.id,
        action: 'pass',
      });
      console.log('✅ Saved pass for:', restaurant.name);
    } catch (err) {
      console.error('❌ Failed to save swipe:', err);
    }

    setCurrentIndex(cardIndex + 1);
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-primary">
        <ActivityIndicator size="large" color="#8C2F39" />
        <Text className="text-accent text-xl mt-4" style={{ fontFamily: 'montserrat-semibold' }}>
          Finding restaurants...
        </Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-primary px-8">
        <Text className="text-accent text-2xl text-center mb-4" style={{ fontFamily: 'montserrat-bold' }}>
          Oops!
        </Text>
        <Text className="text-secondary text-center mb-6" style={{ fontFamily: 'montserrat-regular' }}>
          {error}
        </Text>
        <Button onPress={fetchRestaurants}>
          <Text className="text-white text-lg" style={{ fontFamily: 'montserrat-semibold' }}>
            Retry
          </Text>
        </Button>
      </SafeAreaView>
    );
  }

  // No restaurants state
  if (restaurants.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-primary px-8">
        <Text className="text-accent text-2xl text-center mb-4" style={{ fontFamily: 'montserrat-bold' }}>
          No Restaurants Found
        </Text>
        <Text className="text-secondary text-center mb-6" style={{ fontFamily: 'montserrat-regular' }}>
          Try adjusting your location or preferences.
        </Text>
        <Button onPress={fetchRestaurants}>
          <Text className="text-white text-lg" style={{ fontFamily: 'montserrat-semibold' }}>
            Refresh
          </Text>
        </Button>
      </SafeAreaView>
    );
  }

  const currentCard = restaurants[currentIndex] || restaurants[restaurants.length - 1];

  // Format category string
  const getCategoryString = (categories: Array<{ title: string }>) => {
    return categories.map(cat => cat.title).join(', ');
  };

  // Format location string
  const getLocationString = (location: Restaurant['location']) => {
    if (location.displayAddress && location.displayAddress.length > 0) {
      return location.displayAddress[0];
    }
    return `${location.city}, ${location.state}`;
  };

  // Calculate distance in miles
  const getDistanceInMiles = (distanceMeters?: number) => {
    if (!distanceMeters || distanceMeters === 0) return 0;
    // Convert meters to miles
    const miles = distanceMeters / 1609.34;
    return Math.round(miles * 10) / 10; // 1 decimal place
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-primary flex-col">
      {/* Header above card */}
      <View className="justify-center items-center pt-5">
        <Text className="text-accent text-4xl" style={{ fontFamily: 'montserrat-bold' }}>
          {getLocationString(currentCard.location)}
        </Text>
        <Text className="text-secondary text-xl" style={{ fontFamily: 'montserrat-semibold' }}>
          {getDistanceInMiles(currentCard.distance)} mi away
        </Text>
      </View>

      {/* Swiper container */}
      <View className='w-full flex-1 flex-col justify-center items-center' style={{ marginTop: -40 }}>
        <Swiper
          ref={swiperRef}
          cards={restaurants}
          renderCard={(card) => (
            <RestaurantCard
              name={card?.name || 'Unknown Restaurant'}
              rating={card?.rating || 0}
              imageUrl={card?.imageUrl || card?.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
              category={card?.categories ? getCategoryString(card.categories) : 'Restaurant'}
              price={card?.price || 'N/A'}
              location={card?.location ? getLocationString(card.location) : 'Unknown'}
              distance={getDistanceInMiles(card?.distance)}
            />
          )}
          onSwipedRight={onSwipedRight}
          onSwipedLeft={onSwipedLeft}
          stackSize={1}
          stackSeparation={15}
          backgroundColor="transparent"
          verticalSwipe={false}
          horizontalSwipe={true}
          cardIndex={currentIndex}
        />
        <View className="absolute bottom-0 gap-10 flex shadow-md flex-row">
          <CrossButton restaurant={currentCard} onLike={() => swiperRef.current?.swipeLeft()}></CrossButton>
          <HeartButton restaurant={currentCard} onLike={() => swiperRef.current?.swipeRight()}></HeartButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
