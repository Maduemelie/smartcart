import React, { useState, useCallback } from 'react';
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

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/'); // Redirect to the main tab navigator instead of directly to profile
    } catch (error) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Sign in to continue
          </Text>

          <View style={styles.inputContainer}>
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

            <Pressable
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.text.inverse} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.text.inverse }]}>
                  Sign In
                </Text>
              )}
            </Pressable>

            <Pressable
              style={styles.switchMode}
              onPress={() => router.push('/signup')}
            >
              <Text style={[styles.switchModeText, { color: colors.primary }]}>
                Don't have an account? Sign Up
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