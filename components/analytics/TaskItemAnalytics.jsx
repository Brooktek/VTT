// components/analytics/TaskItemAnalytics.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TaskItemAnalytics = ({ task, getCategoryColor, colors, onPress }) => {
  // Function to generate styles based on current theme colors
  const getItemStyles = (colors) => StyleSheet.create({
    taskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface, // Use surface color from theme for the item background
      borderRadius: 12, // Rounded corners for the item
      padding: 12, 
    },
    categoryIndicator: {
      width: 5, // Thickness of the category color indicator
      height: '70%', // Height of the indicator relative to the item
      borderRadius: 2.5, // Rounded corners for the indicator
      marginRight: 12, // Space between indicator and content
    },
    taskContent: {
      flex: 1, // Allow content to take up available horizontal space
    },
    taskText: {
      color: colors.text, // Use text color from theme
      fontSize: 15,
      fontWeight: '500', // Medium weight for the task description
      marginBottom: 6, // Space below the task description
    },
    taskDetailsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap', // Allow details to wrap to the next line if they don't fit
      alignItems: 'center',
    },
    taskDetailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 12, // Space between detail items (e.g., date and time)
      marginBottom: 3, // Space below detail items if they wrap
    },
    taskDetailIcon: {
      color: colors.textSecondary, // Use secondary text color for icons in details
      marginRight: 5, // Space between icon and detail text
    },
    taskDetailText: {
      color: colors.textSecondary, // Use secondary text color for detail text
      fontSize: 12,
    },
    categoryBadge: {
      paddingVertical: 5, // Vertical padding for the category badge
      paddingHorizontal: 10, // Horizontal padding for the category badge
      borderRadius: 16, // More rounded corners for the badge
      marginLeft: 10, // Space between task content and category badge
      minWidth: 60, // Minimum width for the badge to ensure text fits
      alignItems: 'center', // Center text within the badge
    },
    categoryText: {
      color: colors.onAccent || '#fff', // Use onAccent color for text on a colored accent background, fallback to white
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase', // Display category text in uppercase
    },
  });

  const styles = getItemStyles(colors); // Generate styles with current colors
  const categoryColor = getCategoryColor(task.category); // Get the specific color for the task's category

  // Format the date for display
  const formattedDate = new Date(task.date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} style={styles.taskItem}>
      {/* Category color indicator bar */}
      <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />

      {/* Main content of the task item */}
      <View style={styles.taskContent}>
        <Text style={styles.taskText} numberOfLines={1}>
          {task.task} {/* Task description */}
        </Text>
        {/* Row for task details like date and time slots */}
        <View style={styles.taskDetailsRow}>
          {/* Date detail */}
          <View style={styles.taskDetailItem}>
            <Ionicons name="calendar-outline" size={13} style={styles.taskDetailIcon} />
            <Text style={styles.taskDetailText}>{formattedDate}</Text>
          </View>
          {/* Time slots detail */}
          <View style={styles.taskDetailItem}>
            <Ionicons name="time-outline" size={13} style={styles.taskDetailIcon} />
            <Text style={styles.taskDetailText} numberOfLines={1}>
              {/* Display time slots, join if multiple, or show N/A */}
              {task.timeSlots && task.timeSlots.length > 0 ? task.timeSlots.join(', ') : 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Category badge on the right */}
      <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
        <Text style={styles.categoryText}>{task.category}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TaskItemAnalytics;
