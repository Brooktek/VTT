// geminie/components/timeslot/TaskModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddCategoryModal from '../../modals/AddCategoryModal';
import { getAllCategories, addCustomCategory, getCategoryDisplayColor } from '@/utils/categoryManager';
import { useTheme } from '@/contexts/ThemeContext';

const TaskModal = ({
  visible,
  onClose,
  onSubmit,
  editingTask,
  selectedTimeSlots = [],
  // colors prop is implicitly available via useTheme if needed directly, but passed from parent for consistency
  // getCategoryColor, // This is now handled internally by getCategoryDisplayColor
  toggleTimeSlotSelection
}) => {
  const { colors, isDarkMode } = useTheme(); // Use theme directly for consistency
  const [taskText, setTaskText] = useState('');
  const [taskCategoryName, setTaskCategoryName] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);

  const fetchAndUpdateCategories = useCallback(async (newlyAddedCategoryName = null) => {
    const allCats = await getAllCategories();
    setAvailableCategories(allCats);
    if (newlyAddedCategoryName) {
        setTaskCategoryName(newlyAddedCategoryName);
    } else if (editingTask && editingTask.category && allCats.some(c => c.name === editingTask.category)) {
      setTaskCategoryName(editingTask.category);
    } else if (allCats.length > 0 && !taskCategoryName) { // Only set if taskCategoryName is currently empty
      setTaskCategoryName(allCats[0].name);
    } else if (allCats.length > 0 && !allCats.some(c => c.name === taskCategoryName)) {
        // If current taskCategoryName is no longer valid (e.g. deleted), reset to first available
        setTaskCategoryName(allCats[0].name);
    }

  }, [editingTask, taskCategoryName]); // taskCategoryName added to deps

  useEffect(() => {
    if (visible) {
      fetchAndUpdateCategories();
      if (editingTask) {
        setTaskText(editingTask.task || '');
        // Category will be set by fetchAndUpdateCategories
      } else {
        setTaskText('');
        // Default category will be set by fetchAndUpdateCategories if needed
      }
    }
  }, [visible, editingTask, fetchAndUpdateCategories]);


  const handleSaveTaskInternal = () => {
    if (!taskText.trim()) {
      Alert.alert("Task Required", "Please enter a task description.");
      return;
    }
    if (!taskCategoryName && availableCategories.length > 0) { // Ensure a category is selected if categories exist
        Alert.alert("Category Required", "Please select or add a category for the task.");
        return;
    } else if (availableCategories.length === 0 && !taskCategoryName){ // No categories exist at all
         Alert.alert("No Categories", "Please add a category first before saving a task.");
        return;
    }
    if (selectedTimeSlots.length === 0 && !editingTask) {
        Alert.alert("No Time Slots", "Please select time slots for the new task.");
        return;
    }
    onSubmit({ text: taskText, category: taskCategoryName });
  };

  const handleSaveNewCategory = async (name, color) => {
    const newCategory = await addCustomCategory(name, color);
    if (newCategory) {
      await fetchAndUpdateCategories(newCategory.name); // Refresh and select the new category
      setIsAddCategoryModalVisible(false);
    }
  };

  const styles = getModalStyles(colors);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
        >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
          <TouchableOpacity activeOpacity={1} style={[styles.modalContent, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingTask ? "Edit Task" : "Add New Task"}
              </Text>

              <View style={styles.modalForm}>
                <Text style={[styles.modalLabel, { color: colors.text }]}>Task Description:</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  placeholder="Enter task description"
                  placeholderTextColor={colors.textSecondary}
                  value={taskText}
                  onChangeText={setTaskText}
                />

                <Text style={[styles.modalLabel, { color: colors.text }]}>Category:</Text>
                <View style={styles.categorySelectionContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryButtonsScrollContainer}>
                    {availableCategories.map(catObj => (
                        <TouchableOpacity
                        key={catObj.id}
                        style={[
                            styles.categoryButton,
                            { backgroundColor: getCategoryDisplayColor(catObj, availableCategories, colors, isDarkMode) + (taskCategoryName === catObj.name ? 'FF' : 'B3') }, // Slightly less opacity for non-active
                            taskCategoryName === catObj.name && styles.activeCategoryButton,
                            taskCategoryName === catObj.name && { borderColor: colors.selected || colors.primary, borderWidth: 2.5 }
                        ]}
                        onPress={() => setTaskCategoryName(catObj.name)}
                        >
                        <Text style={styles.categoryButtonText}>{catObj.name}</Text>
                        </TouchableOpacity>
                    ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={[styles.addCategoryIconButton, {backgroundColor: colors.primary + '2A', borderColor: colors.primary}]}
                        onPress={() => setIsAddCategoryModalVisible(true)}
                    >
                        <Ionicons name="add" size={22} color={colors.primary} />
                    </TouchableOpacity>
                </View>


                {selectedTimeSlots.length > 0 && (
                  <>
                    <Text style={[styles.modalLabel, { color: colors.text, marginTop: 15 }]}>Selected Time Slots:</Text>
                    <View style={styles.selectedSlotsList}>
                      {selectedTimeSlots.map((slot) => (
                        <View key={slot.id} style={[styles.selectedSlotChip, { backgroundColor: colors.surface }]}>
                          <Text style={[styles.selectedSlotText, { color: colors.text }]}>{slot.displayText}</Text>
                          <TouchableOpacity style={styles.removeSlotButton} onPress={() => toggleTimeSlotSelection(slot)}>
                            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.surface }]}
                  onPress={onClose}
                >
                  <Text style={[styles.modalButtonTextAction, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.primary || colors.accent }]}
                  onPress={handleSaveTaskInternal}
                >
                  <Text style={[styles.modalButtonTextAction, {color: colors.onPrimary || '#FFFFFF'}]}>
                    {editingTask ? "Save Changes" : "Add Task"}
                  </Text>
                </TouchableOpacity>
              </View>
          </TouchableOpacity>
        </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      <AddCategoryModal
        visible={isAddCategoryModalVisible}
        onClose={() => setIsAddCategoryModalVisible(false)}
        onSaveCategory={handleSaveNewCategory}
        colors={colors} // Pass down theme colors
      />
    </>
  );
};

const getModalStyles = (colors) => StyleSheet.create({
    keyboardAvoidingView: { // Added for KAV
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalForm: {
        marginBottom: 20,
    },
    modalLabel: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    modalInput: {
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 15,
        borderWidth: 1,
    },
    categorySelectionContainer: { // New container for scrollview + add button
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    categoryButtonsScrollContainer: { // For the ScrollView part
        flexGrow: 1, // Allows scrollview to take up space but not push button out
        paddingRight: 10, // Space before the add button
    },
    categoryButton: {
        paddingVertical: 8, // Adjusted padding
        paddingHorizontal: 14,
        borderRadius: 18, // Slightly less round
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 38, // Ensure consistent height
        borderWidth: 1.5, // Default border
        borderColor: 'transparent', // Default border color
    },
    activeCategoryButton: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    categoryButtonText: {
        color: '#fff', // Handled by getCategoryDisplayColor for text on custom bg
        fontWeight: '600',
        fontSize: 13,
    },
    addCategoryIconButton: { // Style for the "+" button next to categories
        padding:8,
        borderRadius: 20, // Make it circular
        borderWidth: 1.5,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedSlotsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    selectedSlotChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedSlotText: {
        fontSize: 13,
        marginRight: 6,
    },
    removeSlotButton: {
        marginLeft: 4,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    modalButtonTextAction: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default TaskModal;