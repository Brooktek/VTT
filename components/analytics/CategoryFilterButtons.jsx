// components/analytics/CategoryFilterButtons.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const CategoryFilterButtons = ({
  categories,
  selectedCategory,
  onCategoryChange,
  getCategoryColor, // Function to get color for a category
  colors,
}) => {
  const styles = getCategoryStyles(colors);

  return (
    <View style={styles.categoryFilterContainer}>
      <Text style={styles.filterLabel}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryButtonsScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              {
                backgroundColor: selectedCategory === category ? getCategoryColor(category) + '30' : colors.surface, // Light background for selected
                borderColor: selectedCategory === category ? getCategoryColor(category) : colors.border,
              }
            ]}
            onPress={() => onCategoryChange(category)}
          >
            {category !== 'All' && (
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: getCategoryColor(category) },
                ]}
              />
            )}
            <Text
              style={[
                styles.categoryButtonText,
                { color: selectedCategory === category ? getCategoryColor(category) : colors.textSecondary },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const getCategoryStyles = (colors) => StyleSheet.create({
  categoryFilterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  categoryButtonsScroll: {
    paddingBottom: 5, // For shadow or if items slightly overflow
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14, // More horizontal padding
    borderRadius: 20, // Pill shape
    marginRight: 10, // Space between buttons
    borderWidth: 1.5, // Slightly thicker border for selection
  },
  categoryDot: {
    width: 9, // Slightly larger dot
    height: 9,
    borderRadius: 4.5,
    marginRight: 8, // More space from text
  },
  categoryButtonText: {
    fontWeight: '600',
    fontSize: 13,
  },
});

export default CategoryFilterButtons;