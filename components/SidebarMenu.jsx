// components/SidebarMenu.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SidebarMenu = ({
  visible,
  onClose,
  colors,
  isDarkMode,
  toggleTheme,
  // You can pass menu items as a prop or define them here
}) => {
  const sidebarAnimation = React.useRef(new Animated.Value(-width * 0.7)).current;

  React.useEffect(() => {
    Animated.timing(sidebarAnimation, {
      toValue: visible ? 0 : -width * 0.75, // Adjust width slightly for better feel
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, sidebarAnimation]);

  // Example menu item renderer (adapt from your original TimeSlotScreen)
  const renderSidebarMenuItem = (icon, text, color, isCategory = false, onAddPress) => (
    <View style={[styles.sidebarMenuItem, { borderBottomColor: colors.border }]}>
      <View style={styles.sidebarMenuItemLeft}>
        {isCategory ? (
          <View style={[styles.categoryDot, { backgroundColor: color }]} />
        ) : (
          <View style={styles.menuIconContainer}>{icon}</View>
        )}
        <Text style={[styles.sidebarMenuItemText, { color: colors.text }]}>{text}</Text>
      </View>
      {onAddPress && ( // Only show add button if a handler is provided
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <Ionicons name="add-circle-outline" size={24} color={colors.accent} />
        </TouchableOpacity>
      )}
    </View>
  );

  // Styles should be defined within this component
  const styles = getSidebarStyles(colors, width);

  if (!visible && sidebarAnimation._value === (-width * 0.75) ) return null; // Render nothing if fully closed

  return (
    <>
      {visible && (
        <TouchableOpacity
          style={styles.sidebarOverlay}
          activeOpacity={1}
          onPress={onClose}
        />
      )}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: sidebarAnimation }],
            backgroundColor: colors.card, // Use card or surface from theme
          },
        ]}
      >
        {/* Actual content of the sidebar */}
        <View style={styles.sidebarHeader}>
          <Text style={[styles.sidebarTitle, { color: colors.primary }]}>Value Tracker</Text>
          {/* Optional: Close button inside sidebar */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.themeToggleContainer, { borderBottomColor: colors.border }]}>
          <View style={styles.themeToggleLeft}>
            <Ionicons name={isDarkMode ? "moon" : "sunny"} size={20} color={colors.text} />
            <Text style={[styles.themeToggleText, { color: colors.text }]}>
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: colors.primary + '50' }} // Primary with opacity
            thumbColor={isDarkMode ? colors.primary : "#f4f3f4"}
          />
        </View>

        {/* Menu Items - map over an array or list them directly */}
        {renderSidebarMenuItem(<Ionicons name="diamond-outline" size={20} color="#00BCD4" />, "Core Rock", "#00BCD4", false, () => console.log("Add Core Rock"))}
        {renderSidebarMenuItem(<Ionicons name="radio-button-on-outline" size={20} color="#FF5252" />, "Target", "#FF5252", false, () => console.log("Add Target"))}
        {renderSidebarMenuItem(<Ionicons name="flash-outline" size={20} color="#FF9800" />, "Action", "#FF9800", false, () => console.log("Add Action"))}


        <Text style={[styles.sidebarSectionTitle, { color: colors.text }]}>Categories</Text>
        {renderSidebarMenuItem(null, "Work", colors.error, true, () => console.log("Add Work Category Item"))}
        {renderSidebarMenuItem(null, "School", colors.success, true, () => console.log("Add School Category Item"))}
        {renderSidebarMenuItem(null, "Team Time", colors.info, true, () => console.log("Add Team Time Category Item"))}
        {renderSidebarMenuItem(null, "Friends", colors.friends || "#9C27B0", true, () => console.log("Add Friends Category Item"))}
        {/* Add more menu items as needed */}
      </Animated.View>
    </>
  );
};

const getSidebarStyles = (colors, screenWidth) => StyleSheet.create({
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay
    zIndex: 99,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth * 0.75, // 75% of screen width
    height: '100%',
    zIndex: 100, // Above overlay
    paddingTop: 40, // Adjust for status bar if needed (SafeAreaView in parent helps)
    paddingHorizontal: 0, // Padding will be on inner content
    borderRightWidth: 1,
    borderRightColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  themeToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggleText: {
    fontSize: 16,
    marginLeft: 12,
  },
  sidebarSectionTitle: {
    fontSize: 14, // Smaller section title
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  sidebarMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15, // More touch space
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  sidebarMenuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow text to take available space
  },
  sidebarMenuItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  menuIconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryDot: {
    width: 12, // Smaller dot
    height: 12,
    borderRadius: 6,
    marginRight: 3, // Align with icon margin
  },
  addButton: {
    padding: 5, // Make touch target larger
  },
});

export default SidebarMenu;