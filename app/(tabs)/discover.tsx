import { Text, View } from "react-native";
import RestaurantCard from "@/components/RestaurantCard"; 
import { withSwipe } from "@/components/Swipe";
import { SafeAreaView } from 'react-native-safe-area-context';

const SwipeableRestaurantCard = withSwipe(RestaurantCard);
 
// TODO: make sure to use the props you added in RestaurantCard.tsx in the example component below
// this is where you can test your changes! 
export default function DiscoverScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center flex-col">
        <Text className="text-xl font-semibold mt-40 text-accent mb-5" style={{ fontFamily: 'montserrat-bold' }}>
          Berkeley, CA
        </Text>
        <View className="w-11/12 max-w-sm aspect-video">
          <SwipeableRestaurantCard 
            name="example restaurant name"
            onSwipeLeft={() => console.log("❌ Disliked")}
            onSwipeRight={() => console.log("❤️ Liked")}
          >
        </SwipeableRestaurantCard>
      </View>
      </View>
    </SafeAreaView>
  );
}

