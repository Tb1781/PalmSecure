import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PalmSecure</Text>
      <Text style={styles.subtitle}>Secure Identity Verification System</Text>

      {/* Palm Scan Icon Area */}
      <View style={styles.scanArea}>
        <View style={styles.scanOutline}>
          <Image
            source={require("../assets/hand-icon.jpg")} // 🖼️ Make sure this file exists
            style={styles.handImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={() => router.push("/verify-palm")}
      >
        <Text style={styles.verifyButtonText}>Verify Palm</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => router.push("/login-admin")}
      >
        <Text style={styles.registerButtonText}>Login Admin</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Powered by Advanced Biometrics</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  scanArea: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  scanOutline: {
    width: 120,
    height: 120,
    borderWidth: 4,
    borderColor: "#4CAF50",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  handImage: {
    width: 100,
    height: 90,
    tintColor: "#4CAF50", // Optional green tone
    opacity: 0.8,
  },
  verifyButton: {
    width: "80%",
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  registerButton: {
    width: "80%",
    padding: 15,
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  registerButtonText: {
    color: "#4CAF50",
    fontSize: 18,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    marginTop: 20,
  },
});
