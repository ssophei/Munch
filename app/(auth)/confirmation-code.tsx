import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const ConfirmationCodeScreen = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);
  const router = useRouter();

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

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

        {/* Title & Info Text */}
        <Text style={styles.title}>Confirmation Code</Text>
        <Text style={styles.subtitle}>
          A 4-digit code was sent to{"\n"}(123)-456-7890
        </Text>

        {/* OTP Code Boxes */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => {
                inputs.current[index] = el!;
              }}
              style={styles.codeBox}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
            />
          ))}
        </View>

        {/* Resend Link */}
        <TouchableOpacity>
          <Text style={styles.resend}>Resend code</Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton}
          onPress={() => router.push("/location")}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default ConfirmationCodeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffd9c5",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffd9c5",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },

  header: {
    fontSize: 20,
    color: "#7b7b7b",
    marginTop: 10,
    marginBottom: 10,
  },

  topSection: {
    width: "100%",
    backgroundColor: "#ffd9c5",
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: 'montserrat-bold',
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 10,
  },

  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },

  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#3b1322",
    textAlign: "center",
    marginTop: 10,
    fontFamily: 'montserrat-bold',
  },

  subtitle: {
    textAlign: "center",
    color: "#8b2c33",
    fontSize: 16,
    marginTop: 6,
    marginBottom: 30,
    fontFamily: 'montserrat-semibold',
  },

  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 30,
  },

  codeBox: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: "#fbdacb",
    borderWidth: 1.5,
    borderColor: "#b97c70",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
  },

  resend: {
    textAlign: "center",
    color: "#8b2c33",
    fontSize: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
    marginBottom: 40,
    fontFamily: 'montserrat-bold',

  },

  continueButton: { 
    backgroundColor: "#3b1322",
    borderRadius: 40,
    paddingVertical: 18,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  continueText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "600",
    fontFamily: "montserrat-semibold",
  },
});
