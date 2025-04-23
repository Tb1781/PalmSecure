import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 

export default function ImagePickerComponent({ title, images, onPickImages, maxImages }) {
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: maxImages,
    });

    if (!result.canceled) {
      onPickImages(result.assets);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
        {/* Upload Icon */}
        <MaterialIcons name="cloud-upload" size={40} color="#ccc" />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Tap to upload</Text>
      </TouchableOpacity>
      {images.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image.uri }}
          style={styles.previewImage}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  uploadButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  previewImage: {
    width: '100%',
    height: 150,
    marginTop: 10,
    borderRadius: 8,
  },
});