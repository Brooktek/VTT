// geminie/components/analytics/CategoryFilterButtons.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // If you want an icon for "All"

const CategoryFilterButtons = ({
  categories, // Expects array of category objects [{id, name, color?, isDefault?}, ...]
              // including an "All" object like {id: 'all-filter', name: "All"}
  selectedCategory, // This is a category NAME (string)
  onCategoryChange,
  getCategoryColor, // Function: (categoryObjectOrName) => colorString
  colors,
}) => {
  const styles = getCategoryStyles(colors);

  return (
    <View style={styles.categoryFilterContainer}>
      <Text style={styles.filterLabel}>Filter by Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryButtonsScroll}>
        {categories.map((categoryObj) => {
          const isActive = selectedCategory === categoryObj.name;
          const displayColor = getCategoryColor(categoryObj); // Pass the whole object

          return (
            <TouchableOpacity
              key={categoryObj.id}
              style={[
                styles.categoryButton,
                {
                  // Use a lighter version of the category color for active background, or primary
                  backgroundColor: isActive ? (displayColor + '40') : colors.surface,
                  borderColor: isActive ? displayColor : colors.border,
                }
              ]}
              onPress={() => onCategoryChange(categoryObj.name)}
            >
              {categoryObj.name !== 'All' && ( // Don't show dot for "All"
                <View
                  style={[
                    styles.categoryDot,
                    { backgroundColor: displayColor },
                  ]}
                />
              )}
              <Text
                style={[
                  styles.categoryButtonText,
                  { color: isActive ? displayColor : colors.textSecondary },
                ]}
              >
                {categoryObj.name} {/* CORRECT: Render category name */}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const getCategoryStyles = (colors) => StyleSheet.create({
  categoryFilterContainer: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  filterLabel: {
    color: colors.textSecondary,
    fontSize: 13, // Slightly larger
    marginBottom: 10, // More space
    fontWeight: '500',
    paddingLeft: 4, // Align with button padding
  },
  categoryButtonsScroll: {
    paddingBottom: 5,
    paddingLeft: 2, // Align with label padding
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9, // Adjusted padding
    paddingHorizontal: 16,
    borderRadius: 22, // More rounded
    marginRight: 10,
    borderWidth: 1.8, // Slightly thicker border
    minHeight: 40,
  },
  categoryDot: {
    width: 10, // Slightly larger dot
    height: 10,
    borderRadius: 5,
    marginRight: 9, // More space from text
  },
  categoryButtonText: {
    fontWeight: '600',
    fontSize: 14, // Slightly larger text
  },
});

export default CategoryFilterButtons;