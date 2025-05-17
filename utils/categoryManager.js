// geminie/utils/categoryManager.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// These would ideally come from your actual ThemeContext colors
// For now, these are placeholders. Replace with your actual theme color access.
const FALLBACK_THEME_COLORS = {
  light: {
    error: '#B00020',    // Work
    success: '#4CAF50',  // Personal
    info: '#2196F3',     // Meeting
    warning: '#FFC107',  // School
    teamtime: '#03A9F4', // Team Time
    friends: '#9C27B0',  // Friends
    accent: '#6200EE',   // Default for others
    onPrimary: '#FFFFFF',
    // ... other essential theme colors used by components
  },
  dark: {
    error: '#CF6679',
    success: '#81C784',
    info: '#64B5F6',
    warning: '#FFD54F',
    teamtime: '#4FC3F7',
    friends: '#BA68C8',
    accent: '#BB86FC',
    onPrimary: '#000000',
    // ...
  },
};

export const DEFAULT_CATEGORIES = [
  { id: 'default-work', name: "Work", isDefault: true, colorKey: 'error' }, // colorKey refers to theme color
  { id: 'default-personal', name: "Personal", isDefault: true, colorKey: 'success' },
  { id: 'default-meeting', name: "Meeting", isDefault: true, colorKey: 'info' },
  { id: 'default-school', name: "School", isDefault: true, colorKey: 'warning' },
  { id: 'default-teamtime', name: "Team Time", isDefault: true, colorKey: 'teamtime' },
  { id: 'default-friends', name: "Friends", isDefault: true, colorKey: 'friends' },
];

const USER_CATEGORIES_KEY = '@user_categories_v2'; // Updated key if structure changes

export const getCustomCategories = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_CATEGORIES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load custom categories.', e);
    Alert.alert('Error', 'Could not load custom categories.');
    return [];
  }
};

export const saveCustomCategories = async (categories) => {
  try {
    const jsonValue = JSON.stringify(categories);
    await AsyncStorage.setItem(USER_CATEGORIES_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save custom categories.', e);
    Alert.alert('Error', 'Could not save custom categories.');
  }
};

export const addCustomCategory = async (categoryName, categoryColor) => {
  if (!categoryName.trim()) {
    Alert.alert('Invalid Name', 'Category name cannot be empty.');
    return null;
  }
  const customCategories = await getCustomCategories();
  const allDefaultNames = DEFAULT_CATEGORIES.map(c => c.name.toLowerCase());
  const allCustomNames = customCategories.map(c => c.name.toLowerCase());

  if (allDefaultNames.includes(categoryName.trim().toLowerCase()) || allCustomNames.includes(categoryName.trim().toLowerCase())) {
    Alert.alert('Duplicate Category', 'A category with this name already exists.');
    return null;
  }

  const newCategory = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: categoryName.trim(),
    color: categoryColor, // User-picked hex color string
    isDefault: false,
  };
  const updatedCategories = [...customCategories, newCategory];
  await saveCustomCategories(updatedCategories);
  // Alert.alert('Success', `Category "${newCategory.name}" added!`); // Parent component can alert
  return newCategory;
};

export const getAllCategories = async () => {
  const customCategories = await getCustomCategories();
  return [...DEFAULT_CATEGORIES, ...customCategories];
};

// Centralized function to get category color
export const getCategoryDisplayColor = (categoryInput, allCategories, actualThemeColors, isDarkMode) => {
  const themeToUse = isDarkMode ? (actualThemeColors?.dark || FALLBACK_THEME_COLORS.dark) : (actualThemeColors?.light || FALLBACK_THEME_COLORS.light);
  const fallbackColor = themeToUse.accent || '#888888';

  if (!categoryInput) return fallbackColor;

  let categoryObject;
  if (typeof categoryInput === 'string') {
    categoryObject = allCategories.find(cat => cat.name.toLowerCase() === categoryInput.toLowerCase());
  } else {
    categoryObject = categoryInput; // Assume it's already a category object
  }

  if (!categoryObject || !categoryObject.name) return fallbackColor;

  if (!categoryObject.isDefault && categoryObject.color) {
    return categoryObject.color; // Custom color
  }

  if (categoryObject.isDefault && categoryObject.colorKey) {
    return themeToUse[categoryObject.colorKey] || fallbackColor;
  }
  
  // Fallback for default categories if colorKey is missing or not in theme (should not happen with good setup)
  const categoryKey = categoryObject.name.toLowerCase().replace(/\s+/g, '');
  return themeToUse[categoryKey] || fallbackColor;
};