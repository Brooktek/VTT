// geminie/components/timeslot/TimeSlotItem.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TimeSlotItem = ({ item, isSelected, onPress, colors, getCategoryColor }) => {
  // Determine background color based on task presence and category
  let backgroundColor = colors.surfaceVariant; // Default for empty slot
  if (item.hasTask) {
    backgroundColor = getCategoryColor(item.category); // Get color for the task's category
  }
  // Apply opacity if it has a task to differentiate from fully colored category tags elsewhere
  const finalBackgroundColor = item.hasTask ? `${backgroundColor}CC` : backgroundColor; // CC for ~80% opacity

  return (
    <TouchableOpacity
      style={[
        styles.timeSlot,
        { backgroundColor: finalBackgroundColor },
        isSelected && [styles.selectedTimeSlot, { borderColor: colors.selected }],
      ]}
      onPress={() => onPress(item)} // Pass the whole item for context
    >
      <Text style={[styles.timeSlotText, { color: colors.text }, isSelected && styles.selectedTimeSlotText]}>
        {item.displayText}
      </Text>
      {item.hasTask && item.taskText && ( // Ensure taskText exists
        <View style={styles.taskTextContainer}>
          <Text style={styles.taskTextInSlot} numberOfLines={1}>
            {item.taskText}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  timeSlot: {
    flex: 1, // Adjust based on numColumns to fill width
    height: 70, // Or make dynamic
    margin: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // For task text overlay
    padding: 5, // Reduced padding to give more space for text
    minWidth: '30%', // Ensure it takes up roughly 1/3 of the space with margins
    maxWidth: '31%', // Adjust based on your numColumns and screen width
  },
  selectedTimeSlot: {
    borderWidth: 3, // Keep this for clear selection indication
    // borderColor will be set via props using colors.selected
  },
  timeSlotText: {
    fontWeight: '500',
    fontSize: 12, // Adjust if needed
    textAlign: 'center',
  },
  selectedTimeSlotText: {
    fontWeight: 'bold',
    // color is set via props
  },
  taskTextContainer: {
    position: 'absolute',
    bottom: 3, // Adjust for better positioning
    left: 3,
    right: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker for better contrast
    paddingVertical: 2,
    paddingHorizontal: 3,
    borderRadius: 4,
  },
  taskTextInSlot: {
    color: '#fff', // White text usually good on dark overlay
    fontSize: 10, // Smaller for task hint
    textAlign: 'center',
  },
});

export default TimeSlotItem;