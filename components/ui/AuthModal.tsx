import { BorderRadius, Spacing, Typography } from '@/constants/Design';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from './Button';
import { IconSymbol } from './icon-symbol';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actionType?: 'contact' | 'like' | 'follow' | 'general';
}

export default function AuthModal({
  visible,
  onClose,
  title,
  message,
  actionType = 'general',
}: AuthModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Personalizar contenido según el tipo de acción
  const getContent = () => {
    switch (actionType) {
      case 'contact':
        return {
          title: title || 'Inicia sesión para contactar',
          message: message || 'Para contactar negocios y acceder al chat, necesitas una cuenta.',
          icon: 'message.circle' as const,
        };
      case 'like':
        return {
          title: title || 'Inicia sesión para dar like',
          message: message || 'Para dar like a videos y guardar tus favoritos, necesitas una cuenta.',
          icon: 'heart.circle' as const,
        };
      case 'follow':
        return {
          title: title || 'Inicia sesión para seguir',
          message: message || 'Para seguir negocios y recibir sus actualizaciones, necesitas una cuenta.',
          icon: 'person.badge.plus' as const,
        };
      default:
        return {
          title: title || 'Inicia sesión para continuar',
          message: message || 'Para acceder a todas las funciones de Festech, necesitas una cuenta.',
          icon: 'person.circle' as const,
        };
    }
  };

  const content = getContent();

  const handleLogin = () => {
    onClose();
    router.push('/auth/login');
  };

  const handleRegister = () => {
    onClose();
    router.push('/auth/register');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <IconSymbol name="xmark" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name={content.icon} size={48} color={colors.primary} />
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
              {content.title}
            </Text>

            <Text style={[styles.message, { color: colors.textSecondary }]}>
              {content.message}
            </Text>

            <View style={styles.benefits}>
              <View style={styles.benefitItem}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                  Contacta negocios directamente
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                  Gana coins por actividades
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                  Accede a cupones exclusivos
                </Text>
              </View>
            </View>

            <View style={styles.buttons}>
              <Button
                title="Iniciar Sesión"
                onPress={handleLogin}
                variant="primary"
                style={styles.button}
              />

              <Button
                title="Crear Cuenta Gratis"
                onPress={handleRegister}
                variant="outline"
                style={styles.button}
              />
            </View>

            <TouchableOpacity onPress={onClose} style={styles.skipButton}>
              <Text style={[styles.skipText, { color: colors.textSecondary }]}>
                Continuar sin cuenta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 1,
    padding: Spacing.xs,
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  message: {
    fontSize: Typography.size.md,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.size.md,
    marginBottom: Spacing.lg,
  },
  benefits: {
    alignSelf: 'stretch',
    marginBottom: Spacing.xl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  checkmark: {
    fontSize: 16,
    color: Colors.success,
    fontWeight: 'bold',
  },
  benefitText: {
    fontSize: Typography.size.sm,
    marginLeft: Spacing.sm,
  },
  buttons: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  button: {
    marginBottom: Spacing.md,
  },
  skipButton: {
    paddingVertical: Spacing.sm,
  },
  skipText: {
    fontSize: Typography.size.sm,
    textAlign: 'center',
  },
});