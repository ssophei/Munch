import { Text, View } from "react-native";
import FoodCard from "@/components/FoodCard";
 
// TO DO: edit the foodcard component here so that it uses all of the props you've added
// note: you can hardcode sample data rn until backend gets set up 
export default function DiscoverScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <FoodCard name = "this text has been hardcoded"/>
    </View>
  );
}