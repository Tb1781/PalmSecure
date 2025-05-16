import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function UserCard({ user, onDelete, onEdit }) {
  return (
    <View style={styles.card}>
      <Text style={styles.userId}>#{user.id}</Text>
      <Text style={styles.userName}>{user.Name}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.statusText,
            user.present_today ? styles.active : styles.inactive,
          ]}
        >
          {user.present_today ? 'Active' : 'Inactive'}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => onEdit(user)}>
          <MaterialIcons name="mode-edit" size={24} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(user.id)}>
          <MaterialIcons name="delete" size={24} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userId: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statusText: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  active: {
    backgroundColor: '#28a745',
    color: '#fff',
  },
  inactive: {
    backgroundColor: '#dc3545',
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});