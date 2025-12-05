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
import { ChevronLeft } from "lucide-react-native";

const CUISINES = [
  "Chinese",
  "Japanese",
  "Korean",
  "Thai",
  "Indian",
  "Mexican",
  "New American",
  "Italian",
  "French",
  "Vietnamese",
  "Drinks",
  "Fusion",
  "Ethiopian",
  "Himalayan",
];

export const CuisinesScreen: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggleCuisine = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleNext = () => {
    // do something with `selected`
    console.log("Selected cuisines:", selected);
    router.push("/dietary");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>

        <View style={styles.topSection}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={48} color="#8b2c33"/>
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Select your favorite cuisines!</Text>
        </View>
      </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
            <Text style={styles.nextText}>Next</Text>
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
  topSection: {
    width: "100%",
    backgroundColor: "#ffd9c5",
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  backIcon: {
    fontSize: 24,
    color: "#3b1322",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 25,
    color: "#3b1322",
    fontFamily: "montserrat-bold",
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
    backgroundColor: "#FAC5C7",
    alignItems: "center",
    justifyContent: "center",
  },
  cuisineButtonSelected: {
    backgroundColor: "#E68E91",
  },
  cuisineText: {
    fontSize: 15,
    color: "#3b1322",
    fontFamily: "montserrat-semibold",
  },
  cuisineTextSelected: {
    fontFamily: "montserrat-bold",
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
    color: "#ffffff",
    fontWeight: "600",
    fontFamily: "montserrat-bold"
  },
});

export default CuisinesScreen;
