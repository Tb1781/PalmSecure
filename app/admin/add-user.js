import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView, // Import ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import supabase from '../utils/supabase';
import ImagePickerComponent from '../components/ImagePicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // For checkmark and alert triangle

export default function AddUser() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // State for uploaded images
  const [leftPalmImages, setLeftPalmImages] = useState([]);
  const [rightPalmImages, setRightPalmImages] = useState([]);

  // Request permissions for image picker on component mount
  React.useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'You need to grant permission to access photos.'
        );
      }
    })();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    // Validate required fields
    if (!fullName || !email || leftPalmImages.length < 2 || rightPalmImages.length < 2) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // Create user in Supabase
    try {
      const { data, error } = await supabase
        .from('Users')
        .insert({
          Name: fullName,
          email: email,
        })
        .select(); // Add this line to request the inserted row

      console.log(data, error);

      if (error) {
        console.error('Error creating user:', error.message);
        Alert.alert('Error', 'Failed to create user.');
        return;
      }

      // Ensure data exists and has at least one item
      if (!data || data.length === 0) {
        console.error('Unexpected error: No data returned from Supabase.');
        Alert.alert('Error', 'Failed to retrieve user ID.');
        return;
      }

      const userId = data[0].id;

      // Upload images to Supabase bucket
      await Promise.all([
        ...leftPalmImages.map((image, index) =>
          uploadImage(image, `${userId}/left_palm_${index + 1}.jpg`)
        ),
        ...rightPalmImages.map((image, index) =>
          uploadImage(image, `${userId}/right_palm_${index + 1}.jpg`)
        ),
      ]);

      // Send images to FastAPI backend for processing (placeholder)
      // You can add this step here after images are uploaded

      Alert.alert('Success', 'User registered successfully.');
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  // Function to upload an image to Supabase bucket
  const uploadImage = async (image, fileName) => {
    const { uri } = image;
    // const filePath = `user-palmprint-images/${fileName}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('user-palmprint-images')
      .upload(filePath, uri);

    if (error) {
      console.error('Error uploading image:', error.message);
      throw error;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Wrap the entire content in ScrollView */}
      <Text style={styles.title}>Add New User</Text>

      {/* Full Name */}
      <Text style={styles.label}>Full Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter full name"
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Email Address */}
      <Text style={styles.label}>Email Address *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Palm Images */}
      <Text style={styles.label}>Palm Images</Text>
      <Text style={styles.sublabel}>Upload clear images of both palms</Text>

      {/* Left Hand */}
      <ImagePickerComponent
        title="Left Hand"
        images={leftPalmImages}
        onPickImages={(images) => setLeftPalmImages(images)}
        maxImages={2}
      />

      {/* Right Hand */}
      <ImagePickerComponent
        title="Right Hand"
        images={rightPalmImages}
        onPickImages={(images) => setRightPalmImages(images)}
        maxImages={2}
      />

      {/* Status Messages */}
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

      {/* Register Button */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleSubmit}
        disabled={!fullName || !email || leftPalmImages.length < 2 || rightPalmImages.length < 2}
      >
        <Text style={styles.registerButtonText}>Register User</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sublabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
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
});