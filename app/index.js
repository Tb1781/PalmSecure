import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* <Image source={require("../assets/fingerprint.png")} style={styles.icon} /> */}
      <Text style={styles.title}>Welcome to PalmSecure</Text>
      <Text style={styles.subtitle}>Secure Identity Verification System</Text>
      <View style={styles.scanArea}>
        <View style={styles.scanOutline} />
      </View>
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
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  icon: { width: 50, height: 50, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 40 },
  scanArea: { width: 200, height: 200, justifyContent: "center", alignItems: "center", marginBottom: 40 },
  scanOutline: { width: 100, height: 100, borderWidth: 4, borderColor: "#4CAF50", borderRadius: 20 },
  verifyButton: { width: "80%", padding: 15, backgroundColor: "#4CAF50", borderRadius: 10, alignItems: "center", marginBottom: 20 },
  verifyButtonText: { color: "#fff", fontSize: 18 },
  registerButton: { width: "80%", padding: 15, backgroundColor: "#E8F5E9", borderRadius: 10, alignItems: "center", marginBottom: 20 },
  registerButtonText: { color: "#4CAF50", fontSize: 18 },
  footerText: { fontSize: 14, color: "#666", marginTop: 20 },
});


// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

// const WelcomeScreen = () => {
//   return (
//     <View style={styles.container}>
//       {/* Fingerprint Icon */}
//       {/* <Image source={require('../assets/fingerprint.png')} style={styles.icon} /> */}
      
//       {/* Title and Subtitle */}
//       <Text style={styles.title}>Welcome to PalmSecure</Text>
//       <Text style={styles.subtitle}>Secure Identity Verification System</Text>

//       {/* Scan Area */}
//       <View style={styles.scanArea}>
//         <View style={styles.scanOutline} />
//       </View>

//       {/* Verify and Register Buttons */}
//       <TouchableOpacity
//         style={styles.verifyButton}
//         onPress={() => navigation.navigate('VerifyPalm')}
//       >
//         <Text style={styles.verifyButtonText}>Verify User</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.registerButton}
//         onPress={() => navigation.navigate('LoginAdmin')}
//       >
//         <Text style={styles.registerButtonText}>Admin Login</Text>
//       </TouchableOpacity>

//       {/* Footer Text */}
//       <Text style={styles.footerText}>Powered by Advanced Biometrics</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   icon: {
//     width: 50,
//     height: 50,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 40,
//   },
//   scanArea: {
//     width: 200,
//     height: 200,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   scanOutline: {
//     width: 100,
//     height: 100,
//     borderWidth: 4,
//     borderColor: '#4CAF50',
//     borderRadius: 20,
//   },
//   verifyButton: {
//     width: '80%',
//     padding: 15,
//     backgroundColor: '#4CAF50',
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   verifyButtonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   registerButton: {
//     width: '80%',
//     padding: 15,
//     backgroundColor: '#E8F5E9',
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   registerButtonText: {
//     color: '#4CAF50',
//     fontSize: 18,
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 20,
//   },
// });

// export default WelcomeScreen;

