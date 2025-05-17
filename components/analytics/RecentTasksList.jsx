// components/analytics/RecentTasksList.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import TaskItemAnalytics from './TaskItemAnalytics'; // We'll create this next

const RecentTasksList = ({ tasks = [], getCategoryColor, colors, onTaskPress }) => { // Default tasks to []
  const [showAllTasks, setShowAllTasks] = useState(false);
  const styles = getListStyles(colors);

  if (tasks.length === 0) {
    return (
      <View style={styles.taskListCard}>
        <Text style={styles.noTasksText}>No tasks match the current filters.</Text>
      </View>
    );
  }

  const displayedTasks = showAllTasks ? tasks : tasks.slice(0, 4);

  return (
    <View style={styles.taskListCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Tasks Overview</Text>
        {tasks.length > 4 && (
          <TouchableOpacity onPress={() => setShowAllTasks(!showAllTasks)}>
            <Text style={styles.viewAllButton}>
              {showAllTasks ? 'Show Less' : `View All (${tasks.length})`}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayedTasks}
        renderItem={({ item }) => (
          <TaskItemAnalytics
            task={item}
            getCategoryColor={getCategoryColor}
            colors={colors}
            onPress={onTaskPress ? () => onTaskPress(item) : undefined}
          />
        )}
        keyExtractor={(item) => item.id.toString()} // Ensure key is a string
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false} // If it's a short list within a ScrollView
      />
    </View>
  );
};

const getListStyles = (colors) => StyleSheet.create({
  taskListCard: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: colors.shadowOpacity || 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17, // Slightly larger
    fontWeight: 'bold',
    color: colors.text,
  },
  viewAllButton: {
    color: colors.primary, // Use primary color for actions
    fontSize: 13,
    fontWeight: '600',
  },
  separator: {
    height: 10, // Space between items
  },
  noTasksText: {
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  }
});

export default RecentTasksList;