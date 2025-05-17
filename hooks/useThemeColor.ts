// geminie/hooks/useThemeColor.ts
/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors'; // Make sure this path is correct after moving Colors.ts
import { useColorScheme } from '@/hooks/useColorScheme'; // Correct path

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // This assumes Colors.light and Colors.dark have the same keys.
    // If ThemeContext.colors is more comprehensive, you might want to use that instead.
    // However, this hook is often used for very specific component-level theme overrides.
    return Colors[theme][colorName];
  }
}