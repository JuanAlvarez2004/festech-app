import { Button, Input } from '@/components/ui';
import { BorderRadius, Spacing, Typography } from '@/constants/Design';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BusinessCategory, RegisterForm, UserType } from '@/types';
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

const USER_TYPE_OPTIONS = [
  { 
    value: 'client' as UserType, 
    label: 'Cliente', 
    description: 'Descubre y contacta negocios locales',
    icon: '👤'
  },
  { 
    value: 'business' as UserType, 
    label: 'Empresa', 
    description: 'Promociona tu negocio con videos',
    icon: '🏢'
  },
];

const INTEREST_OPTIONS: { value: BusinessCategory; label: string; icon: string }[] = [
  { value: 'gastronomia', label: 'Gastronomía', icon: '🍕' },
  { value: 'hospedaje', label: 'Hospedaje', icon: '🏨' },
  { value: 'aventura', label: 'Aventura', icon: '🎯' },
  { value: 'cultura', label: 'Cultura', icon: '🏛️' },
  { value: 'compras', label: 'Compras', icon: '🛍️' },
  { value: 'vida_nocturna', label: 'Vida Nocturna', icon: '🌙' },
  { value: 'naturaleza', label: 'Naturaleza', icon: '🌿' },
];

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { signUp, loading } = useAuth();

  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userType: 'client',
    phone: '',
    interests: [],
  });

  const [errors, setErrors] = useState<Partial<RegisterForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido';
    } else if (form.fullName.trim().length < 2) {
      newErrors.fullName = 'Mínimo 2 caracteres';
    }

    if (!form.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!form.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (form.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (form.phone && !/^\+?[\d\s\-\(\)]+$/.test(form.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await signUp(form.email, form.password, {
        fullName: form.fullName,
        userType: form.userType,
        phone: form.phone,
        interests: form.interests,
      });
      
      Alert.alert(
        'Registro exitoso',
        'Tu cuenta ha sido creada. Revisa tu email para verificar tu cuenta.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrar usuario');
    }
  };

  const toggleInterest = (interest: BusinessCategory) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...(prev.interests || []), interest]
    }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Únete a Festech
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Descubre los mejores negocios del Tolima
            </Text>
          </View>

          <View style={styles.form}>
            {/* Tipo de Usuario */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Tipo de cuenta
            </Text>
            <View style={styles.userTypeContainer}>
              {USER_TYPE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.userTypeOption,
                    {
                      borderColor: form.userType === option.value ? colors.primary : colors.border,
                      backgroundColor: form.userType === option.value ? colors.primary + '10' : 'transparent',
                    },
                  ]}
                  onPress={() => setForm({ ...form, userType: option.value })}
                >
                  <View style={styles.userTypeHeader}>
                    <Text style={styles.userTypeIcon}>{option.icon}</Text>
                    <Text style={[
                      styles.userTypeLabel,
                      { color: form.userType === option.value ? colors.primary : colors.text }
                    ]}>
                      {option.label}
                    </Text>
                  </View>
                  <Text style={[styles.userTypeDescription, { color: colors.textSecondary }]}>
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Información Personal */}
            <Input
              label="Nombre completo"
              value={form.fullName}
              onChangeText={(fullName) => setForm({ ...form, fullName })}
              placeholder="Tu nombre completo"
              error={errors.fullName}
            />

            <Input
              label="Email"
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Teléfono (opcional)"
              value={form.phone}
              onChangeText={(phone) => setForm({ ...form, phone })}
              placeholder="+57 300 123 4567"
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <Input
              label="Contraseña"
              value={form.password}
              onChangeText={(password) => setForm({ ...form, password })}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              error={errors.password}
            />

            <Input
              label="Confirmar contraseña"
              value={form.confirmPassword}
              onChangeText={(confirmPassword) => setForm({ ...form, confirmPassword })}
              placeholder="Repite tu contraseña"
              secureTextEntry
              error={errors.confirmPassword}
            />

            {/* Intereses (solo para clientes) */}
            {form.userType === 'client' && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Intereses (opcional)
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                  Selecciona las categorías que más te interesan
                </Text>
                <View style={styles.interestsContainer}>
                  {INTEREST_OPTIONS.map((interest) => (
                    <TouchableOpacity
                      key={interest.value}
                      style={[
                        styles.interestChip,
                        {
                          borderColor: form.interests?.includes(interest.value) ? colors.primary : colors.border,
                          backgroundColor: form.interests?.includes(interest.value) ? colors.primary + '20' : 'transparent',
                        },
                      ]}
                      onPress={() => toggleInterest(interest.value)}
                    >
                      <Text style={styles.interestIcon}>{interest.icon}</Text>
                      <Text style={[
                        styles.interestLabel,
                        { color: form.interests?.includes(interest.value) ? colors.primary : colors.text }
                      ]}>
                        {interest.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Button
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />

            {/* Términos y condiciones */}
            <Text style={[styles.termsText, { color: colors.textSecondary }]}>
              Al registrarte, aceptas nuestros{' '}
              <Text style={{ color: colors.primary }}>Términos y Condiciones</Text>
              {' '}y{' '}
              <Text style={{ color: colors.primary }}>Política de Privacidad</Text>
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              ¿Ya tienes cuenta?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.linkText, { color: colors.primary }]}>
                Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.size.md,
    textAlign: 'center',
  },
  form: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  sectionSubtitle: {
    fontSize: Typography.size.sm,
    marginBottom: Spacing.md,
  },
  userTypeContainer: {
    marginBottom: Spacing.lg,
  },
  userTypeOption: {
    borderWidth: 2,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  userTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  userTypeIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  userTypeLabel: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
  },
  userTypeDescription: {
    fontSize: Typography.size.sm,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  interestIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  interestLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  registerButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  termsText: {
    fontSize: Typography.size.xs,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.size.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.size.sm,
  },
  linkText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
  },
});