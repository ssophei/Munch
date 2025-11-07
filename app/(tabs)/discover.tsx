import { Text, View } from "@/components/Themed";
import RestaurantCard from "@/components/RestaurantCard"; 
 
// TODO: make sure to use the props you added in RestaurantCard.tsx in the example component below
// this is where you can test your changes! 
export default function DiscoverScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold text-blue-500">
      this is the page where users swipe!
      </Text>
    <RestaurantCard name="example restaurant name">
    </RestaurantCard>
    </View>
  );
}

