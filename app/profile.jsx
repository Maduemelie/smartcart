import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color={Colors.text.inverse} />
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.location}>Agege, Lagos</Text>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Pressable style={styles.settingItem}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.text.primary}
            />
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={Colors.text.secondary}
            />
          </Pressable>
          <Pressable style={styles.settingItem}>
            <Ionicons
              name="location-outline"
              size={24}
              color={Colors.text.primary}
            />
            <Text style={styles.settingText}>Location</Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={Colors.text.secondary}
            />
          </Pressable>
          <Pressable style={styles.settingItem}>
            <Ionicons
              name="language-outline"
              size={24}
              color={Colors.text.primary}
            />
            <Text style={styles.settingText}>Language</Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={Colors.text.secondary}
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
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  location: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    marginBottom: 1,
  },
  settingText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: Colors.text.primary,
  },
});
