import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/Colors';

export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.text.secondary,
  },
});
