import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const ONBOARDING_KEY = "hasOnboarded";

type Status = "loading" | "needs-onboarding" | "done";

export default function Index() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const check = async () => {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setStatus(value === "true" ? "done" : "needs-onboarding");
    };
    check();
  }, []);

  if (status === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (status === "needs-onboarding") {
    return <Redirect href="/(auth)" />;
  }

  return <Redirect href="/discover" />;
}
