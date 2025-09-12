import { BorderRadius, Spacing, Typography } from '@/constants/Design';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.lg,
      ...getSizeStyles(),
    };

    if (fullWidth) {
      baseStyles.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: disabled ? Colors.gray400 : Colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: disabled ? Colors.gray300 : Colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: disabled ? Colors.gray400 : Colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      case 'gradient':
        return baseStyles;
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          minHeight: 36,
        };
      case 'lg':
        return {
          paddingHorizontal: Spacing.xl,
          paddingVertical: Spacing.md,
          minHeight: 56,
        };
      default: // md
        return {
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
          minHeight: 48,
        };
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseTextStyles: TextStyle = {
      fontWeight: Typography.weight.semibold,
      textAlign: 'center',
    };

    switch (size) {
      case 'sm':
        baseTextStyles.fontSize = Typography.size.sm;
        break;
      case 'lg':
        baseTextStyles.fontSize = Typography.size.lg;
        break;
      default:
        baseTextStyles.fontSize = Typography.size.md;
    }

    switch (variant) {
      case 'primary':
      case 'secondary':
        baseTextStyles.color = Colors.white;
        break;
      case 'outline':
      case 'ghost':
        baseTextStyles.color = disabled ? Colors.gray400 : Colors.primary;
        break;
      case 'gradient':
        baseTextStyles.color = Colors.white;
        break;
      default:
        baseTextStyles.color = colors.text;
    }

    return baseTextStyles;
  };

  const buttonContent = (
    <>
      {leftIcon && !loading && leftIcon}
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white} 
        />
      ) : (
        <Text style={[
          getTextStyles(), 
          textStyle, 
          leftIcon ? { marginLeft: Spacing.sm } : undefined
        ]}>
          {title}
        </Text>
      )}
      {rightIcon && !loading && rightIcon}
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[{ opacity: disabled ? 0.6 : 1 }, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={getButtonStyles()}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        getButtonStyles(),
        { opacity: disabled ? 0.6 : 1 },
        style,
      ]}
      activeOpacity={0.8}
    >
      {buttonContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Estilos adicionales si es necesario
});