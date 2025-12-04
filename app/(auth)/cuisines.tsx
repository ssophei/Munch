// CuisinesScreen.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const router = useRouter()

const CUISINES = [
  "Korean",
  "Japanese",
  "Chinese",
  "Thai",
  "Indian",
  "Mexican",
  "American",
  "Italian",
  "French",
  "Greek",
  "Drinks",
  "Fusion",
];

export const CuisinesScreen: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCuisine = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleNext = () => {
    // do something with `selected`
    console.log("Selected cuisines:", selected);
    router.push("/done")
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backIcon}>〈</Text>
          </TouchableOpacity>

          {/* Logo placeholder (replace with real asset) */}
          <View style={styles.logoWrapper}>
            <Image
                source={require("../../assets/images/logo.png")} style={styles.logo}
            />
            
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>MUNCH KIT</Text>
            </View>
          </View>

          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Select your favorite cuisines!</Text>

          {/* Buttons grid */}
          <View style={styles.grid}>
            {CUISINES.map((cuisine) => {
              const isSelected = selected.includes(cuisine);
              return (
                <TouchableOpacity
                  key={cuisine}
                  style={[
                    styles.cuisineButton,
                    isSelected && styles.cuisineButtonSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => toggleCuisine(cuisine)}
                >
                  <Text
                    style={[
                      styles.cuisineText,
                      isSelected && styles.cuisineTextSelected,
                    ]}
                  >
                    {cuisine}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* NEXT button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.nextButton}
            activeOpacity={0.9}
            onPress={handleNext}
          >
            <Text style={styles.nextText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffd9c5", // peachy background
  },
  container: {
    flex: 1,
    backgroundColor: "#ffd9c5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#3b1322",
  },
  logoWrapper: {
    flex: 1,
    alignItems: "center",
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#3b1322",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffe6f0",
  },
  logoText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    color: "#3b1322",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 32,
    color: "#3b1322",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cuisineButton: {
    width: "47%",
    paddingVertical: 14,
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: "#ffd5ea",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cuisineButtonSelected: {
    backgroundColor: "#f9b9d4",
  },
  cuisineText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3b1322",
  },
  cuisineTextSelected: {
    fontWeight: "700",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  nextButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 30,
    backgroundColor: "#3b1322",
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: {
    fontSize: 20,
    letterSpacing: 4,
    color: "#ffd5ea",
    fontWeight: "600",
  },
  logo: {
    width: 96,
    height: 96,
    resizeMode: "contain",
  },
});

export default CuisinesScreen;
