// components/analytics/ChartCard.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChartCard = ({ title, children, colors }) => {
  // Function to generate styles based on current theme colors
  const getChartCardStyles = (themeColors) => StyleSheet.create({
    chartCard: {
      backgroundColor: themeColors.surfaceVariant, // Use surfaceVariant color from theme for card background
      borderRadius: 16, // Rounded corners for the card
      padding: 16, // Uniform padding inside the card
      marginBottom: 20, // Space below the card
      shadowColor: themeColors.shadow, // Shadow color from theme
      shadowOffset: { width: 0, height: 2 }, // Shadow offset
      shadowOpacity: themeColors.shadowOpacity || 0.05, // Shadow opacity, fallback to a default
      shadowRadius: 4, // Shadow blur radius
      elevation: 2, // Elevation for Android shadow
    },
    cardHeader: {
      marginBottom: 12, // Space between the title and the chart content
    },
    chartTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: themeColors.text, // Use text color from theme for the title
    },
    chartContainer: {
      alignItems: 'center', // Center the chart if it doesn't fill the width
    }
  });

  const styles = getChartCardStyles(colors); // Generate styles with current theme colors

  return (
    <View style={styles.chartCard}>
      {/* Display the title if provided */}
      {title && (
        <View style={styles.cardHeader}>
          <Text style={styles.chartTitle}>{title}</Text>
        </View>
      )}
      {/* Container for the chart content (passed as children) */}
      <View style={styles.chartContainer}>
        {children}
      </View>
    </View>
  );
};

export default ChartCard;
