import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { Image } from "expo-image";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

export default function VerifyPalm() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [imageUri, setImageUri] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [facing, setFacing] = useState("back");

  if (!permission) {
    return null;
  }

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

  // Capture the Image
  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      // Resize image to 128x128
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1024, height: 1024 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      setImageUri(resizedPhoto.uri);
      setCameraVisible(false);
    }
  };

  // Reset the Image
  const retakePicture = () => {
    setImageUri(null);
    setCameraVisible(true);
  };

  // Confirm the Image
  const confirmPicture = () => {
    console.log("Image confirmed:", imageUri);
  };

  const renderCamera = () => (
    <CameraView style={styles.camera} ref={ref} facing={facing}>
      <View style={styles.cameraControls}>
        <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
          <View style={styles.captureInnerButton} />
        </TouchableOpacity>
      </View>
    </CameraView>
  );

  return (
    <View style={styles.container}>
      {!cameraVisible && !imageUri && (
        <View style={styles.verifyContainer}>
          <Text style={styles.header}>Verify Palmprint</Text>
          <View style={styles.palmBox}>
            <Text style={styles.palmIcon}>🖐️</Text>
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

      {imageUri && (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  verifyContainer: { alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  palmBox: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  palmIcon: { fontSize: 100 },
  instructions: { fontSize: 16, marginBottom: 20 },
  scanButton: { backgroundColor: "green", padding: 10, borderRadius: 5 },
  scanButtonText: { color: "white", fontSize: 16 },
  camera: { flex: 1, width: "100%" },
  cameraControls: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
    width: "100%",
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
  previewButton: { backgroundColor: "green", padding: 12, borderRadius: 5 },
  previewButtonText: { color: "white", fontSize: 18 },
});