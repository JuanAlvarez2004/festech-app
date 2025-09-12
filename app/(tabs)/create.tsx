import { Loading } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTabAuthGuard } from '@/hooks/useTabAuthGuard';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CreateScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { shouldShowContent } = useTabAuthGuard('create');

  // Si no está autenticado, mostrar loading hasta que se resuelva
  if (!shouldShowContent) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        Crear Contenido
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Próximamente: Subir videos para tu negocio
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});