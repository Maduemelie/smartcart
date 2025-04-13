import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import QuickAccess from '../components/QuickAccess';
import { SearchBar } from '../components/SearchBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useDataFetching } from '../hooks/useDataFetching';
import { Colors } from '../constants/Colors';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useEffect, useRef } from 'react';

export default function Home() {
  const initialSyncComplete = useRef(false);

  const { loading: listsLoading } = useDataFetching(
    'recent_lists',
    async () => {
      // Fetch would happen here in a real app
      return [];
    }
  );

  useEffect(() => {
    if (!listsLoading && !initialSyncComplete.current) {
      initialSyncComplete.current = true;
    }
  }, [listsLoading]);

  if (listsLoading && !initialSyncComplete.current) {
    return <LoadingSpinner message="Setting up your shopping assistant..." />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: 'SmartCart',
            headerLargeTitle: true,
            headerSearchBarOptions: {
              placeholder: 'Search lists, items, or malls',
            },
          }}
        />

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <SearchBar />

          {/* Quick Access Section */}
          <View style={styles.section}>
            <Text style={styles.welcomeText}>Welcome to SmartCart</Text>
            <Text style={styles.subtitleText}>
              Your smart shopping assistant
            </Text>
          </View>

          <QuickAccess />
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
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
  contentContainer: {
    paddingBottom: 24,
  },
  section: {
    padding: 16,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
  },
});
