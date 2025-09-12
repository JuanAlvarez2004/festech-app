import { BorderRadius, Spacing, Typography } from '@/constants/Design';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { IconSymbol } from './icon-symbol';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true,
  style,
  inputStyle,
  onFocus,
  onBlur,
}: InputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerStyle = (): ViewStyle => ({
    borderWidth: 1.5,
    borderColor: error 
      ? Colors.error 
      : isFocused 
        ? Colors.primary 
        : colors.border,
    backgroundColor: editable ? colors.background : colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: multiline ? Spacing.md : Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    minHeight: multiline ? 80 : 48,
  });

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    fontSize: Typography.size.md,
    color: editable ? colors.text : colors.textSecondary,
    fontWeight: Typography.weight.regular,
    textAlignVertical: multiline ? 'top' : 'center',
    paddingTop: multiline && Platform.OS === 'android' ? Spacing.sm : 0,
  });

  const renderIcon = (iconName: string, onPress?: () => void) => (
    <TouchableOpacity 
      onPress={onPress}
      style={styles.iconContainer}
      disabled={!onPress}
    >
      <IconSymbol 
        name={iconName} 
        size={20} 
        color={colors.icon} 
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View style={getContainerStyle()}>
        {/* Left Icon */}
        {leftIcon && renderIcon(leftIcon)}

        {/* Input */}
        <TextInput
          style={[getInputStyle(), inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={Colors.primary}
        />

        {/* Right Icon */}
        {secureTextEntry ? (
          renderIcon(
            isPasswordVisible ? 'eye.slash' : 'eye',
            togglePasswordVisibility
          )
        ) : rightIcon ? (
          renderIcon(rightIcon, onRightIconPress)
        ) : null}
      </View>

      {/* Helper Text or Error */}
      {(error || helperText) && (
        <Text style={[
          styles.helperText,
          { color: error ? Colors.error : colors.textSecondary }
        ]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.xs,
  },
  iconContainer: {
    padding: Spacing.xs,
    marginHorizontal: Spacing.xs,
  },
  helperText: {
    fontSize: Typography.size.xs,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});