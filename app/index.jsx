import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import QuickAccess from '../components/QuickAccess';
// import BottomTabs from '../components/BottomTabs';
import { Colors } from '../constants/Colors';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.content}>
        <Header />
        <SearchBar />
        <ScrollView showsVerticalScrollIndicator={false}>
          <QuickAccess />
        </ScrollView>
        <Text style={styles.title}>Welcome to SmartCart</Text>
      </View>
      {/* <BottomTabs /> */}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
});
