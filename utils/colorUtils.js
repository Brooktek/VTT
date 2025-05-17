// geminie/utils/colorUtils.js
// This function assumes 'colors' object from useTheme() is passed or available in context
// For simplicity, I'm showing it as a standalone that would need 'colors' from theme.
// In a real app, this might be part of the ThemeContext or a hook.

export const getCategoryColor = (category, colors, opacity = 1) => {
  let color;
  switch (category) {
    case "Work": color = colors.error; break;
    case "Personal": color = colors.success; break;
    case "Meeting": color = colors.info; break;
    case "School": color = colors.warning; break;
    case "Team Time": color = colors.teamTime || "#03A9F4"; break;
    case "Friends": color = colors.friends || "#9C27B0"; break;
    default: color = colors.accent; break;
  }
  // For react-native-chart-kit, sometimes it needs hex without alpha for 'color' prop
  // and with alpha for gradient/bar color functions.
  // This example provides the hex. If opacity is needed, it should be applied correctly.
  // For the BarChart .colors array, it expects a function `(opacity=1) => colorStringWithOpacity`
   if (opacity < 1 && color.startsWith('#') && color.length === 7) {
    const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return `${color}${opacityHex}`;
  }
  return color;
};