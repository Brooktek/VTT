// components/analytics/ActivityCalendarView.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ActivityCalendarView = ({
  tasks = [], // All tasks for the current year/period to check activity
  selectedMonth, // number (0-11)
  selectedYear,  // number
  monthNames,
  colors,
  dateFilterRange, // 'day', 'week', etc. to highlight appropriately
  selectedDayForHighlight // number (1-31) if dateFilterRange is 'day'
}) => {
  const styles = getActivityStyles(colors);

  // Get days in the selected month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 for Sunday, 1 for Monday...
  // Adjust firstDayOfMonth to be 0 for Monday, 6 for Sunday to match typical calendar layout
  const dayOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
  const emptyStartCells = Array.from({ length: dayOffset }, (_, i) => `empty-start-${i}`);


  // Create a set of active days for quick lookup for the currently displayed month
  const activeDaysInMonth = new Set();
  tasks.forEach((task) => {
    const taskDate = new Date(task.date);
    if (taskDate.getFullYear() === selectedYear && taskDate.getMonth() === selectedMonth) {
      activeDaysInMonth.add(taskDate.getDate());
    }
  });

  return (
    <View style={styles.activityCalendarCard}>
        <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>Monthly Activity</Text>
            <Text style={styles.calendarMonthYear}>
                {monthNames[selectedMonth]} {selectedYear}
            </Text>
        </View>
        <View style={styles.weekDaysContainer}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
        </View>
      <View style={styles.calendarGrid}>
        {emptyStartCells.map(key => <View key={key} style={styles.calendarDayContainer} />)}
        {monthDays.map((day) => {
          const isActive = activeDaysInMonth.has(day);
          const isSelected = dateFilterRange === 'day' && day === selectedDayForHighlight;
          return (
            <View key={day} style={styles.calendarDayContainer}>
              <View
                style={[
                  styles.calendarDay,
                  isActive ? styles.activeDay : styles.emptyDay,
                  isSelected && styles.selectedDayHighlight,
                  isSelected && { borderColor: colors.primary, borderWidth: 2 },
                ]}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    isActive ? styles.activeDayText : styles.emptyDayText,
                    isSelected && { fontWeight: 'bold', color: colors.primary }
                  ]}
                >
                  {day}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.calendarLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotActive]} />
          <Text style={styles.legendText}>Active Day</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotEmpty]} />
          <Text style={styles.legendText}>No Activity</Text>
        </View>
      </View>
    </View>
  );
};

const getActivityStyles = (colors) => StyleSheet.create({
  activityCalendarCard: {
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
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  calendarMonthYear: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDayText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    width: `${100/10}%`, // Equal width for each day
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDayContainer: { // New container for consistent sizing
    width: `${100/10}%`, // Approx 14.28%
    aspectRatio: 1, // Make cells square-ish
    padding: 2, // Small padding for spacing between cells
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDay: {
    width: '90%', // Inner cell takes most of the container
    height: '90%',
    borderRadius: 8, // Rounded corners for cells
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDay: {
    backgroundColor: colors.surface,
  },
  activeDay: {
    backgroundColor: colors.primary + '40', // Primary with opacity
  },
  selectedDayHighlight: {
    // Border applied dynamically
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyDayText: {
    color: colors.textSecondary,
  },
  activeDayText: {
    color: colors.primary, // Darker for visibility on lighter active background
    fontWeight: 'bold',
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendDotActive: {
    backgroundColor: colors.primary + '40',
  },
  legendDotEmpty: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border, // Add border to empty dot for visibility
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default ActivityCalendarView;