import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const router = useRouter()

type Suggestion = {
  id: string;
  line1: string;
  line2: string;
};

const SUGGESTIONS: Suggestion[] = [
  {
    id: "1",
    line1: "205 Aunty Ave",
    line2: "Bannanton, CA 07604",
  },
  {
    id: "2",
    line1: "205 Wescott Ln",
    line2: "Bannanton, CA 07604",
  },
  {
    id: "3",
    line1: "205 Kishingham Dr",
    line2: "Bannanton, CA 07604",
  },
];

const LocationScreen: React.FC = () => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = SUGGESTIONS.filter((s) =>
    s.line1.toLowerCase().startsWith(query.toLowerCase())
  );

  const handleSelectSuggestion = (s: Suggestion) => {
    setQuery(s.line1);
    setShowSuggestions(false);
  };

  const handleUseCurrentLocation = () => {
    // TODO: hook into location services
    console.log("Use current location tapped");
  };

  const handleNext = () => {
    console.log("Selected address:", query);
    router.push("/cuisines")
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top label */}
        <Text style={styles.header}>Where are you located?</Text>

        {/* Back + Logo */}
        <View style={styles.logoSection}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backIcon}>〈</Text>
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        {/* Question with pin icon */}
        <View style={styles.questionRow}>
          <Text style={styles.pinIcon}>📍</Text>
          <Text style={styles.questionText}>Where are you located?</Text>
        </View>

        {/* Search row */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                setShowSuggestions(text.length > 0);
              }}
              placeholder="205"
              placeholderTextColor="#8d8d8d"
            />
          </View>

          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>

        {/* Suggestions + current location */}
        {showSuggestions && (
          <View style={styles.suggestionsRow}>
            <View style={styles.suggestionsBox}>
              {filteredSuggestions.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSuggestion(s)}
                >
                  <Text style={styles.suggestionLine1}>{s.line1}</Text>
                  <Text style={styles.suggestionLine2}>{s.line2}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.currentLocationBox}
              onPress={handleUseCurrentLocation}
            >
              <Text style={styles.currentLocationText}>Use current location</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* NEXT button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffd9c5",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffd9c5",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  header: {
    fontSize: 20,
    color: "#7b7b7b",
    marginTop: 10,
    marginBottom: 6,
  },

  logoSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 12,
  },
  backIcon: {
    fontSize: 30,
    color: "#3b1322",
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
  },

  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 10,
  },
  pinIcon: {
    fontSize: 22,
    marginRight: 6,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3b1322",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInputWrapper: {
    flex: 1,
    backgroundColor: "#ffe8dc",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#d6a18a",
  },
  searchInput: {
    fontSize: 16,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 8,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  sendIcon: {
    fontSize: 20,
    color: "#3b1322",
  },

  suggestionsRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  suggestionsBox: {
    flex: 1,
    backgroundColor: "#ffe8c8",
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  suggestionItem: {
    paddingVertical: 8,
  },
  suggestionLine1: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3b1322",
  },
  suggestionLine2: {
    fontSize: 14,
    color: "#3b1322",
  },

  currentLocationBox: {
    marginLeft: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  currentLocationText: {
    fontSize: 12,
    color: "#3b1322",
  },

  nextButton: {
    backgroundColor: "#3b1322",
    borderRadius: 40,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  nextText: {
    fontSize: 22,
    letterSpacing: 4,
    fontWeight: "600",
    color: "#ffd5ea",
  },
});
