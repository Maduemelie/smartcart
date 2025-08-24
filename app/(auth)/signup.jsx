import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function SignupScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { signup, updateUserProfile } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signup(email, password);
      // Update the user's display name after signup
      await updateUserProfile({
        displayName: name,
      });
      router.replace('/profile');
    } catch (error) {
      Alert.alert('Signup Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Sign up to get started
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderColor: colors.border,
              }]}
              placeholder="Full Name"
              placeholderTextColor={colors.text.secondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderColor: colors.border,
              }]}
              placeholder="Email"
              placeholderTextColor={colors.text.secondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderColor: colors.border,
              }]}
              placeholder="Password"
              placeholderTextColor={colors.text.secondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderColor: colors.border,
              }]}
              placeholder="Confirm Password"
              placeholderTextColor={colors.text.secondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Pressable
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.text.inverse} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.text.inverse }]}>
                  Sign Up
                </Text>
              )}
            </Pressable>

            <Pressable
              style={styles.switchMode}
              onPress={() => router.push('/login')}
            >
              <Text style={[styles.switchModeText, { color: colors.primary }]}>
                Already have an account? Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  switchMode: {
    padding: 16,
    alignItems: 'center',
  },
  switchModeText: {
    fontSize: 16,
    fontWeight: '500',
  },
});