import { MatchesContext } from "@/app/(tabs)/_layout";
import Button from "@/components/Button";
import CrossButton from "@/components/CrossButton";
import HeartButton from "@/components/HeartButton";
import RestaurantCard from "@/components/RestaurantCard";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useContext, useState, useRef } from "react";
import { Alert, Dimensions, Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { SafeAreaView } from "react-native-safe-area-context";


const restaurants = [
  {
    name: "Binge Coffee House",
    rating: 4.5,
    imageUrl:
      "https://s3-media0.fl.yelpcdn.com/bphoto/KeqwHnHRrCS_bh2cKYXGnA/o.jpg",
    category: "Vietnamese, Coffee & Tea, Bubble Tea",
    price: "$",
    location: "Berkeley, CA",
    distance: 0.4,
  },
  {
    name: "Caffe Strada",
    rating: 3.8,
    imageUrl:
      "https://s3-media0.fl.yelpcdn.com/bphoto/IWfWzaeQAhVyW1sLVCCLZw/o.jpg",
    category: "Coffee & Tea",
    price: "$",
    location: "Berkeley, CA",
    distance: 0.3,
  },
  {
    name: "My-O-My",
    rating: 4.4,
    imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/c9Kg0OMGt5S4wNmZrzLIug/o.jpg",
    category: "Salad, Poutineries, Wraps",
    price: "$",
    location: "Berkeley, CA",
    distance: 0.3,
  },
  {
    name: "Mind Coffee",
    rating: 4.6,
    imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/700gxabx1vGSY3eKpkKrjA/o.jpg",
    category: "Coffee & Tea, Coffee Roasteries",
    price: "$$",
    location: "Berkeley, CA",
    distance: 0.4,
  },
  {
    name: "Noodle Dynasty",
    rating: 4.5,
    imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/Hvj2R0_xRpLwRjOhu4UtYA/o.jpg",
    category: "Noodles",
    price: "$$",
    location: "Berkeley, CA",
    distance: 0.3,
  },
  {
    name: "Souvenir Coffee",
    rating: 4.7,
    imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/KnHbJhpHkNCarzQxqshSeA/o.jpg",
    category: "Coffee & Tea",
    price: "$$",
    location: "Oakland, CA",
    distance: 3.7,
  },
  {
    name: "The Line Coffee",
    rating: 4.7,
    imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/qQ9TPZu1MI4tFPm4YI6JYw/o.jpg",
    category: "Coffee & Tea",
    price: "$$",
    location: "Berkeley, CA",
    distance: 1.0,
  },
  {
    name: "Dave's Hot Chicken",
    rating: 3.8,
    imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/fkBYB57GIOPyE_ibVFPQCQ/o.jpg",
    category: "Coffee & Tea",
    price: "$$",
    location: "El Cerrito, CA",
    distance: 3.0,
  },
  {
    name: "The Artisan Cafe",
    rating: 3.8,
    imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/0N8KksJ2Z59rAlsLwfH61g/o.jpg",
    category: "Cafes, Salad",
    price: "$$",
    location: "Richmond, CA",
    distance: 5.8,
  },
  {
    name: "Q Specialty Coffee",
    rating: 4.4,
    imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/bj85MRTGibQ52tRosDu6NA/o.jpg",
    category: "Coffee Roasteries, Coffee & Tea",
    price: "$$",
    location: "San Francisco, CA",
    distance: 12,
  },
  {
    name: "Pho de Nguyen",
    rating: 4.4,
    imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/1J8ttDRtygadDfHJPwRWZw/o.jpg",
    category: "Vietnamese, Noodles, Soup",
    price: "$$",
    location: "San Francisco, CA",
    distance: 10,
  },
  {
    name: "The Coffee Movement",
    rating: 4.6,
    imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/X1R2iHnXv8xyhPiy3BgKIw/o.jpg",
    category: "Coffee & Tea",
    price: "$$",
    location: "San Francisco, CA",
    distance: 14,
  },
];

type RootStackParamList = {
  Discover: undefined;
  Matches: { matchedRestaurants: typeof restaurants };
};

export default function DiscoverScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<any[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { addMatch } = useContext(MatchesContext);
  const swiperRef = useRef<any>(null);

  const onSwipedRight = (cardIndex: number) => {
    const restaurant = restaurants[cardIndex];
    addMatch(restaurant); // <-- automatically adds to matches
    Alert.alert("Added to Matches!", `${restaurant.name} has been added to your Matches.`);
    setCurrentIndex(cardIndex + 1);

  };
  const onSwipedLeft = (cardIndex: number) => {
    setCurrentIndex(cardIndex + 1);
  };
  const currentCard =
    restaurants[currentIndex] || restaurants[restaurants.length - 1];

  return (
    <SafeAreaView className="flex-1 items-center bg-primary flex-col">
      {/* Header above card */}
      <View className= "justify-center items-center pt-5">
        <Text className="text-accent text-4xl" style={{ fontFamily: 'montserrat-bold' }}>
          {currentCard.location}
        </Text>
        <Text className="text-secondary text-xl" style={{ fontFamily: 'montserrat-semibold'}}>
          {currentCard.distance} mi away
        </Text>
      </View>

      {/* Swiper container */}
      <View className='w-full flex-1 flex-col justify-center items-center' style={{ marginTop: -40 }}>
        <Swiper
          ref={swiperRef}
          cards={restaurants}
          renderCard={(card) => (
              <RestaurantCard
                name={card.name}
                rating={card.rating}
                imageUrl={card.imageUrl}
                category={card.category}
                price={card.price}
                location={card.location}
                distance={card.distance}
              />
          )}
          onSwipedRight={onSwipedRight}
          onSwipedLeft={onSwipedLeft}
          stackSize={3}
          stackSeparation={0}
          backgroundColor="transparent"
          verticalSwipe={false}
          horizontalSwipe={true}
        />
        <View className="absolute bottom-0 gap-10 flex shadow-md flex-row">
          <CrossButton restaurant={currentCard} onLike={() => swiperRef.current?.swipeRight()}></CrossButton>
          <HeartButton restaurant={currentCard} onLike={() => swiperRef.current?.swipeRight()}></HeartButton>
        </View>   
      </View>
    </SafeAreaView>
  );
}
