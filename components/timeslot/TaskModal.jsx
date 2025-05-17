// components/timeslot/TaskModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Default categories - could be passed as props if they vary
const DEFAULT_CATEGORIES = ["Work", "Personal", "Meeting", "School", "Team Time", "Friends"];

const TaskModal = ({
  visible,
  onClose,
  onSubmit,
  editingTask,
  selectedTimeSlots = [], // Ensure default is an array
  colors,
  getCategoryColor,
  toggleTimeSlotSelection // Function to remove a time slot chip
}) => {
  const [taskText, setTaskText] = useState('');
  const [taskCategory, setTaskCategory] = useState(DEFAULT_CATEGORIES[0]);

  useEffect(() => {
    if (editingTask) {
      setTaskText(editingTask.task || '');
      setTaskCategory(editingTask.category || DEFAULT_CATEGORIES[0]);
      // selectedTimeSlots are already managed by the parent and passed in
    } else {
      // Reset for new task
      setTaskText('');
      setTaskCategory(DEFAULT_CATEGORIES[0]);
    }
  }, [editingTask, visible]); // Re-run when editingTask changes or modal becomes visible

  const handleSave = () => {
    if (!taskText.trim()) {
      Alert.alert("Task Required", "Please enter a task description.");
      return;
    }
    if (selectedTimeSlots.length === 0 && !editingTask) { // Allow editing without changing slots initially
        Alert.alert("No Time Slots", "Please select time slots for the new task.");
        return;
    }
    onSubmit({ text: taskText, category: taskCategory });
  };

  const styles = getModalStyles(colors);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryButtonsContainer}>
                {DEFAULT_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      { backgroundColor: getCategoryColor(cat) }, // Use the passed getCategoryColor
                      taskCategory === cat && styles.activeCategoryButton,
                      taskCategory === cat && { borderColor: colors.selected, borderWidth: 2 }
                    ]}
                    onPress={() => setTaskCategory(cat)}
                  >
                    <Text style={styles.categoryButtonText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

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
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.surface }]}
                onPress={onClose}
              >
                <Text style={[styles.modalButtonTextAction, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.accent }]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonTextAction}>
                  {editingTask ? "Save Changes" : "Add Task"}
                </Text>
              </TouchableOpacity>
            </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const getModalStyles = (colors) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay
    },
    modalContent: {
        width: '90%',
        maxWidth: 400, // Max width for larger screens
        borderRadius: 12, // Softer corners
        padding: 20,
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
        paddingVertical: 10, // Consistent padding
        marginBottom: 15,
        borderWidth: 1, // Subtle border
    },
    categoryButtonsContainer: {
        flexDirection: 'row',
        paddingBottom: 5, // Space for scrollbar if it appears
    },
    categoryButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20, // Pill shape
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor is set dynamically
    },
    activeCategoryButton: {
        // borderColor and borderWidth set dynamically
        opacity: 1, // Ensure active is fully opaque if others have opacity
    },
    categoryButtonText: {
        color: '#fff', // Assuming category colors are dark enough for white text
        fontWeight: '600',
        fontSize: 13,
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
        marginBottom: 8, // Space between chips
    },
    selectedSlotText: {
        fontSize: 13,
        marginRight: 6,
    },
    removeSlotButton: {
        marginLeft: 4, // Space from text
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Spread buttons
    },
    modalButton: {
        flex: 1, // Each button takes half the space with a gap
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5, // Gap between buttons
    },
    // cancelButton styling can be just backgroundColor from props
    // saveButton styling can be just backgroundColor from props
    modalButtonTextAction: { // Renamed from modalButtonText
        color: '#fff', // Default for save button
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default TaskModal;