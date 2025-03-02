import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter, usePathname } from 'expo-router';
import { Colors } from '../constants/Colors';

const tabs = [
  { name: '/', icon: 'home', label: 'Home' },
  { name: '/compare', icon: 'git-compare', label: 'Compare' },
  { name: '/list', icon: 'list', label: 'List' },
  { name: '/profile', icon: 'person', label: 'Profile' },
];

export default function BottomTabs() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <BlurView intensity={90} style={styles.container}>
      {tabs.map((tab) => {
        // Update the isActive check to handle both forms of the path
        const isActive =
          pathname === tab.name || pathname === tab.name.replace('/', '');

        return (
          <Pressable
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.name)} // Use type assertion to bypass type checking
          >
            <Ionicons
              name={`${tab.icon}${isActive ? '' : '-outline'}`}
              size={24}
              color={isActive ? Colors.primary : Colors.text.secondary}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? Colors.primary : Colors.text.secondary },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.surface,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});
