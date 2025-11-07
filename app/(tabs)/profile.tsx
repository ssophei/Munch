import "../global.css"
import { Text, View } from "@/components/Themed";
import Button from "@/components/Button";
 
// TODO: build the profile screen! this should use the lists of provided preferences and dynamically render
// buttons for each preference underneath its corresponding section (meaning don't hardcode each string!)
// you might find .map() helpful. 
export default function ProfileScreen() {
  const dietary = ["No Preference", "Vegetarian", "Vegan", "Halal", "Kosher"];
  const cuisines = ["Italian", "Mexican", "Japanese", "Indian", "Thai", "American"];

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-6xl font-bold mb-4">Your Profile</Text>
      <Button label = "hardcoded text"></Button>
      <Text className="text-6xl font-bold mb-4">Dietary Restrictions</Text>
      <Button label = "hardcoded text"></Button>
      <Text className="text-6xl font-bold mb-4">Cusines</Text>
      <Button label = "hardcoded text"></Button>
    </View>
  );
}