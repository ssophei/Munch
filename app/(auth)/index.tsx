import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthLandingScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

      <View style={styles.logoWrapper}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>

        {/* Create Account button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/create-account")}
        >
          <Text style={styles.createButtonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Sign in link */}
        <TouchableOpacity
          onPress={() => router.push("/login")}
        >
          <Text style={styles.signIn}>Sign In</Text>
        </TouchableOpacity>

        
        {/* Legal text */}
        <Text style={styles.legal}>
          By tapping 'Sign In' / 'Create Account', you agree to our{" "}
          <Text style={styles.link}>terms of service</Text>. Learn how we
          process your data in our <Text style={styles.link}>privacy policy</Text>{" "}
          and <Text style={styles.link}>cookies policy</Text>.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthLandingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffd9c5",
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
    backgroundColor: "#ffd9c5",
  },

  header: {
    fontSize: 18,
    color: "#7b7b7b",
    marginBottom: 20,
  },

  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },

  logo: {
    width: 260,
    height: 260,
    resizeMode: "contain",
  },

  legal: {
    textAlign: "center",
    color: "#5b2b32",
    fontSize: 12,
    marginHorizontal: 10,
    marginTop: 40,
    lineHeight: 18,
    fontFamily: "montserrat-regular"
  },

  link: {
    textDecorationLine: "underline",
  },

  createButton: {
    backgroundColor: "#3b1322",
    borderRadius: 40,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 20,
  },

  createButtonText: {
    color: "#ffffff",
    fontSize: 24,
    letterSpacing: 2,
    fontWeight: "600",
    fontFamily: "montserrat-bold",
  },

  signIn: {
    textAlign: "center",
    textDecorationLine: "underline",
    color: "#3b1322",
    fontSize: 22,
    fontWeight: "600",
    fontFamily: "montserrat-bold",
  },
});
