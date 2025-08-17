import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../hooks/useColorScheme';
import { useUser } from '../../smartcart/context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { colors } = useColorScheme();
  const router = useRouter();
  const { user, isLoading, updateUserProfile, logout } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || ''); // Firebase user object has displayName
    }
  }, [user]);

  const handleSave = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await updateUserProfile({
        displayName: name,
        // Note: Updating email with Firebase Auth requires re-authentication.
      });
      setIsEditing(false);
      Alert.alert('Profile Updated', 'Your information has been saved.');
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, user, updateUserProfile, isSubmitting]);

  const handleLogout = async () => {
    try {
      await logout();
      // Auth state listener in UserContext will handle navigation
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };


  if (!user && !isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            paddingHorizontal: 40,
          }}
        >
          Could not load user data. Please ensure the app is configured
          correctly and you are logged in.
        </Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen
        options={{
          title: 'Profile',
          headerRight: () => (
            <Pressable
              onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
              style={styles.headerButton}
              disabled={isSubmitting}
            >
              <Text
                style={[styles.headerButtonText, { color: colors.primary }]}
              >
                {isEditing ? (isSubmitting ? 'Saving...' : 'Save') : 'Edit'}
              </Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons name="person" size={40} color={colors.text.inverse} />
            </View>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text.primary,
                    borderColor: colors.border,
                  },
                ]}
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                placeholderTextColor={colors.text.secondary}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text.primary,
                    borderColor: colors.border,
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: colors.text.primary }]}>
                {user?.displayName || 'Anonymous User'}
              </Text>
              <Text style={[styles.email, { color: colors.text.secondary }]}>
                {user?.email || 'No email set'}
              </Text>
            </View>
          )}
        </View>

        {/* Settings Sections */}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Data
          </Text>
          <Pressable
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() =>
              Alert.alert(
                'Not Implemented',
                'Backup functionality coming soon!'
              )
            }
          >
            <Ionicons
              name="cloud-upload-outline"
              size={22}
              color={colors.text.secondary}
            />
            <Text style={[styles.settingLabel, { flex: 1, marginLeft: 16 }]}>
              Backup Data
            </Text>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={colors.text.secondary}
            />
          </Pressable>
          <Pressable
            style={[styles.settingItem, { borderBottomWidth: 0 }]}
            onPress={() =>
              Alert.alert(
                'Not Implemented',
                'Restore functionality coming soon!'
              )
            }
          >
            <Ionicons
              name="cloud-download-outline"
              size={22}
              color={colors.text.secondary}
            />
            <Text style={[styles.settingLabel, { flex: 1, marginLeft: 16 }]}>
              Restore Data
            </Text>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={colors.text.secondary}
            />
          </Pressable>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <Pressable
            style={[styles.settingItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color={colors.danger || '#FF3B30'}
            />
            <Text style={[styles.settingLabel, { flex: 1, marginLeft: 16, color: colors.danger || '#FF3B30' }]}>
              Logout
            </Text>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={colors.danger || '#FF3B30'}
            />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  editForm: {
    width: '100%',
    gap: 12,
  },
  input: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLabel: {
    fontSize: 16,
  },
  headerButton: {
    paddingHorizontal: 16,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
