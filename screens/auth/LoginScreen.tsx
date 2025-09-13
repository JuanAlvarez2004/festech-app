import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Input } from '@/components/ui';
import { Spacing, Typography } from '@/constants/Design';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { signIn, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await signIn(formData.email, formData.password);
      // La navegación se maneja automáticamente por el AuthContext
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Error de Acceso',
        error.message || 'Credenciales incorrectas. Verifica tu email y contraseña.'
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleForgotPassword = () => {
    // TODO: Implementar recuperación de contraseña
    Alert.alert('Proximamente', 'La recuperación de contraseña estará disponible pronto');
  };

  const handleRegister = () => {
    router.push('/auth/register' as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
              </TouchableOpacity>
              
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>🌿</Text>
                <Text style={styles.title}>Bienvenido de vuelta</Text>
                <Text style={styles.subtitle}>
                  Inicia sesión para continuar explorando
                </Text>
              </View>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <View style={styles.form}>
                <Input
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChangeText={(email) => setFormData({ ...formData, email })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  leftIcon="envelope"
                  style={styles.input}
                />

                <Input
                  placeholder="Contraseña"
                  value={formData.password}
                  onChangeText={(password) => setFormData({ ...formData, password })}
                  secureTextEntry={true}
                  leftIcon="lock"
                  style={styles.input}
                />

                <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
                  <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                <Button
                  title="Iniciar Sesión"
                  onPress={handleLogin}
                  loading={loading}
                  disabled={!formData.email || !formData.password}
                  variant="secondary"
                  size="lg"
                  fullWidth
                  style={styles.loginButton}
                />

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>o</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Login Placeholder */}
                <Button
                  title="Continuar con Google"
                  onPress={() => Alert.alert('Proximamente', 'Login con Google estará disponible pronto')}
                  variant="ghost"
                  size="lg"
                  fullWidth
                  leftIcon={<Ionicons name="logo-google" size={20} color={Colors.white} />}
                  style={styles.socialButton}
                  textStyle={styles.socialButtonText}
                />
              </View>
            </View>

            {/* Bottom */}
            <View style={styles.bottomContainer}>
              <Text style={styles.registerPrompt}>
                ¿No tienes cuenta?{' '}
                <Text style={styles.registerLink} onPress={handleRegister}>
                  Regístrate aquí
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary, // Fallback color
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  header: {
    flex: 0.3,
    justifyContent: 'center',
    paddingTop: Spacing.sm,
    minHeight: 200,
  },
  backButton: {
    position: 'absolute',
    top: Spacing.sm,
    left: 0,
    padding: Spacing.sm,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  logoText: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.size.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.size.md,
  },
  formContainer: {
    flex: 0.5,
    justifyContent: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginBottom: Spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    marginHorizontal: Spacing.md,
  },
  socialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
  socialButtonText: {
    color: Colors.white,
  },
  bottomContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: Spacing.md,
    minHeight: 60,
  },
  registerPrompt: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: Typography.size.sm,
  },
  registerLink: {
    fontWeight: Typography.weight.semibold,
    textDecorationLine: 'underline',
  },
});