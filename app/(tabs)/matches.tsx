import { Text, View, Image} from "react-native";
import RestaurantCard from "@/components/RestaurantCard"; 
import { withSwipe } from "@/components/Swipe";
import { SafeAreaView } from 'react-native-safe-area-context';

const SwipeableRestaurantCard = withSwipe(RestaurantCard);
const munchLogo = require('../../assets/images/munch-logo.png');

export default function MatchesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-start flex-col">
        <Image source = { munchLogo } style={{ width: 150, height: 150 }}/>
        <Text className="text-5xl font-semibold mt-40 text-accent mb-5" style={{ fontFamily: 'montserrat-bold' }}>
          Your Matches
        </Text>
        <View className="w-11/12 max-w-sm aspect-video">
          <SwipeableRestaurantCard 
            name="example match name"
            onSwipeLeft={() => console.log("❌ Disliked")}
            onSwipeRight={() => console.log("❤️ Liked")}
          >
          </SwipeableRestaurantCard>
      </View>
      </View>
    </SafeAreaView>
  );
}