import { BorderRadius, Shadows, Spacing } from '@/constants/Design';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
  shadow?: keyof typeof Shadows;
  borderRadius?: keyof typeof BorderRadius;
  backgroundColor?: string;
}

export default function Card({
  children,
  style,
  padding = 'md',
  shadow = 'sm',
  borderRadius = 'lg',
  backgroundColor,
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const cardStyle: ViewStyle = {
    backgroundColor: backgroundColor || colors.card,
    padding: Spacing[padding],
    borderRadius: BorderRadius[borderRadius],
    ...Shadows[shadow],
  };

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos adicionales si es necesario
});