// geminie/contexts/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme, Appearance } from 'react-native';

// Define the shape of your theme colors
interface ThemeColors {
  primary: string;
  onPrimary: string;
  accent: string;
  onAccent: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  card: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  border: string;
  divider: string;
  shadow: string;
  error: string;
  onError: string;
  success: string;
  onSuccess: string;
  warning: string;
  onWarning: string;
  info: string;
  onInfo: string;
  selected: string;
  inactive: string;
  weekend?: string;
  teamTime?: string;
  friends?: string;
}

// Define the shape of your theme context
interface ThemeContextType {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// Define your light and dark color palettes
// IMPORTANT: Customize these with your actual app colors!
// These should align with or expand upon what's in constants/Colors.ts
const lightColors: ThemeColors = {
  primary: '#6200EE',
  onPrimary: '#FFFFFF',
  accent: '#03DAC6',
  onAccent: '#000000',
  background: '#F5F5F5', // From your Colors.ts: '#fff'
  surface: '#FFFFFF',
  surfaceVariant: '#E0E0E0',
  card: '#FFFFFF',
  text: '#11181C', // From your Colors.ts
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  border: '#DCDCDC',
  divider: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  error: '#B00020',
  onError: '#FFFFFF',
  success: '#4CAF50',
  onSuccess: '#FFFFFF',
  warning: '#FFC107',
  onWarning: '#000000',
  info: '#2196F3',
  onInfo: '#FFFFFF',
  selected: '#6200EE',
  inactive: '#BDBDBD',
  weekend: '#757575',
  teamTime: '#03A9F4',
  friends: '#9C27B0',
};

const darkColors: ThemeColors = {
  primary: '#BB86FC',
  onPrimary: '#000000',
  accent: '#03DAC5',
  onAccent: '#000000',
  background: '#121212', // From your Colors.ts: '#151718'
  surface: '#1E1E1E',
  surfaceVariant: '#2C2C2C',
  card: '#1E1E1E',
  text: '#ECEDEE', // From your Colors.ts
  textSecondary: '#A0A0A0',
  textDisabled: '#757575',
  border: '#3A3A3A',
  divider: '#2C2C2C',
  shadow: 'rgba(255, 255, 255, 0.05)',
  error: '#CF6679',
  onError: '#000000',
  success: '#81C784',
  onSuccess: '#000000',
  warning: '#FFD54F',
  onWarning: '#000000',
  info: '#64B5F6',
  onInfo: '#000000',
  selected: '#BB86FC',
  inactive: '#757575',
  weekend: '#A0A0A0',
  teamTime: '#4FC3F7',
  friends: '#BA68C8',
};

const defaultContextValue: ThemeContextType = {
  isDarkMode: false,
  colors: lightColors,
  toggleTheme: () => console.warn('toggleTheme called outside of ThemeProvider'),
  setTheme: () => console.warn('setTheme called outside of ThemeProvider'),
};
const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useSystemColorScheme();
  const [currentThemeSetting, setCurrentThemeSetting] = useState<'light' | 'dark' | 'system'>('system');
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    if (currentThemeSetting === 'system') {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, currentThemeSetting]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (currentThemeSetting === 'system') {
        setIsDarkMode(colorScheme === 'dark');
      }
    });
    return () => subscription.remove();
  }, [currentThemeSetting]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setCurrentThemeSetting(newMode ? 'dark' : 'light');
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setCurrentThemeSetting(theme);
    if (theme === 'system') {
      setIsDarkMode(systemColorScheme === 'dark');
    } else {
      setIsDarkMode(theme === 'dark');
    }
  };

  const themeColors = isDarkMode ? darkColors : lightColors;

  const contextValue: ThemeContextType = {
    isDarkMode,
    colors: themeColors,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
