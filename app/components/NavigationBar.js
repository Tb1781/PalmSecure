import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function NavigationBar() {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      {/* Overview */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/admin/home')}
      >
        <MaterialIcons name="home" size={20} color="#333" />
        <Text style={styles.navText}>Overview</Text>
      </TouchableOpacity>

      {/* Users */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/admin/users')}
      >
        <FontAwesome name="user" size={20} color="#333" />
        <Text style={styles.navText}>Users</Text>
      </TouchableOpacity>

      {/* New User */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/admin/add-user')}
      >
        <MaterialIcons name="person-add" size={20} color="#333" />
        <Text style={styles.navText}>New User</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
    marginLeft: 5,
  },
});