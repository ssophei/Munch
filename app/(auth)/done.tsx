// app/(auth)/done.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ONBOARDING_KEY = "hasOnboarded";


const DoneScreen: React.FC = () => {
  const router = useRouter();
  
  const finish = async () => {
        await AsyncStorage.setItem(ONBOARDING_KEY, "true");
        router.replace("/discover"); // first tab screen
    };

  const handleDone = () => {
    // Navigate to your main app page
    router.push("/(tabs)/discover"); // Change this to match your app structure
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        {/* Message */}
        <Text style={styles.message}>
          CLICK DONE TO START SEARCHING!
        </Text>

        {/* Done Button */}
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>DONE</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default DoneScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffd9c5",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffd9c5",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
    paddingHorizontal: 24,
  },

  logoWrapper: {
    marginTop: 40,
    alignItems: "center",
  },

  logo: {
    width: 260,
    height: 260,
    resizeMode: "contain",
  },

  message: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "700",
    color: "#3b1322",
    textAlign: "center",
    letterSpacing: 1,
  },

  doneButton: {
    marginTop: 40,
    backgroundColor: "#ffd5ea",
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  doneButtonText: {
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 3,
    color: "#3b1322",
  },
});
