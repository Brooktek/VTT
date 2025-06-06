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
  StatusBar, // <-- IMPORTED StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
// import { router } from "expo-router"; // Removed as it's unused based on the error
import DarkModeToggle from "./ui/DarkModeToggle.jsx";

const { width, height } = Dimensions.get("window");
const MENU_WIDTH = Math.min(width * 0.8, 320);

const defaultUserData = {
  name: "Guest User",
  email: "guest@example.com",
  avatarUri: "",
};

export default function ProfileMenu({ onClose, userData = defaultUserData }) {
  const { colors, isDarkMode, toggleTheme } = useTheme(); // Removed unused `setTheme`

  const handleDarkModeToggle = () => {
    toggleTheme();
  };

  const handleNavigate = (path) => {
    console.log(`Navigating to ${path}`);
    // router.push(path); // This was commented out, keeping it so for now
    onClose();
  };

  const handleLogout = () => {
    console.log("Logging out...");
    onClose();
  };

  const menuItems = [
    { id: 'editProfile', label: "Edit Profile", icon: "person-circle-outline", action: () => handleNavigate("/profile/edit") },
    { id: 'settings', label: "Settings & Privacy", icon: "settings-outline", action: () => handleNavigate("/settings") },
    { id: 'help', label: "Help & Support", icon: "help-circle-outline", action: () => handleNavigate("/help") },
  ];

  const styles = getProfileMenuStyles(colors, MENU_WIDTH);

  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <TouchableOpacity activeOpacity={1} style={styles.menuContainerTouchable}>
        <View style={styles.menuContent}>
          <View style={styles.profileInfoSection}>
            <View style={styles.avatarContainer}>
              {userData.avatarUri ? (
                <Image source={{ uri: userData.avatarUri }} style={styles.profileAvatarImage} />
              ) : (
                <View style={styles.profileAvatarPlaceholder}>
                  <Ionicons name="person" size={30} color={colors.onPrimary || colors.background} />
                </View>
              )}
            </View>
            <View style={styles.textInfo}>
              <Text style={styles.profileName} numberOfLines={1}>{userData.name}</Text>
              <Text style={styles.profileEmail} numberOfLines={1}>{userData.email}</Text>
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
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuContainerTouchable: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight + 50 : 70, // Adjusted iOS marginTop
    marginRight: 10,
    width: menuWidth,
    maxHeight: height * 0.7,
    borderRadius: 12,
    backgroundColor: colors.card,
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
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  textInfo: {
    flex: 1,
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
  menuItemsScroll: {},
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemIcon: {
    marginRight: 18,
    width: 24,
    textAlign: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  darkModeItem: {},
  darkModeToggleContainer: {},
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 10,
    paddingTop: 10,
  },
  logoutItemText: {
    color: colors.error,
    fontWeight: "500",
  },
});