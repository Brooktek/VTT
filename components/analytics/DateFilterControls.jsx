// components/analytics/DateFilterControls.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Ensure this is installed

const DateFilterControls = ({
  dateFilter,
  onDateFilterChange,
  monthNames,
  colors,
  isDarkMode, // To style picker items on Android
}) => {
  const styles = getDateFilterStyles(colors);
  const { day, month, year, range } = dateFilter;

  const handleRangeChange = (newRange) => {
    onDateFilterChange({ range: newRange });
  };

  const handleDayChange = (newDay) => {
    onDateFilterChange({ day: newDay });
  };

  const handleMonthChange = (newMonth) => {
    onDateFilterChange({ month: newMonth });
  };

  const handleYearChange = (newYear) => {
    onDateFilterChange({ year: newYear });
  };

  const currentActualYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentActualYear - 2 + i);


  return (
    <View style={styles.filterSection}>
      <View style={styles.dateRangeFilter}>
        {['day', 'week', 'month', 'year'].map((r) => (
          <TouchableOpacity
            key={r}
            style={[
              styles.dateFilterButton,
              range === r && styles.activeFilterButton,
            ]}
            onPress={() => handleRangeChange(r)}
          >
            <Text
              style={[
                styles.dateFilterText,
                range === r && styles.activeDateFilterText,
              ]}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.pickerRow}>
        {/* Day Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Day</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={day.toString()} // Ensure it's a string for Picker
              style={styles.picker}
              onValueChange={(itemValue) => handleDayChange(itemValue)}
              dropdownIconColor={colors.textSecondary}
              mode="dropdown" // Explicitly set mode for Android
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <Picker.Item
                  key={d}
                  label={d.toString()}
                  value={d.toString()}
                  color={isDarkMode ? colors.text : '#000000'} // For Android item text color
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Month Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Month</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={month} // month is already a number (index)
              style={styles.picker}
              onValueChange={(itemValue) => handleMonthChange(itemValue)}
              dropdownIconColor={colors.textSecondary}
              mode="dropdown"
            >
              {monthNames.map((m, index) => (
                <Picker.Item
                  key={index}
                  label={m}
                  value={index}
                  color={isDarkMode ? colors.text : '#000000'}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Year Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Year</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={year.toString()} // Ensure it's a string
              style={styles.picker}
              onValueChange={(itemValue) => handleYearChange(itemValue)}
              dropdownIconColor={colors.textSecondary}
              mode="dropdown"
            >
              {yearOptions.map((y) => (
                <Picker.Item
                  key={y}
                  label={y.toString()}
                  value={y.toString()}
                  color={isDarkMode ? colors.text : '#000000'}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    </View>
  );
};

const getDateFilterStyles = (colors) => StyleSheet.create({
  filterSection: {
    paddingVertical: 16, // Add vertical padding
    backgroundColor: colors.background,
  },
  dateRangeFilter: {
    flexDirection: 'row',
    marginBottom: 20, // Increased space
    backgroundColor: colors.surface,
    borderRadius: 20, // More rounded
    padding: 5, // Internal padding for the container
    overflow: 'hidden', // Ensure children adhere to border radius
  },
  dateFilterButton: {
    paddingVertical: 10, // Increased touch area
    paddingHorizontal: 12,
    borderRadius: 16, // Match parent's rounding
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterButton: {
    backgroundColor: colors.primary, // Use primary for active selection
  },
  dateFilterText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  activeDateFilterText: {
    color: colors.onPrimary || '#fff', // Text on primary background
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, // Reduced bottom margin if part of larger section
  },
  pickerContainer: {
    flex: 1, // Allow containers to share space

    marginHorizontal: 4,
    padding: 3, // Add small horizontal margin between pickers
  },
  pickerLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 6, // Slightly less margin
    fontWeight: '500',
    paddingLeft: 4,
  },
  pickerWrapper: {
  backgroundColor: '#e0e0e0', 
   borderRadius: 10,
    height: 45, // Slightly taller
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  picker: {
    color: colors.text,
    height: '100%', // Fill wrapper
    width: '100%',
  },
});

export default DateFilterControls;