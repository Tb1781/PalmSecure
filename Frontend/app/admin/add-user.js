import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import supabase from '../utils/supabase';
import ImagePickerComponent from '../components/ImagePicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';
import NavigationBar from '../components/NavigationBar';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";

export default function AddUser() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [leftPalmImages, setLeftPalmImages] = useState([]);
  const [rightPalmImages, setRightPalmImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'You need to grant permission to access photos.');
      }
    })();
  }, []);

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setLeftPalmImages([]);
    setRightPalmImages([]);
  };

  const deleteImagesFromBucket = async (userId) => {
    const paths = [
      `${userId}/left_palm_1.jpg`,
      `${userId}/left_palm_2.jpg`,
      `${userId}/right_palm_1.jpg`,
      `${userId}/right_palm_2.jpg`,
    ];
  
    const { error } = await supabase.storage
      .from("user-palmprint-images")
      .remove(paths);
  
    if (error) {
      console.error("🗑️ Error deleting bucket images:", error.message);
    } else {
      console.log("🗑️ Images deleted from Supabase bucket.");
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !email || leftPalmImages.length < 2 || rightPalmImages.length < 2) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      console.log("📥 Creating user in Supabase...");
      const { data, error } = await supabase
        .from('Users')
        .insert({ Name: fullName, email: email })
        .select();

      if (error || !data || data.length === 0) throw new Error(error?.message || "Failed to insert user.");
      const userId = data[0].id;
      console.log("✅ User created with ID:", userId);

      console.log("📤 Uploading images...");
      await Promise.all([
        ...leftPalmImages.map((img, idx) => uploadImage(img, `${userId}/left_palm_${idx + 1}.jpg`)),
        ...rightPalmImages.map((img, idx) => uploadImage(img, `${userId}/right_palm_${idx + 1}.jpg`)),
      ]);
      console.log("✅ All images uploaded.");

      console.log("🔧 Calling backend to extract features...");
      const res = await fetch("http://192.168.28.188:8000/extract_features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.detail || "Backend error.");
      console.log("✅ Features saved. User fully registered.");
      await deleteImagesFromBucket(userId);
      setSuccess(true);

      setTimeout(() => {
        setLoading(false);
        resetForm();
        setSuccess(false);
        router.replace("/admin/home"); // ← Ensure this route exists
      }, 2000);
    } catch (err) {
      console.error("❌", err.message);
      Alert.alert("Error", err.message);
      setLoading(false);
    }
  };

  const uploadImage = async (image, fileName) => {
    const { uri, type } = image;
    const fileContent = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const arrayBuffer = base64ToUint8Array(fileContent);

    const { error } = await supabase.storage
      .from("user-palmprint-images")
      .upload(fileName, arrayBuffer, {
        contentType: type || "image/jpeg",
      });

    if (error) throw new Error("Upload failed: " + error.message);
    console.log(`🖼️ Uploaded ${fileName}`);
  };

  const base64ToUint8Array = (base64) => {
    const raw = atob(base64);
    const array = new Uint8Array(new ArrayBuffer(raw.length));
    for (let i = 0; i < raw.length; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  };

  if (typeof atob === 'undefined') {
    global.atob = (b64) => Buffer.from(b64, 'base64').toString('binary');
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {success ? (
          <>
            <FontAwesome name="check-circle" size={60} color="#28a745" />
            <Text style={styles.successMessageBig}>User Registered Successfully!</Text>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color="#28a745" />
            <Text style={styles.loadingText}>Registering user...</Text>
          </>
        )}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NavigationBar />
      <Text style={styles.title}>Add New User</Text>

      <Text style={styles.label}>Full Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter full name"
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Email Address *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Palm Images</Text>
      <Text style={styles.sublabel}>Upload clear images of both palms</Text>

      <ImagePickerComponent
        title="Left Hand"
        images={leftPalmImages}
        onPickImages={(imgs) => setLeftPalmImages(imgs)}
        maxImages={2}
      />

      <ImagePickerComponent
        title="Right Hand"
        images={rightPalmImages}
        onPickImages={(imgs) => setRightPalmImages(imgs)}
        maxImages={2}
      />

      {leftPalmImages.length >= 2 && rightPalmImages.length >= 2 ? (
        <View style={styles.successMessage}>
          <FontAwesome name="check-circle" size={20} color="#28a745" />
          <Text style={styles.successText}>Images uploaded successfully</Text>
        </View>
      ) : (
        <View style={styles.errorMessage}>
          <FontAwesome name="exclamation-triangle" size={20} color="#dc3545" />
          <Text style={styles.errorText}>Please fill in all required fields</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleSubmit}
        disabled={!fullName || !email || leftPalmImages.length < 2 || rightPalmImages.length < 2}
      >
        <Text style={styles.registerButtonText}>Register User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.registerButton, { backgroundColor: '#007bff' }]}
        onPress={resetForm}
      >
        <Text style={styles.registerButtonText}>Clear Form</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  sublabel: { fontSize: 14, color: '#666', marginBottom: 10 },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4edda',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  errorMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  successText: {
    fontSize: 14,
    color: '#155724',
    marginLeft: 5,
  },
  errorText: {
    fontSize: 14,
    color: '#721c24',
    marginLeft: 5,
  },
  registerButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  successMessageBig: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28a745",
    marginTop: 20,
  },
});
