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
import { Eye, EyeOff, ChevronLeft } from "lucide-react-native";

const CreateAccountScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Logo + Back Button */}
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={48} color="#8b2c33"/>
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        {/* Title */}
        <View className="flex items-center justify-center mb-3">
          <Text className="text-[#3b1322] text-4xl" style={{ fontFamily: "montserrat-bold"}}>Create Account</Text>
        </View>

        {/* FORM FIELDS */}
        <View style={styles.form}>
          {/* Email */}
          <Text style={styles.label}>* Email</Text>
          <TextInput
            style={styles.input}
            placeholder="munchforbiggies@gmail.com"
            placeholderTextColor="#8d8d8d"
            keyboardType="email-address"
          />

          {/* Phone */}
          <Text style={styles.label}>* Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="(123)-456-7890"
            placeholderTextColor="#8d8d8d"
            keyboardType="phone-pad"
          />

          {/* Password */}
          <Text style={styles.label}>* Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              secureTextEntry={!passwordVisible}
            />

            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <Eye size={24} color="#8C2F39" />
              ) : (
                <EyeOff size={24} color="#8C2F39" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* NEXT BUTTON */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => router.push("/confirmation-code")}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffd9c5",
  },
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#ffd9c5",
    paddingHorizontal: 16,
    fontFamily: 'montserrat-bold',
    justifyContent: "center",
    alignItems: "center",
  },

  // Header
  header: {
    color: "#8C2F39",
    marginBottom: 10,
    marginTop: 10,
    fontSize: 48,
    fontFamily: 'montserrat-bold',
  },

  // Logo and Back Button
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
    fontSize: 30,
    color: "#3b1322",
  },

  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },

  // Form
  form: {
    width: "100%",
    marginTop: 10,
  },

  label: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#3b1322",
    fontFamily: 'montserrat-bold',
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
    fontFamily: 'montserrat-semibold',
  },

  // Password Input (with eye icon)
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fbdacb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#b97c70",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 40,
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

  // Next Button
  nextButton: {
    backgroundColor: "#3b1322",
    borderRadius: 40,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  nextText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffffff",
    fontFamily: "montserrat-bold",
  },
});
