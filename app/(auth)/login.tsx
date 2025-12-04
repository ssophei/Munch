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

const LoginScreen: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = () => {
    // TODO: hook into your auth logic
    console.log("Log in tapped");
    router.push("/done")
  };

  const handleForgotPassword = () => {
    // TODO: navigate to a reset password screen
    console.log("Forgot password tapped");
  };

  const handleGoToCreateAccount = () => {
    // TODO: navigate to your CreateAccount screen
    console.log("Go to create account tapped");
    router.push("/create-account")
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.header}>Log in</Text>

        {/* Logo + Back */}
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backIcon}>〈</Text>
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#8d8d8d"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              secureTextEntry={!passwordVisible}
              placeholder="••••••••"
              placeholderTextColor="#8d8d8d"
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible((v) => !v)}
            >
              <Text style={styles.eyeIcon}>{passwordVisible ? "👁" : "👁️‍🗨️"}</Text>
            </TouchableOpacity>
          </View>

          {/* Forgot password */}
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Log In button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>LOG IN</Text>
        </TouchableOpacity>

        {/* Create account link */}
        <TouchableOpacity
          style={styles.createAccountLinkWrapper}
          onPress={handleGoToCreateAccount}
        >
          <Text style={styles.createAccountText}>
            Don’t have an account? <Text style={styles.createAccountUnderline}>Create account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffd9c5",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffd9c5",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  header: {
    fontSize: 20,
    color: "#7b7b7b",
    marginTop: 10,
    marginBottom: 10,
  },

  topSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 10,
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

  form: {
    marginTop: 10,
  },

  label: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#3b1322",
  },

  input: {
    width: "100%",
    backgroundColor: "#fbdacb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#b97c70",
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 22,
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fbdacb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#b97c70",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  eyeIcon: {
    fontSize: 22,
    paddingHorizontal: 6,
  },

  forgotText: {
    textAlign: "right",
    color: "#8b2c33",
    fontSize: 14,
    textDecorationLine: "underline",
    marginBottom: 30,
  },

  loginButton: {
    backgroundColor: "#3b1322",
    borderRadius: 40,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  loginText: {
    fontSize: 22,
    letterSpacing: 4,
    fontWeight: "600",
    color: "#ffd5ea",
  },

  createAccountLinkWrapper: {
    marginTop: 18,
    alignItems: "center",
  },
  createAccountText: {
    fontSize: 16,
    color: "#3b1322",
  },
  createAccountUnderline: {
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
