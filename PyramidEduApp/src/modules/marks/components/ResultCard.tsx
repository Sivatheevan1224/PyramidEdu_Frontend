import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award, Calendar, CheckCircle, Clock } from 'lucide-react-native';
import { Exam } from '../types/marks.types';
import { useAppTheme } from '../../../hooks/useAppTheme';

interface ResultCardProps {
  item: Exam;
}

export const ResultCard: React.FC<ResultCardProps> = ({ item }) => {
  const { colors } = useAppTheme();
  const submission = item.submissions?.[0];
  const score = submission?.totalScore;
  const isPending = submission?.status === 'PENDING_MANUAL';

  return (
    <View style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primarySurface }]}>
          <Award size={20} color={colors.primary} />
        </View>
        <View style={styles.examInfo}>
          <Text style={[styles.examTitle, { color: colors.textPrimary }]} numberOfLines={2}>
            {item.examTitle}
          </Text>
          <View style={styles.dateRow}>
            <Calendar size={14} color={colors.textSecondary} />
            <Text style={[styles.examDate, { color: colors.textSecondary }]}>
              {new Date(item.examDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Score Section */}
      <View style={[styles.scoreContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Obtained Marks</Text>
        {isPending ? (
          <View style={styles.statusRow}>
            <Clock size={16} color="#F59E0B" />
            <Text style={[styles.pendingText, { color: '#F59E0B' }]}>Pending Grading</Text>
          </View>
        ) : (
          <View style={styles.statusRow}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={[styles.scoreValue, { color: colors.primary }]}>
              {score !== null ? score : 0}{' '}
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>/ {item.totalMarks}</Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  examInfo: {
    flex: 1,
    gap: 4,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  examDate: {
    fontSize: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pendingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
  },
});
