import { Spacing, Typography } from '@/constants/Design';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({
  size = 'large',
  color,
  text = 'Cargando...',
  fullScreen = false,
}: LoadingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const containerStyle = fullScreen 
    ? styles.fullScreenContainer 
    : styles.container;

  return (
    <View style={[
      containerStyle, 
      { backgroundColor: fullScreen ? colors.background : 'transparent' }
    ]}>
      <ActivityIndicator 
        size={size} 
        color={color || Colors.primary} 
      />
      {text && (
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          {text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: Spacing.md,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
});