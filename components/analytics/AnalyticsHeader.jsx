// components/analytics/AnalyticsHeader.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AnalyticsHeader = ({ onBack, title, showAnalytics, onToggleAnalytics, colors }) => {
  const styles = getHeaderStyles(colors);
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={onToggleAnalytics} style={styles.toggleButton}>
          <Ionicons name={showAnalytics ? "eye-off-outline" : "eye-outline"} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getHeaderStyles = (colors) => StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12, // Adjusted padding
    paddingTop: 16, // More space at the top
    backgroundColor: colors.surfaceVariant, // Or colors.background if preferred
    borderBottomLeftRadius: 16, // Softer radius
    borderBottomRightRadius: 16,
    // Use platform-specific shadow or elevation if desired
    // For iOS:
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // For Android:
    elevation: 3,
    zIndex: 10, // Ensure header is above content if overlapping
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8, // Make touch target larger
    marginRight: 8, // Space from title
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  toggleButton: {
    padding: 8, // Make touch target larger
    marginLeft: 8, // Space from title/edge
  },
});

export default AnalyticsHeader;