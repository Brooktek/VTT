// geminie/components/ProfileMenu.jsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router"; // Import router for navigation
import DarkModeToggle from "./ui/DarkModeToggle.jsx";

const { width, height } = Dimensions.get("window");
const MENU_WIDTH = Math.min(width * 0.8, 320);

const defaultUserData = {
  name: "Guest User",
  email: "guest@example.com",
  avatarUri: "", // Ensure this can be an empty string for placeholder
};

export default function ProfileMenu({ onClose, userData = defaultUserData }) {
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const handleDarkModeToggle = () => {
    toggleTheme();
  };

  const handleNavigate = (path) => {
    console.log(`Navigating to ${path}`);
    if (path) { // Ensure path is provided
        router.push(path);
    }
    onClose(); // Close menu after navigation attempt
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Add actual logout logic here (e.g., clear tokens, navigate to login)
    onClose();
  };

  const menuItems = [
    // Ensure the path '/profile/edit' matches your file system routing for Expo Router
    { id: 'editProfile', label: "Edit Profile", icon: "person-circle-outline", action: () => handleNavigate("/profile/edit") },
    { id: 'settings', label: "Settings & Privacy", icon: "settings-outline", action: () => handleNavigate("/settings") }, // Placeholder
    { id: 'help', label: "Help & Support", icon: "help-circle-outline", action: () => handleNavigate("/help") }, // Placeholder
  ];

  const styles = getProfileMenuStyles(colors, MENU_WIDTH);

  // Use a default or placeholder avatar if userData.avatarUri is empty
  const avatarSource = userData.avatarUri ? { uri: userData.avatarUri } : null; // Or require a local placeholder image

  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <TouchableOpacity activeOpacity={1} style={styles.menuContainerTouchable} onPress={() => { /* Prevent closing by tapping menu */ }}>
        <View style={styles.menuContent}>
          <View style={styles.profileInfoSection}>
            <View style={styles.avatarContainer}>
              {avatarSource ? (
                <Image source={avatarSource} style={styles.profileAvatarImage} />
              ) : (
                <View style={styles.profileAvatarPlaceholder}>
                  <Ionicons name="person" size={30} color={colors.onPrimary || colors.background} />
                </View>
              )}
            </View>
            <View style={styles.textInfo}>
              <Text style={styles.profileName} numberOfLines={1}>{userData.name || "User Name"}</Text>
              <Text style={styles.profileEmail} numberOfLines={1}>{userData.email || "user@example.com"}</Text>
            </View>
          </View>

          <ScrollView style={styles.menuItemsScroll} showsVerticalScrollIndicator={false}>
            {menuItems.map(item => (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
                <Ionicons name={item.icon} size={24} color={colors.textSecondary} style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <View style={[styles.menuItem, styles.darkModeItem]}>
              <Ionicons name={isDarkMode ? "moon" : "sunny-outline"} size={24} color={colors.textSecondary} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Dark Mode</Text>
              <View style={styles.darkModeToggleContainer}>
                <DarkModeToggle
                    isEnabled={isDarkMode}
                    toggleSwitch={handleDarkModeToggle}
                />
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.error} style={styles.menuItemIcon} />
            <Text style={[styles.menuItemText, styles.logoutItemText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const getProfileMenuStyles = (colors, menuWidth) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-start", // Align menu to top
    alignItems: "flex-end", // Align menu to right
  },
  menuContainerTouchable: {
    // Adjust marginTop to account for status bar and potential header
    marginTop: (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0) + 50, // Add some space from top
    marginRight: 10,
    width: menuWidth,
    maxHeight: height * 0.75, // Increased max height
    borderRadius: 12,
    backgroundColor: colors.card, // Use card color from theme
    shadowColor: "#000",
    shadowOffset: { width: -3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  menuContent: {
    paddingVertical: 10,
  },
  profileInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
  },
  avatarContainer: {
    marginRight: 15,
  },
  profileAvatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary, // Use primary color for placeholder background
    justifyContent: "center",
    alignItems: "center",
  },
  textInfo: {
    flex: 1, // Allow text to take available space and wrap if needed
  },
  profileName: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  menuItemsScroll: {
    // Can set a max height here if content overflows maxHeight of menuContainerTouchable
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14, // Consistent padding
    paddingHorizontal: 16,
  },
  menuItemIcon: {
    marginRight: 18,
    width: 24, // Ensure icon has a fixed width for alignment
    textAlign: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    flex: 1, // Allow text to take remaining space
  },
  darkModeItem: {
    // Specific styles for dark mode row if needed
  },
  darkModeToggleContainer: {
    // Container for the switch to align it if necessary
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 10, // Space above logout
    paddingTop: 10, // Padding within the logout item above the border
  },
  logoutItemText: {
    color: colors.error, // Use error color from theme for logout text
    fontWeight: "500",
  },
});
