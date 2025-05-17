// geminie/components/analytics/AnalyticsSummaryCards.jsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure Ionicons is available
import { useTheme } from '@/contexts/ThemeContext'; // Assuming this is your theme context

const AnalyticsSummaryCards = ({ tasks = [], isLoading = false }) => {
  const { colors } = useTheme();
  const styles = getSummaryCardStyles(colors);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading summary...</Text>
      </View>
    );
  }

  const totalHours = tasks.reduce((total, task) => total + (task.totalTime || 0), 0).toFixed(1);
  const activeDaysCount = Array.from(new Set(tasks.map((task) => task.date))).length;

  return (
    <View style={styles.summaryContainer}>
      <View style={[styles.summaryCard, styles.tasksCard, { backgroundColor: colors.surface }]}>
        <View style={[styles.summaryIconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name="list-outline" size={22} color={colors.primary} style={styles.summaryIcon} />
        </View>
        <Text style={[styles.summaryValue, { color: colors.text }]}>{tasks.length}</Text>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Tasks</Text>
      </View>

      <View style={[styles.summaryCard, styles.hoursCard, { backgroundColor: colors.surface }]}>
        <View style={[styles.summaryIconContainer, { backgroundColor: colors.success + '20' }]}>
          <Ionicons name="time-outline" size={22} color={colors.success} style={styles.summaryIcon} />
        </View>
        <Text style={[styles.summaryValue, { color: colors.text }]}>{totalHours}h</Text>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Hours Planned</Text>
      </View>

      <View style={[styles.summaryCard, styles.daysCard, { backgroundColor: colors.surface }]}>
        <View style={[styles.summaryIconContainer, { backgroundColor: colors.info + '20' }]}>
          <Ionicons name="calendar-outline" size={22} color={colors.info} style={styles.summaryIcon} />
        </View>
        <Text style={[styles.summaryValue, { color: colors.text }]}>{activeDaysCount}</Text>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Active Days</Text>
      </View>
    </View>
  );
};

const getSummaryCardStyles = (colors) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    minHeight: 120, // Give some space for the loader
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20, // Or based on your parent's layout needs
    paddingHorizontal: 5, // Slight horizontal padding if cards are close to edge
  },
  summaryCard: {
    flex: 1, // Each card takes equal space
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 7, // Spacing between cards
    shadowColor: colors.shadow || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 120, // Ensure cards have a decent height
    justifyContent: 'space-between', // Distribute content vertically
  },
  tasksCard: {
    // Specific styles if needed, e.g., borderLeftColor: colors.primary
  },
  hoursCard: {
    // e.g., borderLeftColor: colors.success
  },
  daysCard: {
    // e.g., borderLeftColor: colors.info
  },
  summaryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryIcon: {
    // The color is set directly in the JSX for more control
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AnalyticsSummaryCards;