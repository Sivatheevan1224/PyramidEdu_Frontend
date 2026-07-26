import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Award } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../auth';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { useMarks } from '../hooks/useMarks';
import { ResultCard } from '../components/ResultCard';
import { SearchBar } from '../components/SearchBar';
import { LOADING_TEXT } from '../constants/marks.constants';

export const ShowMarksScreen: React.FC = () => {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { colors } = useAppTheme();
  
  const { exams, loading, refreshing, refresh } = useMarks(accessToken);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter exams that have submissions (results)
  const examResults = exams.filter(
    (exam) => exam.submissions && exam.submissions.length > 0
  );

  // Sort by date (descending - latest first)
  const sortedResults = examResults.sort(
    (a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
  );

  // Filter by search query
  const filteredResults = sortedResults.filter((item) =>
    item.examTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Exam Results & Marks</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Results Content */}
      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{LOADING_TEXT}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, filteredResults.length === 0 && { flex: 1, justifyContent: 'center' }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {filteredResults.length === 0 ? (
            <View style={styles.center}>
              <Award size={48} color={colors.textSecondary} style={{ marginBottom: 16 }} />
              <Text style={[styles.emptyText, { color: colors.textPrimary }]}>
                {searchQuery ? 'No matching exam results found.' : 'No exam results available.'}
              </Text>
            </View>
          ) : (
            filteredResults.map((item) => (
              <ResultCard key={item.id} item={item} />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
