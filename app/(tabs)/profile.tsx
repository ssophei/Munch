import "../global.css"
import { Text, View } from "react-native";
import Button from "@/components/Button";
 
// TO DO: edit the button component here so that it uses all of the props you've added
// note: you can hardcode sample text rn, just make sure that the button works as expected  
export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Button label = "this label has been hardcoded"></Button>
    </View>
  );
}