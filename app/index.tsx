import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/(tabs)/discover" />;
}