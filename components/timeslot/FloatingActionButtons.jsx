import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FloatingActionButtons = ({ onAdd, onEdit, onDelete, colors }) => {
  const styles = getFabStyles(colors);
  return (
    <View style={styles.fabContainer}>
      <TouchableOpacity
        style={[styles.fab, styles.fabDelete, { backgroundColor: colors.error }]}
        onPress={onDelete}
      >
        <Ionicons name="trash" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.fab, styles.fabEdit, { backgroundColor: colors.info }]}
        onPress={onEdit}
      >
        <Ionicons name="pencil" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.fab, styles.fabAdd, { backgroundColor: colors.success }]}
        onPress={onAdd}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const getFabStyles = (colors) => StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 25, // Adjusted for better spacing from screen edge
    right: 25,
    flexDirection: 'row',
    alignItems: 'center', // Align if they have different dynamic heights
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28, // Perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6, // Slightly more shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginLeft: 12, // Spacing between FABs
  },
  fabAdd: {
    // backgroundColor set by props
  },
  fabEdit: {
    // backgroundColor set by props
  },
  fabDelete: {
    // backgroundColor set by props
  },
});

export default FloatingActionButtons;