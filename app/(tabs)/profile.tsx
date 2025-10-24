import "../global.css"
import { Text, View } from "react-native";
import Button from "@/components/Button";
 
export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Button label = "this label has been hardcoded"></Button>
    </View>
  );
}