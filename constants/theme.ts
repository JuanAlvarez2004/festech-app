/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Paleta de colores Festech inspirada en la naturaleza del Tolima
const primary = '#2A9D8F'; // Verde montaña profundo
const secondary = '#264653'; // Gris volcán oscuro
const accent = '#E9C46A'; // Beige cálido / Arena

// Colores derivados
const primaryLight = '#52C4B0';
const primaryDark = '#1E6F64';
const accentLight = '#F0D37F';
const accentDark = '#B8954A';

export const Colors = {
  // Colores principales
  primary,
  primaryLight,
  primaryDark,
  secondary,
  accent,
  accentLight,
  accentDark,
  
  // Grises y neutros
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F8F9FA',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',
  
  // Estados
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  
  // Tema claro
  light: {
    text: secondary,
    textSecondary: '#6C757D',
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    card: '#FFFFFF',
    border: '#E9ECEF',
    tint: primary,
    icon: '#6C757D',
    tabIconDefault: '#ADB5BD',
    tabIconSelected: primary,
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Tema oscuro
  dark: {
    text: '#FFFFFF',
    textSecondary: '#ADB5BD',
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    card: '#2D2D2D',
    border: '#3D3D3D',
    tint: primaryLight,
    icon: '#ADB5BD',
    tabIconDefault: '#6C757D',
    tabIconSelected: primaryLight,
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
