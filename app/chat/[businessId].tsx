import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const { businessId, videoId } = useLocalSearchParams<{
    businessId: string;
    videoId?: string;
  }>();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      Alert.alert(
        'Acceso denegado',
        'Necesitas iniciar sesión para acceder al chat',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      return;
    }

    // Aquí implementarías la lógica para:
    // 1. Crear o encontrar conversación existente con supabase
    // 2. Otorgar coins por primera interacción (según documentación API)
    // 3. Cargar mensajes existentes
    // 4. Configurar realtime subscription para nuevos mensajes
    console.log('Iniciando chat con negocio:', businessId);
    if (videoId) {
      console.log('Desde video:', videoId);
    }
  }, [user, businessId, videoId]);

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Chat con Negocio</Text>
        <Text style={styles.subtitle}>Business ID: {businessId}</Text>
        {videoId && (
          <Text style={styles.subtitle}>Video ID: {videoId}</Text>
        )}
        <Text style={styles.message}>
          🚀 Próximamente: Sistema de chat en tiempo real
        </Text>
        <Text style={styles.info}>
          • Chat directo con negocios{'\n'}
          • Notificaciones en tiempo real{'\n'}
          • Historial de conversaciones{'\n'}
          • Gana 5 coins por iniciar chat
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.light.textSecondary,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: Colors.primary,
    fontWeight: '600',
  },
  info: {
    fontSize: 16,
    textAlign: 'left',
    color: Colors.light.text,
    lineHeight: 24,
  },
});