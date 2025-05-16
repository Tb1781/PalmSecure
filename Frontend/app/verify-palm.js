import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import supabase from "./utils/supabase";

export default function VerifyPalm() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [imageUri, setImageUri] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!permission) return null;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      const resizedPhoto = await ImageManipulator.manipulateAsync(photo.uri);
      setImageUri(resizedPhoto.uri);
      setCameraVisible(false);
    }
  };

  const retakePicture = () => {
    setImageUri(null);
    setResult(null);
    setCameraVisible(true);
  };

  const confirmPicture = async () => {
    if (!imageUri) return;

    setLoading(true);
    setResult(null);

    try {
      console.log("📤 Uploading image...");
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const fileName = `${Date.now()}.png`;

      const { data, error } = await supabase.storage
        .from("my-bucket")
        .upload(fileName, arrayBuffer, {
          contentType: "image/png",
          upsert: false,
        });

      if (error) throw new Error("Upload error: " + error.message);
      console.log(`✅ Image uploaded: ${data?.path}`);

      console.log("🔍 Sending image to backend for verification...");
      const backendResponse = await fetch("http://192.168.28.188:8000/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_path: data?.path }),
      });

      const resultData = await backendResponse.json();

      if (resultData?.matched) {
        console.log(
          `🧠 Verification matched ✅ | ID: ${resultData.user_id}, Name: ${resultData.name}, Similarity: ${resultData.similarity.toFixed(4)}`
        );
      } else {
        console.log(
          `🧠 Verification failed ❌ | Similarity: ${resultData.similarity?.toFixed(4) ?? "N/A"}`
        );
      }

      setResult(resultData);

      const { error: deleteError } = await supabase.storage
        .from("my-bucket")
        .remove([data?.path]);

      if (deleteError) {
        console.warn("⚠️ Error deleting image from Supabase:", deleteError.message);
      } else {
        console.log("🗑️ Image deleted from Supabase successfully.");
      }
    } catch (err) {
      console.error("❌ Verification process error:", err.message);
      setResult({ matched: false });
    } finally {
      setLoading(false);
    }
  };

  const renderCamera = () => (
    <CameraView style={styles.camera} ref={ref} facing={facing} flash={flash}>
      <View style={styles.cameraControls}>
        <TouchableOpacity
          onPress={() => setFlash((prev) => (prev === "off" ? "on" : "off"))}
          style={styles.flashButton}
        >
          <Text style={styles.flashText}>Flash: {flash.toUpperCase()}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
          <View style={styles.captureInnerButton} />
        </TouchableOpacity>
      </View>
    </CameraView>
  );

  return (
    <View style={styles.container}>
      {!cameraVisible && !imageUri && !result && (
        <View style={styles.verifyContainer}>
          <Text style={styles.header}>Verify Palmprint</Text>

          <View style={styles.scanBox}>
            <Image
              source={require("../assets/hand-icon.jpg")} // replace with correct icon if needed
              style={styles.handIcon}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.instructions}>
            Place your palm within the box and hold steady
          </Text>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setCameraVisible(true)}
          >
            <Text style={styles.scanButtonText}>Scan Palm</Text>
          </TouchableOpacity>
        </View>
      )}

      {cameraVisible && renderCamera()}

      {imageUri && !loading && !result && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <View style={styles.previewButtons}>
            <TouchableOpacity style={styles.previewButton} onPress={retakePicture}>
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.previewButton} onPress={confirmPicture}>
              <Text style={styles.previewButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="green" />
          <Text style={{ marginTop: 10 }}>Verifying...</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultContainer}>
          {result.matched ? (
            <>
              <View style={styles.successCircle}>
                <Text style={styles.successIcon}>✅</Text>
              </View>
              <Text style={styles.successText}>Verified Successfully</Text>
              <Text style={styles.userDetail}>
                Name: <Text style={styles.bold}>{result.name}</Text>
              </Text>
              <Text style={styles.userDetail}>
                ID: <Text style={styles.bold}>{result.user_id}</Text>
              </Text>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  setImageUri(null);
                  setResult(null);
                }}
              >
                <Text style={{ color: "white", fontSize: 16 }}>Continue</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.failureCircle}>
                <Text style={styles.failureIcon}>❌</Text>
              </View>
              <Text style={styles.failureText}>Not Verified</Text>
              <Text style={styles.contactText}>Contact Admin to Register</Text>
              <TouchableOpacity
                style={styles.retryOnlyButton}
                onPress={retakePicture}
              >
                <Text style={{ color: "white", fontSize: 16 }}>Retry</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  verifyContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    color: "#000",
  },
  scanBox: {
    width: 240,
    height: 240,
    backgroundColor: "#f5f8ff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  handIcon: {
    width: 200,
    height: 200,
    tintColor: "#c2c2c2",
  },
  instructions: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  scanButton: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  camera: { flex: 1, width: "100%" },
  cameraControls: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
    width: "100%",
  },
  flashButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  flashText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  captureInnerButton: {
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: "white",
  },
  previewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
  previewImage: {
    width: "90%",
    height: "90%",
    borderRadius: 15,
    marginBottom: 20,
  },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "80%",
    marginTop: 20,
  },
  previewButton: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  previewButtonText: { color: "white", fontSize: 18 },
  loader: { marginTop: 30, alignItems: "center" },
  resultContainer: {
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  successCircle: {
    backgroundColor: "#d4f6dd",
    borderRadius: 100,
    padding: 30,
  },
  successIcon: { fontSize: 48 },
  successText: { fontSize: 18, color: "green", marginTop: 10 },
  userDetail: { fontSize: 16, marginTop: 5 },
  bold: { fontWeight: "bold" },
  continueButton: {
    marginTop: 20,
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  failureCircle: {
    backgroundColor: "#ffe5e5",
    borderRadius: 100,
    padding: 30,
  },
  failureIcon: { fontSize: 48, color: "red" },
  failureText: { fontSize: 18, color: "red", marginTop: 10 },
  contactText: { fontSize: 16, marginTop: 5, color: "#555" },
  retryOnlyButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
});
