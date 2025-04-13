import { View, Text, StyleSheet, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import SyncManager from '../utils/sync';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    const unsubscribe = SyncManager.addConnectionListener((online) => {
      setIsOnline(online);
      setShowBanner(true);

      // Slide in
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      // After 3 seconds, slide out
      setTimeout(() => {
        Animated.spring(slideAnim, {
          toValue: -50,
          useNativeDriver: true,
        }).start(() => setShowBanner(false));
      }, 3000);
    });

    return () => unsubscribe();
  }, []);

  if (!showBanner) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
        isOnline ? styles.onlineContainer : styles.offlineContainer,
      ]}
    >
      <Ionicons
        name={isOnline ? 'wifi' : 'wifi-off'}
        size={16}
        color={Colors.text.inverse}
      />
      <Text style={styles.text}>
        {isOnline ? 'Back Online' : 'You are offline'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 8,
    zIndex: 1000,
  },
  onlineContainer: {
    backgroundColor: Colors.success,
  },
  offlineContainer: {
    backgroundColor: Colors.error.main,
  },
  text: {
    color: Colors.text.inverse,
    fontSize: 14,
    fontWeight: '600',
  },
});
