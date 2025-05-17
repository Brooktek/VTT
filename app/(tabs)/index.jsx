// geminie/app/(tabs)/index.jsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigation, useFocusEffect } from 'expo-router'; // Added useFocusEffect


import Calendar from "@/components/Calendar";
import TimeSlotItem from "@/components/timeslot/TimeSlotItem";
import TaskModal from "@/components/timeslot/TaskModal";
import FloatingActionButtons from "@/components/timeslot/FloatingActionButtons";
import SidebarMenu from "@/components/SidebarMenu";
import { generateTimeSlots } from "@/utils/timeUtil";
import { getAllCategories, getCategoryDisplayColor } from "@/utils/categoryManager"; // Import category utilities

export default function TimeSlotScreen() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedView, setSelectedView] = useState("calendar");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [allCategoriesForScreen, setAllCategoriesForScreen] = useState([]);

  const fetchAllCatsForScreen = useCallback(async () => {
      try {
        const cats = await getAllCategories();
        setAllCategoriesForScreen(cats);
      } catch (error) {
        console.error("Failed to fetch categories for TimeSlotScreen:", error);
      }
  }, []);

  // Fetch categories when the screen mounts and when it gains focus
  useFocusEffect(
    useCallback(() => {
      fetchAllCatsForScreen();
    }, [fetchAllCatsForScreen])
  );

  useEffect(() => {
    navigation.setParams({
      openSidebar: () => setSidebarVisible(true),
    });
  }, [navigation]);


  const allPossibleTimeSlots = useMemo(() => generateTimeSlots(), []);

  useEffect(() => {
    setTimeSlots(allPossibleTimeSlots);
  }, [allPossibleTimeSlots]);

  // Updated getCategoryColor for TimeSlotItem
  const getDynamicCategoryColor = useCallback((categoryName) => {
    return getCategoryDisplayColor(categoryName, allCategoriesForScreen, colors, isDarkMode);
  }, [allCategoriesForScreen, colors, isDarkMode]);

  const updateTimeSlotHighlights = useCallback((tasksForDate) => {
    const newTimeSlots = allPossibleTimeSlots.map(slot => {
        const taskOnSlot = tasksForDate.find(task => task.timeSlotIds.includes(slot.id));
        if (taskOnSlot) {
            // taskOnSlot.category should be the category NAME
            return { ...slot, hasTask: true, category: taskOnSlot.category, taskText: taskOnSlot.task };
        }
        return { ...slot, hasTask: false, category: undefined, taskText: undefined };
    });
    setTimeSlots(newTimeSlots);
  }, [allPossibleTimeSlots /* Removed getDynamicCategoryColor from deps if not directly used here */]);

  const loadTasks = useCallback(async () => {
    try {
      const dateStr = selectedDate.toDateString();
      const storedTasksJson = await AsyncStorage.getItem("tasks");
      let allStoredTasks = storedTasksJson ? JSON.parse(storedTasksJson) : [];
      const tasksForDate = allStoredTasks.filter((task) => task.date === dateStr);
      setTasks(tasksForDate);
      updateTimeSlotHighlights(tasksForDate);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setTasks([]);
      updateTimeSlotHighlights([]);
    }
  }, [selectedDate, updateTimeSlotHighlights]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]); // Re-run loadTasks if selectedDate or updateTimeSlotHighlights changes

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlots([]);
    setSelectedView("timeSlots");
  };

  const toggleTimeSlotSelection = (slot) => {
    setSelectedTimeSlots((prev) =>
      prev.some((s) => s.id === slot.id)
        ? prev.filter((s) => s.id !== slot.id)
        : [...prev, slot]
    );
  };

  const handleAddOrEditPress = (taskToEdit = null) => {
    if (!taskToEdit && selectedTimeSlots.length === 0) {
      Alert.alert("No Time Selected", "Please select at least one time slot.");
      return;
    }
    if (taskToEdit) {
        setEditingTask(taskToEdit);
        const taskSlots = allPossibleTimeSlots.filter(ts => taskToEdit.timeSlotIds.includes(ts.id));
        setSelectedTimeSlots(taskSlots.length > 0 ? taskSlots : []);
    } else {
        const selectedSlotIds = selectedTimeSlots.map(s => s.id);
        const existingTaskInSelectedSlots = tasks.find(task =>
            task.timeSlotIds.some(id => selectedSlotIds.includes(id))
        );
        if (existingTaskInSelectedSlots) {
             Alert.alert("Task Exists", "One or more selected time slots already have a task. Edit or choose empty slots.");
             return;
        }
        setEditingTask(null);
    }
    setModalVisible(true);
  };

  const handleEditAction = () => {
    if (selectedTimeSlots.length === 0) {
        Alert.alert("No Time Selected", "Please select a task to edit.");
        return;
    }
    let taskToEdit = null;
    for (const selectedSlot of selectedTimeSlots) {
        taskToEdit = tasks.find(task => task.timeSlotIds.includes(selectedSlot.id));
        if (taskToEdit) break;
    }
    if (!taskToEdit) {
        Alert.alert("No Task Found", "Selected slots do not contain a task to edit.");
        setSelectedTimeSlots([]);
        return;
    }
    handleAddOrEditPress(taskToEdit);
  };

  const handleDeletePress = () => {
    if (selectedTimeSlots.length === 0) {
      Alert.alert("No Time Selected", "Select slots with tasks to delete.");
      return;
    }
    const slotsWithTasksToDelete = selectedTimeSlots.filter(slot =>
        tasks.some(task => task.timeSlotIds.includes(slot.id))
    );
    if (slotsWithTasksToDelete.length === 0) {
        Alert.alert("No Tasks Found", "Selected slots do not contain any tasks to delete.");
        setSelectedTimeSlots([]);
        return;
    }
    const taskIdsToDelete = new Set();
    slotsWithTasksToDelete.forEach(slot => {
        const task = tasks.find(t => t.timeSlotIds.includes(slot.id));
        if (task) taskIdsToDelete.add(task.id);
    });
    if (taskIdsToDelete.size === 0) {
        Alert.alert("No Tasks Found", "No tasks in selected slots.");
        setSelectedTimeSlots([]);
        return;
    }
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${taskIdsToDelete.size} task(s) associated with the selected slots?`,
      [
        { text: "Cancel", style: "cancel", onPress: () => setSelectedTimeSlots([]) },
        { text: "Delete", style: "destructive", onPress: () => performDeleteTasksByIds(Array.from(taskIdsToDelete)) },
      ]
    );
  };

  const performDeleteTasksByIds = async (taskIdsToDelete) => {
    try {
      const storedTasksJson = await AsyncStorage.getItem("tasks");
      let allStoredTasks = storedTasksJson ? JSON.parse(storedTasksJson) : [];
      const updatedTasks = allStoredTasks.filter(task => !taskIdsToDelete.includes(task.id));
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setSelectedTimeSlots([]);
      loadTasks(); // This reloads tasks for the current date and updates highlights
      Alert.alert("Success", "Task(s) deleted successfully!");
    } catch (error) {
      console.error("Failed to delete tasks:", error);
      Alert.alert("Error", "Failed to delete tasks.");
    }
  };

  const handleSaveTask = async (taskDetails) => { // taskDetails = { text, category (name) }
    if (!taskDetails.text.trim()) {
      Alert.alert("Task Required", "Enter task description.");
      return;
    }
    if (!taskDetails.category) {
        Alert.alert("Category Required", "A category is required for the task.");
        return;
    }
    if (selectedTimeSlots.length === 0 && !editingTask) {
        Alert.alert("No Time Slots", "Select time slots for the new task.");
        return;
    }

    try {
      const storedTasksJson = await AsyncStorage.getItem("tasks");
      let allStoredTasks = storedTasksJson ? JSON.parse(storedTasksJson) : [];
      const selectedSlotIds = selectedTimeSlots.map((slot) => slot.id);
      const selectedSlotTexts = selectedTimeSlots.map((slot) => slot.displayText);
      const dateStr = selectedDate.toDateString();

      if (editingTask) {
        const otherTasksOnDate = allStoredTasks.filter(
            task => task.date === dateStr && task.id !== editingTask.id
        );
        const conflictWithOtherTask = otherTasksOnDate.some(task =>
            task.timeSlotIds.some(id => selectedSlotIds.includes(id))
        );
        if (conflictWithOtherTask) {
            Alert.alert("Slot Occupied", "The new time slots for this task conflict with another existing task.");
            return;
        }
        allStoredTasks = allStoredTasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, task: taskDetails.text, category: taskDetails.category, timeSlotIds: selectedSlotIds, timeSlots: selectedSlotTexts, totalTime: selectedTimeSlots.length * 0.5 }
            : task
        );
      } else {
        const existingTaskInSlot = allStoredTasks.find(task =>
            task.date === dateStr && task.timeSlotIds.some(id => selectedSlotIds.includes(id))
        );
        if (existingTaskInSlot) {
            Alert.alert("Slot Occupied", "One or more selected slots are already part of another task for this date.");
            return;
        }
        const newTask = {
            id: Date.now().toString(),
            task: taskDetails.text,
            category: taskDetails.category, // Save category NAME
            date: dateStr,
            timeSlotIds: selectedSlotIds,
            timeSlots: selectedSlotTexts,
            timestamp: new Date().toISOString(),
            totalTime: selectedTimeSlots.length * 0.5
        };
        allStoredTasks.push(newTask);
      }
      await AsyncStorage.setItem("tasks", JSON.stringify(allStoredTasks));
      setModalVisible(false);
      setEditingTask(null);
      setSelectedTimeSlots([]);
      await loadTasks(); // Ensure tasks are reloaded before categories (if category change affects this screen directly)
      await fetchAllCatsForScreen(); // Refresh categories, in case a new one was added via TaskModal
      Alert.alert("Success", `Task ${editingTask ? "updated" : "added"}!`);
    } catch (error) {
      console.error("Failed to save task:", error);
      Alert.alert("Error", "Failed to save task.");
    }
  };

  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      <SidebarMenu
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        colors={colors}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        // Consider passing allCategoriesForScreen to SidebarMenu if it lists categories
      />

      <View style={styles.content}>
        {selectedView === "calendar" ? (
          <Calendar onDateSelect={handleDateSelect} />
        ) : (
          <View style={styles.timeSlotsContainer}>
            <View style={styles.timeSlotsHeader}>
              <Text style={styles.timeSlotsTitle}>Select Time Slots:</Text>
              <TouchableOpacity
                style={[styles.calendarNavButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => {
                    setSelectedView("calendar");
                    setSelectedTimeSlots([]);
                }}
              >
                <Ionicons name="calendar-outline" size={22} color={colors.accent} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={timeSlots} // timeSlots items should have { ..., category: "CategoryName", ... }
              renderItem={({item}) => (
                <TimeSlotItem
                    item={item}
                    isSelected={selectedTimeSlots.some(s => s.id === item.id)}
                    onPress={() => toggleTimeSlotSelection(item)}
                    colors={colors}
                    getCategoryColor={getDynamicCategoryColor} // Use the dynamic one
                />
              )}
              keyExtractor={(item) => item.id}
              numColumns={3}
              contentContainerStyle={styles.timeSlotsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>

      <TaskModal
        visible={modalVisible}
        onClose={() => {
            setModalVisible(false);
            setEditingTask(null);
            setSelectedTimeSlots([]);
            fetchAllCatsForScreen(); // Refresh categories when modal closes, in case one was added
         }}
        onSubmit={handleSaveTask}
        editingTask={editingTask}
        selectedTimeSlots={selectedTimeSlots}
        colors={colors} // Pass theme colors (TaskModal uses useTheme for isDarkMode)
        // getCategoryColor is removed as TaskModal handles its own category color logic now
        toggleTimeSlotSelection={toggleTimeSlotSelection}
      />

      {selectedView === "timeSlots" && (
        <FloatingActionButtons
          onAdd={() => handleAddOrEditPress()}
          onEdit={handleEditAction}
          onDelete={handleDeletePress}
          colors={colors}
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  timeSlotsContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  timeSlotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  timeSlotsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  calendarNavButton: {
    padding: 10,
    borderRadius: 25,
  },
  timeSlotsList: {
    paddingBottom: 80,
  },
});