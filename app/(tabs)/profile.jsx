import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useUser } from '../../context/UserContext';
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
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await updateUserProfile({
        displayName: name,
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
        {/* Profile Header with Cover */}
        <View style={[styles.profileHeader, { backgroundColor: colors.primary }]}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Ionicons 
                  name="person" 
                  size={48} 
                  color={colors.primary} 
                />
              </View>
            </View>
          </View>
          
          {isEditing ? (
            <View style={styles.editForm}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text.primary,
                    borderColor: colors.surface,
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
                    backgroundColor: colors.surface,
                    color: colors.text.primary,
                    borderColor: colors.surface,
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.text.secondary}
                editable={false}
              />
              <Text style={[styles.note, { color: colors.text.inverse }]}>
                Email cannot be changed
              </Text>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: colors.text.inverse }]}>
                {user?.displayName || 'Anonymous User'}
              </Text>
              <Text style={[styles.email, { color: colors.text.inverse + 'CC' }]}>
                {user?.email || 'No email set'}
              </Text>
            </View>
          )}
        </View>

        {/* Stats Section */}
        <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              12
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Lists
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              5
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Stores
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              42
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Items
            </Text>
          </View>
        </View>

        {/* Settings Sections */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Account Settings
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Pressable
              style={styles.settingItem}
              onPress={() => Alert.alert(
                'Not Implemented',
                'Backup functionality coming soon!'
              )}
            >
              <View style={styles.settingContent}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                    Backup Data
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                    Save your lists and preferences
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.secondary}
              />
            </Pressable>
            
            <Pressable
              style={styles.settingItem}
              onPress={() => Alert.alert(
                'Not Implemented',
                'Restore functionality coming soon!'
              )}
            >
              <View style={styles.settingContent}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons
                    name="cloud-download-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                    Restore Data
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                    Restore your data from backup
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.secondary}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Preferences
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Pressable
              style={styles.settingItem}
              onPress={() => router.push('/settings')}
            >
              <View style={styles.settingContent}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons
                    name="color-palette-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.settingLabel, { color: colors.text.primary }]}>
                    Appearance
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                    Customize theme and colors
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.secondary}
              />
            </Pressable>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.sectionContainer}>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Pressable
              style={styles.settingItem}
              onPress={handleLogout}
            >
              <View style={styles.settingContent}>
                <View style={[styles.iconContainer, { backgroundColor: '#FF3B3020' }]}>
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color="#FF3B30"
                  />
                </View>
                <Text style={[styles.settingLabel, { color: '#FF3B30' }]}>
                  Logout
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#FF3B30"
              />
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
  content: {
    flex: 1,
  },
  profileHeader: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 60,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: '500',
  },
  editForm: {
    width: '100%',
    gap: 16,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  note: {
    fontSize: 12,
    marginTop: -8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 16,
    paddingVertical: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  headerButton: {
    paddingHorizontal: 16,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});