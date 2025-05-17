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
import { useNavigation } from 'expo-router'; // Import useNavigation


import Calendar from "@/components/Calendar";
import TimeSlotItem from "@/components/timeslot/TimeSlotItem";
import TaskModal from "@/components/timeslot/TaskModal";
import FloatingActionButtons from "@/components/timeslot/FloatingActionButtons";
import SidebarMenu from "@/components/SidebarMenu";
import { generateTimeSlots } from "@/utils/timeUtil";

export default function TimeSlotScreen() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation(); // Get navigation object

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedView, setSelectedView] = useState("calendar");
  const [sidebarVisible, setSidebarVisible] = useState(false);


  useEffect(() => {
    navigation.setParams({
      openSidebar: () => setSidebarVisible(true),
    });
  }, [navigation, setSidebarVisible]); 


  const allPossibleTimeSlots = useMemo(() => generateTimeSlots(), []);

  useEffect(() => {
    setTimeSlots(allPossibleTimeSlots);
  }, [allPossibleTimeSlots]);

  const getCategoryColor = useCallback((category) => {
    switch (category) {
      case "Work": return colors.error;
      case "Personal": return colors.success;
      case "Meeting": return colors.info;
      case "School": return colors.warning;
      case "Team Time": return colors.teamTime || "#03A9F4";
      case "Friends": return colors.friends || "#9C27B0";
      default: return colors.accent;
    }
  }, [colors]);

  const updateTimeSlotHighlights = useCallback((tasksForDate) => {
    const newTimeSlots = allPossibleTimeSlots.map(slot => {
        const taskOnSlot = tasksForDate.find(task => task.timeSlotIds.includes(slot.id));
        if (taskOnSlot) {
            return { ...slot, hasTask: true, category: taskOnSlot.category, taskText: taskOnSlot.task };
        }
        return { ...slot, hasTask: false, category: undefined, taskText: undefined }; // Reset if no task
    });
    setTimeSlots(newTimeSlots);
  }, [allPossibleTimeSlots]);

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
  }, [loadTasks]);

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
        setSelectedTimeSlots(taskSlots.length > 0 ? taskSlots : selectedTimeSlots);
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
        return;
    }
    handleAddOrEditPress(taskToEdit);
  };

  const handleDeletePress = () => {
    if (selectedTimeSlots.length === 0) {
      Alert.alert("No Time Selected", "Select slots with tasks to delete.");
      return;
    }
    const slotIdsToDelete = selectedTimeSlots.map(s => s.id);
    const tasksInSelectedSlots = tasks.filter(task =>
        task.timeSlotIds.some(id => slotIdsToDelete.includes(id))
    );
    if (tasksInSelectedSlots.length === 0) {
        Alert.alert("No Tasks Found", "No tasks in selected slots.");
        return;
    }
    Alert.alert("Confirm Delete", "Delete task(s) in selected slots?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => performDeleteTasks(slotIdsToDelete) },
    ]);
  };

  const performDeleteTasks = async (slotIdsToDelete) => {
    try {
      const storedTasksJson = await AsyncStorage.getItem("tasks");
      let allStoredTasks = storedTasksJson ? JSON.parse(storedTasksJson) : [];
      const dateStr = selectedDate.toDateString();
      const updatedTasks = allStoredTasks.filter(task =>
        task.date !== dateStr || !task.timeSlotIds.some(id => slotIdsToDelete.includes(id))
      );
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setSelectedTimeSlots([]);
      loadTasks();
      Alert.alert("Success", "Task(s) deleted successfully!");
    } catch (error) {
      console.error("Failed to delete tasks:", error);
      Alert.alert("Error", "Failed to delete tasks.");
    }
  };

  const handleSaveTask = async (taskDetails) => {
    if (!taskDetails.text.trim()) {
      Alert.alert("Task Required", "Enter task description.");
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
            Alert.alert("Slot Occupied", "Selected slots are part of another task for this date.");
            return;
        }
        const newTask = { id: Date.now().toString(), task: taskDetails.text, category: taskDetails.category, date: dateStr, timeSlotIds: selectedSlotIds, timeSlots: selectedSlotTexts, timestamp: new Date().toISOString(), totalTime: selectedTimeSlots.length * 0.5 };
        allStoredTasks.push(newTask);
      }
      await AsyncStorage.setItem("tasks", JSON.stringify(allStoredTasks));
      setModalVisible(false);
      setEditingTask(null);
      setSelectedTimeSlots([]);
      loadTasks();
      Alert.alert("Success", `Task ${editingTask ? "updated" : "added"}!`);
    } catch (error) {
      console.error("Failed to save task:", error);
      Alert.alert("Error", "Failed to save task.");
    }
  };

  const styles = getStyles(colors); // Make sure getStyles is defined below

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />



      <SidebarMenu
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        colors={colors}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
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
                onPress={() => setSelectedView("calendar")}
              >
                <Ionicons name="calendar-outline" size={22} color={colors.accent} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={timeSlots}
              renderItem={({item}) => (
                <TimeSlotItem
                    item={item}
                    isSelected={selectedTimeSlots.some(s => s.id === item.id)}
                    onPress={() => toggleTimeSlotSelection(item)}
                    colors={colors}
                    getCategoryColor={getCategoryColor}
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
        onClose={() => { setModalVisible(false); setEditingTask(null); }}
        onSubmit={handleSaveTask}
        editingTask={editingTask}
        selectedTimeSlots={selectedTimeSlots}
        colors={colors}
        getCategoryColor={getCategoryColor}
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