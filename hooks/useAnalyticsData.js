// geminie/hooks/useAnalyticsData.js
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Assume MONTH_NAMES and CATEGORIES are defined in a central place, e.g., utils/constants.js
// import { MONTH_NAMES, CATEGORIES } from '@/utils/constants';

export const useAnalyticsData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    day: new Date().getDate().toString(),
    month: new Date().getMonth(), // 0-11
    year: new Date().getFullYear().toString(),
    range: 'day', // 'day', 'week', 'month', 'year'
  });
  const [selectedCategory, setSelectedCategory] = useState('All'); // Assuming 'All' is a default

  const loadAllTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedTasksJson = await AsyncStorage.getItem('tasks');
      const parsedTasks = storedTasksJson ? JSON.parse(storedTasksJson) : [];
      // Basic sort by date initially, can be refined
      parsedTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
      setAllTasks(parsedTasks);
    } catch (error) {
      console.error('Failed to load all tasks:', error);
      setAllTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllTasks();
  }, [loadAllTasks]);

  useEffect(() => {
    if (isLoading) { // Don't filter if initial load is still in progress
        setFilteredTasks([]);
        return;
    }
    setIsFiltering(true);
    let currentTasks = [...allTasks];

    const { day, month, year, range } = dateFilter;
    const selectedDay = parseInt(day, 10);
    const selectedMonth = month; // month is already 0-11
    const selectedYear = parseInt(year, 10);

    let startDate, endDate;

    if (range === 'day') {
      startDate = new Date(selectedYear, selectedMonth, selectedDay);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
    } else if (range === 'week') {
      const currentSelectedDate = new Date(selectedYear, selectedMonth, selectedDay);
      const dayOfWeek = currentSelectedDate.getDay(); // 0 (Sun) - 6 (Sat)
      startDate = new Date(currentSelectedDate);
      // Adjust to Monday as start of the week
      startDate.setDate(currentSelectedDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (range === 'month') {
      startDate = new Date(selectedYear, selectedMonth, 1);
      endDate = new Date(selectedYear, selectedMonth + 1, 0); // Last day of the month
      endDate.setHours(23, 59, 59, 999);
    } else if (range === 'year') {
      startDate = new Date(selectedYear, 0, 1); // First day of the year
      endDate = new Date(selectedYear, 11, 31); // Last day of the year
      endDate.setHours(23, 59, 59, 999);
    }

    if (startDate && endDate) {
      currentTasks = currentTasks.filter((task) => {
        const taskDate = new Date(task.date); // Ensure task.date is parseable
        return taskDate >= startDate && taskDate <= endDate;
      });
    }

    if (selectedCategory !== 'All') {
      currentTasks = currentTasks.filter((task) => task.category === selectedCategory);
    }

    currentTasks.sort((a, b) => {
      const dateComparison = new Date(a.date) - new Date(b.date);
      if (dateComparison !== 0) return dateComparison;
      // Assuming timeSlotIds are like 'slot-8-30' (hour-minute)
      const timeA = a.timeSlotIds && a.timeSlotIds.length > 0 ? parseInt(a.timeSlotIds[0].split('-')[1], 10) * 60 + parseInt(a.timeSlotIds[0].split('-')[2], 10) : 0;
      const timeB = b.timeSlotIds && b.timeSlotIds.length > 0 ? parseInt(b.timeSlotIds[0].split('-')[1], 10) * 60 + parseInt(b.timeSlotIds[0].split('-')[2], 10) : 0;
      return timeA - timeB;
    });

    setFilteredTasks(currentTasks);
    setIsFiltering(false);
  }, [allTasks, dateFilter, selectedCategory, isLoading]);

  const handleDateFilterChange = useCallback((newFilter) => {
    setDateFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return {
    isLoading: isLoading && allTasks.length === 0, // True initial loading
    isFiltering, // For filtering operations after initial load
    allTasks,
    filteredTasks,
    dateFilter,
    handleDateFilterChange,
    selectedCategory,
    handleCategoryChange,
  };
};