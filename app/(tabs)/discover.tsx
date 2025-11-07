import { Text, View } from "@/components/Themed";
import RestaurantCard from "@/components/RestaurantCard"; 
import { withSwipe } from "@/components/Swipe";

const SwipeableRestaurantCard = withSwipe(RestaurantCard);
 
// TODO: make sure to use the props you added in RestaurantCard.tsx in the example component below
// this is where you can test your changes! 
export default function DiscoverScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold text-blue-500">
      this is the page where users swipe!
      </Text>
    <SwipeableRestaurantCard 
      name="example restaurant name"
      onSwipeLeft={() => console.log("❌ Disliked")}
      onSwipeRight={() => console.log("❤️ Liked")}>
    </SwipeableRestaurantCard>
    </View>
  );
}

