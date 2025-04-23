import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import supabase from '../utils/supabase';

export default function EditUserModal({ visible, onClose, user, onUpdate }) {
  const [Name, setName] = useState(user.Name); // Updated to use Name
  const [email, setEmail] = useState(user.email);
  const [presentToday, setPresentToday] = useState(user.present_today);

  const handleUpdate = async () => {
    try {
      const { error } = await supabase.from('Users').update({
        Name, // Updated to use Name
        email,
        present_today: presentToday,
      }).eq('id', user.id);

      if (error) {
        console.error('Error updating user:', error.message);
      } else {
        onUpdate({ ...user, Name, email, present_today: presentToday }); // Updated to use Name
        onClose();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit User</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={Name} // Updated to use Name
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.toggleLabel}>Present Today:</Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              presentToday ? styles.toggleActive : styles.toggleInactive,
            ]}
            onPress={() => setPresentToday(!presentToday)}
          >
            <Text style={styles.toggleButtonText}>
              {presentToday ? 'Yes' : 'No'}
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
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
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  toggleButton: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleActive: {
    backgroundColor: '#28a745',
  },
  toggleInactive: {
    backgroundColor: '#dc3545',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});