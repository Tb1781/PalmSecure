import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';

import supabase from '../utils/supabase';
import UserCard from '../components/UserCard';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import EditUserModal from '../components/EditUserModal';
import NavigationBar from "../components/NavigationBar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null); // Stores user to delete
  const [showEditModal, setShowEditModal] = useState(null); // Stores user to edit

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data: users, error } = await supabase.from('Users').select('*');
    if (error) {
      console.error('Error fetching users:', error.message);
    } else {
      // Sanitize the data to ensure all required fields exist
      const sanitizedUsers = users.map((user) => ({
        id: user.id || 'N/A',
        Name: user.Name || 'Unnamed', // Updated to match Supabase column name
        email: user.email || 'No email',
        present_today: user.present_today || false,
      }));
      setUsers(sanitizedUsers);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredUsers = users.filter((user) =>
    user.Name?.toLowerCase().includes(searchQuery.toLowerCase()) || false // Updated to use Name
  );

  const handleDelete = (userId) => {
    console.log("Deleting user with ID:", userId);
    setShowDeleteModal(userId);
  };

  const handleEdit = (user) => {
    setShowEditModal(user);
  };

  const confirmDelete = async (userId) => {
    try {
      const { error } = await supabase.from('Users').delete().eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error.message);
      } else {
        setShowDeleteModal(null);
        fetchUsers(); // 👈 Refresh from Supabase
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const updateUserData = (updatedUser) => {
    setUsers(users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>
      </View>
      <View style={styles.searchContainer}>
        <NavigationBar />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      />
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          visible={true}
          onClose={() => setShowDeleteModal(null)}
          onDelete={showDeleteModal}
          onConfirm={() => confirmDelete(showDeleteModal)}
        />
      )}
      {/* Edit User Modal */}
      {showEditModal && (
        <EditUserModal
          visible={true}
          onClose={() => setShowEditModal(null)}
          user={showEditModal}
          onUpdate={updateUserData}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    width: '100%',
  },
});