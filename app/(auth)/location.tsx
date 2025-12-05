import { useRouter } from "expo-router";
import React, { useState, useEffect} from "react";
import { ChevronLeft,  MapPin} from "lucide-react-native";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from 'expo-location';

const LocationScreen: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const fetchLocationAndPermissions = async () => {
    setIsLoadingLocation(true);
    setErrorMsg('');

    // Request Permission
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied.');
      setIsLoadingLocation(false);
      return;
    }

    // Get Location
    try {
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low, // Use low accuracy for better speed/battery
        timeInterval: 10000,
      });
      setLocation(currentLocation);
      console.log("Current Location fetched:", currentLocation.coords);

      // In a real app, you would use Reverse Geocoding here:
      // const geocodedAddress = await Location.reverseGeocodeAsync(currentLocation.coords);
      
      // Placeholder: Set input to coordinates
      const addressPlaceholder = `Lat: ${currentLocation.coords.latitude.toFixed(4)}, Lon: ${currentLocation.coords.longitude.toFixed(4)}`;
      setQuery(addressPlaceholder);

    } catch (error) {
      console.error("Error fetching location:", error);
      setErrorMsg('Failed to fetch location.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleNext = () => {
    if (!location) {
        Alert.alert("Location Required", "Please allow location access before proceeding.");
        return;
    }
    console.log("Selected address:", query);
    router.push("/cuisines")
  };

  const handleBack = () => {
    router.back();
  };

  const getLocationStatusText = () => {
    if (isLoadingLocation) return "";
    if (errorMsg) return "Location access denied.";
    if (location) return "Berkeley, CA 94704";
    return "";
}

  const getBlurbText = () => {
  if (isLoadingLocation) return "";
  if (errorMsg) return "Location access denied.";
  if (location) return "Got it! We'll show you around.";
  return "Where are you munching today?";
}

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Back + Logo */}
        <View style={styles.logoSection}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={48} color="#8b2c33"/>
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        {/* Question with pin icon */}
        <View style={styles.questionRow}>
          {isLoadingLocation}
            <Text style={styles.blurbText}>{getBlurbText()}</Text>
        </View>

        {/* Search row */}
        <View style={styles.statusRow}>
            <MapPin size={70} color={"#a33b3b"}/>
            {isLoadingLocation}
            <Text style={styles.statusText}>{getLocationStatusText()}</Text>
        </View>

        {!location && !isLoadingLocation && (
            <TouchableOpacity 
                style={styles.findLocationButton}
                onPress={fetchLocationAndPermissions}
            >
                <Text style={styles.findLocationButtonText}>Use My Current Location</Text>
            </TouchableOpacity>
        )}

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* NEXT button */}
        <TouchableOpacity 
            style={[styles.nextButton, !location && styles.nextButtonDisabled]} 
            onPress={handleNext}
            disabled={!location}
          >
            <Text style={[styles.nextText, !location && styles.nextButtonDisabled]} disabled={!location}
            >{location ? "Next" : "Awaiting Location..."}</Text>
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
    width: "100%", 
    backgroundColor: "#ffd9c5",
    paddingHorizontal: 30,
    paddingBottom: 24,
  },

  header: {
    fontSize: 20,
    color: "#7b7b7b",
    marginTop: 10,
    marginBottom: 6,
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginTop: 10,
    marginLeft: 15,
    gap: 15,
  },
  statusText: {
    fontSize: 48,
    color: '#a33b3b',
    fontWeight: '500',
    fontFamily: "montserrat-bold",
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
    width: 200,
    height: 200,
    resizeMode: "contain",
  },

  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    marginTop: 12,
    marginBottom: 10,
  },
  blurbText: {
    fontSize: 40,
    color: "#3b1322",
    fontFamily: "montserrat-bold"
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

  findLocationButton: {
    backgroundColor: "#8C2F39",
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  findLocationButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "montserrat-bold",
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
    color: "#AB797A",
  },

  nextButton: {
    backgroundColor: "#3b1322",
    borderRadius: 40,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  nextButtonDisabled: {
    backgroundColor: "#8d8d8d", // Gray out the button when location is not set
  },

  nextText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffffff",
    fontFamily: "montserrat-bold"
  },
  nextTextDisabled: {
    fontSize: 22,
    fontWeight: "600",
    color: "#c7bdbd",
    fontFamily: "montserrat-bold"
  },
});
