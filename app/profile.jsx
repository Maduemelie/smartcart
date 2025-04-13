import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Switch,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Colors } from '../constants/Colors';
import { useSettings } from '../context/settings/SettingsContext';
import {
  updateNotifications,
  updateLocationSettings,
  updateLanguage,
  updateUserProfile,
} from '../context/actions';
import { createBackup, restoreBackup } from '../utils/backup';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'ha', name: 'Hausa' },
  { code: 'ig', name: 'Igbo' },
];

export default function Profile() {
  const { state, dispatch } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [editedProfile, setEditedProfile] = useState(state.userProfile);

  const handleSettingToggle = (category, setting) => {
    if (category === 'notifications') {
      dispatch(
        updateNotifications({
          [setting]: !state.notifications[setting],
        })
      );
    } else if (category === 'location') {
      dispatch(
        updateLocationSettings({
          [setting]: !state.location[setting],
        })
      );
    }
  };

  const handleSaveProfile = () => {
    dispatch(updateUserProfile(editedProfile));
    setIsEditing(false);
  };

  const handleLanguageSelect = (langCode) => {
    dispatch(updateLanguage(langCode));
    setShowLanguagePicker(false);
  };

  const handleCreateBackup = async () => {
    const success = await createBackup();
    if (success) {
      Alert.alert('Success', 'Backup created successfully');
    } else {
      Alert.alert('Error', 'Failed to create backup');
    }
  };

  const handleRestoreBackup = async () => {
    try {
      Alert.alert(
        'Restore Backup',
        'This feature will allow you to select a backup file to restore your data.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to restore backup');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerRight: () => (
            <Pressable
              onPress={() =>
                isEditing ? handleSaveProfile() : setIsEditing(true)
              }
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Save' : 'Edit'}
              </Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color={Colors.text.inverse} />
            </View>
            {isEditing && (
              <Pressable style={styles.changeAvatarButton}>
                <Text style={styles.changeAvatarText}>Change Photo</Text>
              </Pressable>
            )}
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <TextInput
                style={styles.input}
                value={editedProfile.name}
                onChangeText={(text) =>
                  setEditedProfile((prev) => ({ ...prev, name: text }))
                }
                placeholder="Full Name"
              />
              <TextInput
                style={styles.input}
                value={editedProfile.email}
                onChangeText={(text) =>
                  setEditedProfile((prev) => ({ ...prev, email: text }))
                }
                placeholder="Email"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                value={editedProfile.location}
                onChangeText={(text) =>
                  setEditedProfile((prev) => ({ ...prev, location: text }))
                }
                placeholder="Location"
              />
            </View>
          ) : (
            <>
              <Text style={styles.name}>{state.userProfile.name}</Text>
              <Text style={styles.email}>{state.userProfile.email}</Text>
              <Text style={styles.location}>{state.userProfile.location}</Text>
            </>
          )}
        </View>

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Price Alerts</Text>
            <Switch
              value={state.notifications.priceAlerts}
              onValueChange={() =>
                handleSettingToggle('notifications', 'priceAlerts')
              }
              trackColor={{ false: Colors.surface, true: Colors.primary }}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Deal Notifications</Text>
            <Switch
              value={state.notifications.dealNotifications}
              onValueChange={() =>
                handleSettingToggle('notifications', 'dealNotifications')
              }
              trackColor={{ false: Colors.surface, true: Colors.primary }}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Shopping Reminders</Text>
            <Switch
              value={state.notifications.shoppingReminders}
              onValueChange={() =>
                handleSettingToggle('notifications', 'shoppingReminders')
              }
              trackColor={{ false: Colors.surface, true: Colors.primary }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Settings</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Use Current Location</Text>
            <Switch
              value={state.location.useCurrentLocation}
              onValueChange={() =>
                handleSettingToggle('location', 'useCurrentLocation')
              }
              trackColor={{ false: Colors.surface, true: Colors.primary }}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Save Searched Locations</Text>
            <Switch
              value={state.location.saveSearchedLocations}
              onValueChange={() =>
                handleSettingToggle('location', 'saveSearchedLocations')
              }
              trackColor={{ false: Colors.surface, true: Colors.primary }}
            />
          </View>
        </View>

        <Pressable
          style={styles.section}
          onPress={() => setShowLanguagePicker(true)}
        >
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Selected Language</Text>
            <Text style={styles.settingValue}>
              {LANGUAGES.find((lang) => lang.code === state.language)?.name}
            </Text>
          </View>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backup & Restore</Text>
          <View style={styles.backupContainer}>
            <Pressable style={styles.backupButton} onPress={handleCreateBackup}>
              <Ionicons
                name="cloud-upload-outline"
                size={24}
                color={Colors.text.inverse}
              />
              <Text style={styles.backupButtonText}>Create Backup</Text>
            </Pressable>
            <Pressable
              style={[styles.backupButton, styles.restoreButton]}
              onPress={handleRestoreBackup}
            >
              <Ionicons
                name="cloud-download-outline"
                size={24}
                color={Colors.text.inverse}
              />
              <Text style={styles.backupButtonText}>Restore Backup</Text>
            </Pressable>
          </View>
        </View>

        {/* Language Picker Modal */}
        <Modal
          visible={showLanguagePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowLanguagePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Language</Text>
              {LANGUAGES.map((lang) => (
                <Pressable
                  key={lang.code}
                  style={styles.languageOption}
                  onPress={() => handleLanguageSelect(lang.code)}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      state.language === lang.code &&
                        styles.selectedLanguageText,
                    ]}
                  >
                    {lang.name}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowLanguagePicker(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.surface,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  changeAvatarButton: {
    padding: 8,
  },
  changeAvatarText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  editForm: {
    width: '100%',
    gap: 12,
  },
  input: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    width: '100%',
    fontSize: 16,
    color: Colors.text.primary,
  },
  section: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.surface,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.accent + '20',
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  settingValue: {
    fontSize: 16,
    color: Colors.primary,
  },
  editButton: {
    paddingHorizontal: 16,
  },
  editButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  languageOption: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.accent + '20',
  },
  languageOptionText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  selectedLanguageText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  backupContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  backupButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  restoreButton: {
    backgroundColor: Colors.secondary,
  },
  backupButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
