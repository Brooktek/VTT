// geminie/components/modals/AddCategoryModal.jsx
import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you use Expo icons

// Simple list of predefined colors for the user to pick from
const PREDEFINED_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA', '#FE4A49',
  '#F0B67F', '#547980', '#8A9B0F', '#CE1483', '#F4845F', '#E76F51',
  '#4A4A48', '#00A591', '#D90368', '#04A777', '#2E294E', '#F4A261',
  '#9B59B6', '#3498DB', '#1ABC9C', '#F1C40F', '#E67E22', '#E74C3C',
];

const AddCategoryModal = ({ visible, onClose, onSaveCategory, colors }) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);

  const handleSave = () => {
    if (!categoryName.trim()) {
      Alert.alert("Name Required", "Please enter a category name.");
      return;
    }
    if (!selectedColor) {
        Alert.alert("Color Required", "Please select a color for the category.");
        return;
    }
    onSaveCategory(categoryName, selectedColor); // Callback to parent
    // Parent will handle closing and state updates
  };

  const resetForm = () => {
    setCategoryName('');
    setSelectedColor(PREDEFINED_COLORS[0]);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const styles = getModalStyles(colors);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleClose}>
          <TouchableOpacity activeOpacity={1} style={[styles.modalContent, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Category</Text>

            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Category Name (e.g., Gym, Study)"
              placeholderTextColor={colors.textSecondary}
              value={categoryName}
              onChangeText={setCategoryName}
              autoFocus={true}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Choose a Color:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorPickerContainer}>
              {PREDEFINED_COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorOption,
                    selectedColor === color && { borderColor: colors.primary || colors.accent }
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.surface }]}
                onPress={handleClose}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary || colors.accent }]}
                onPress={handleSave}
              >
                <Text style={[styles.buttonText, { color: colors.onPrimary || '#FFFFFF' }]}>Save Category</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const getModalStyles = (colors) => StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 380,
    borderRadius: 12,
    padding: 25, // Increased padding
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22, // Slightly larger
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    borderRadius: 10, // Softer radius
    paddingHorizontal: 15,
    paddingVertical: 14, // More padding
    marginBottom: 25, // More space
    borderWidth: 1.5, // Slightly thicker border
    fontSize: 16,
  },
  label: {
    fontSize: 15,
    marginBottom: 12,
    fontWeight: '500',
    color: colors.text, // Make label more prominent
  },
  colorPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 30, // More space
  },
  colorOption: {
    width: 40, // Larger touch target
    height: 40,
    borderRadius: 20,
    marginHorizontal: 7, // Slightly more spacing
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorOption: {
    borderWidth: 3.5, // Thicker border for selected
    transform: [{scale: 1.1}], // Slight scale effect
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:15, // Space above buttons
  },
  button: {
    flex: 1,
    paddingVertical: 14, // Consistent padding
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 6, // Space between buttons
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddCategoryModal;