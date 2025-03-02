import { StyleSheet, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';

export default function Header() {
  return (
    <BlurView intensity={90} style={styles.header}>
      <Image
        source={require('../assets/images/icon.png')}
        style={styles.logo}
      />
      <Ionicons name="person-circle-outline" size={32} color={Colors.primary} />
    </BlurView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
});
