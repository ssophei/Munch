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

const router = useRouter();

const AuthLandingScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header text */}
        <Text style={styles.header}>Login/Create Account</Text>

        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        {/* Legal text */}
        <Text style={styles.legal}>
          BY TAPPING 'SIGN IN' / 'CREATE ACCOUNT', YOU AGREE TO OUR{" "}
          <Text style={styles.link}>TERMS OF SERVICE</Text>. LEARN HOW WE
          PROCESS YOUR DATA IN OUR <Text style={styles.link}>PRIVACY POLICY</Text>{" "}
          AND <Text style={styles.link}>COOKIES POLICY</Text>.
        </Text>

        {/* Create Account button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/create-account")}
        >
          <Text style={styles.createButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

        {/* Sign in link */}
        <TouchableOpacity
          onPress={() => router.push("/login")}
        >
          <Text style={styles.signIn}>sign in</Text>
        </TouchableOpacity>
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
    marginBottom: 40,
    lineHeight: 18,
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
    color: "#ffd5ea",
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: "600",
  },

  signIn: {
    textAlign: "center",
    textDecorationLine: "underline",
    color: "#3b1322",
    fontSize: 22,
    fontWeight: "600",
  },
});
