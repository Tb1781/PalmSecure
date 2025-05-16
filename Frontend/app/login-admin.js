import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import supabase from './utils/supabase'; // adjust the path if needed

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  // Handle admin login using Supabase Auth
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const { error: authError, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      setError(authError.message);
      console.log(authError.message);
    } else {
      console.log('Logged in admin:', data.user);
      // Navigate to a secure area (for example, an admin dashboard)
      // router.push('/admin-dashboard');
      router.push('/admin/home');   
    }
    setLoading(false);
  };
  // Handle forgot password functionality
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email to reset your password.');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const { data: users, error: listUsersError } = await supabase.auth.admin.listUsers();
      if (listUsersError) {
        throw listUsersError;
      }
  
      const userExists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
      if (!userExists) {
        setError('The email entered is not a registered one.');
        setLoading(false);
        return;
      }
  
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) {
        setError(resetError.message);
      } else {
        console.log('Password reset email sent.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while sending the password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* <Image
          source={require('../assets/logo.png')} // place your logo image in the assets folder
          style={styles.logo}
          resizeMode="contain"
        /> */}
        <Text style={styles.logoTitle}>PalmSecure</Text>
        <Text style={styles.logoSubtitle}>Identity Verification System</Text>
      </View>

      <Text style={styles.header}>Admin Login</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email or Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email or username"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>

  );
};

export default AdminLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  logoSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    textAlign: 'center',
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
