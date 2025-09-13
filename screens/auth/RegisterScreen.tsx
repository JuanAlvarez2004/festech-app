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

// Tipos de usuario disponibles
const USER_TYPES = [
  { id: 'client', label: 'Cliente', description: 'Busco servicios' },
  { id: 'business', label: 'Negocio', description: 'Ofrezco servicios' },
];

// Categorías de intereses disponibles según la documentación de la BD
const INTEREST_CATEGORIES = [
  { id: 'gastronomia', label: 'Gastronomía', icon: 'fork.knife' },
  { id: 'hospedaje', label: 'Hospedaje', icon: 'bed.double' },
  { id: 'aventura', label: 'Aventura', icon: 'mountain.2' },
  { id: 'cultura', label: 'Cultura', icon: 'building.columns' },
  { id: 'compras', label: 'Compras', icon: 'bag' },
  { id: 'vida_nocturna', label: 'Vida Nocturna', icon: 'moon.stars' },
  { id: 'naturaleza', label: 'Naturaleza', icon: 'leaf' },
];

export default function RegisterScreen() {
  const { signUp, loading } = useAuth();
  const [step, setStep] = useState(1); // 1: datos básicos, 2: tipo usuario, 3: intereses
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userType: '' as 'client' | 'business' | '',
    interests: [] as string[],
  });

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }
      if (formData.password.length < 6) {
        Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
        return;
      }
    } else if (step === 2) {
      if (!formData.userType) {
        Alert.alert('Error', 'Por favor selecciona el tipo de usuario');
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const toggleInterest = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleRegister = async () => {
    if (formData.interests.length === 0) {
      Alert.alert('Error', 'Por favor selecciona al menos un interés');
      return;
    }

    try {
      await signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.fullName,
          user_type: formData.userType,
          interests: formData.interests,
        }
      );
      
      // Si llegamos aquí, el registro fue exitoso
      Alert.alert(
        '¡Cuenta Creada! 🎉',
        'Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.',
        [{ 
          text: 'Ir a Login', 
          onPress: () => router.replace('/auth/login' as any) 
        }]
      );
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Error al crear la cuenta';
      
      if (error.message?.includes('User already registered')) {
        errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
      } else if (error.message?.includes('confirm')) {
        errorMessage = 'Cuenta creada. Por favor revisa tu email para confirmar.';
      } else if (error.message?.includes('Password')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (error.message?.includes('email')) {
        errorMessage = 'Por favor ingresa un email válido.';
      }
      
      Alert.alert('Información', errorMessage);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((stepNumber) => (
        <View key={stepNumber} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            step >= stepNumber && styles.stepCircleActive
          ]}>
            <Text style={[
              styles.stepText,
              step >= stepNumber && styles.stepTextActive
            ]}>
              {stepNumber}
            </Text>
          </View>
          {stepNumber < 3 && (
            <View style={[
              styles.stepLine,
              step > stepNumber && styles.stepLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderBasicInfoStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Información Básica</Text>
      <Text style={styles.stepDescription}>
        Completa tus datos para crear tu cuenta
      </Text>

      <Input
        placeholder="Nombre completo"
        value={formData.fullName}
        onChangeText={(fullName) => setFormData({ ...formData, fullName })}
        leftIcon="person"
        style={styles.input}
      />

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

      <Input
        placeholder="Confirmar contraseña"
        value={formData.confirmPassword}
        onChangeText={(confirmPassword) => setFormData({ ...formData, confirmPassword })}
        secureTextEntry={true}
        leftIcon="lock"
        style={styles.input}
      />
    </View>
  );

  const renderUserTypeStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Tipo de Usuario</Text>
      <Text style={styles.stepDescription}>
        ¿Cómo quieres usar Festech?
      </Text>

      <View style={styles.userTypeContainer}>
        {USER_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.userTypeCard,
              formData.userType === type.id && styles.userTypeCardSelected
            ]}
            onPress={() => setFormData({ ...formData, userType: type.id as 'client' | 'business' })}
          >
            <Text style={[
              styles.userTypeLabel,
              formData.userType === type.id && styles.userTypeLabelSelected
            ]}>
              {type.label}
            </Text>
            <Text style={[
              styles.userTypeDescription,
              formData.userType === type.id && styles.userTypeDescriptionSelected
            ]}>
              {type.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderInterestsStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Tus Intereses</Text>
      <Text style={styles.stepDescription}>
        Selecciona las actividades que te interesan
      </Text>

      <View style={styles.interestsGrid}>
        {INTEREST_CATEGORIES.map((interest) => (
          <TouchableOpacity
            key={interest.id}
            style={[
              styles.interestCard,
              formData.interests.includes(interest.id) && styles.interestCardSelected
            ]}
            onPress={() => toggleInterest(interest.id)}
          >
            <Text style={[
              styles.interestLabel,
              formData.interests.includes(interest.id) && styles.interestLabelSelected
            ]}>
              {interest.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.selectedCount}>
        {formData.interests.length} seleccionados
      </Text>
    </View>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderBasicInfoStep();
      case 2:
        return renderUserTypeStep();
      case 3:
        return renderInterestsStep();
      default:
        return renderBasicInfoStep();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>
                Únete a la comunidad
              </Text>
            </View>

            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Content */}
            <View style={styles.contentContainer}>
              {renderCurrentStep()}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.buttonContainer}>
              {step > 1 && (
                <Button
                  title="Anterior"
                  onPress={handlePrevStep}
                  variant="outline"
                  style={styles.backButton}
                />
              )}
              
              {step < 3 ? (
                <Button
                  title="Siguiente"
                  onPress={handleNextStep}
                  style={step > 1 ? styles.nextButton : styles.button}
                  loading={loading}
                />
              ) : (
                <Button
                  title="Crear Cuenta"
                  onPress={handleRegister}
                  style={styles.nextButton}
                  loading={loading}
                />
              )}
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login' as any)}>
                <Text style={styles.loginLink}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.xl * 2,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.size.md,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    opacity: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: Colors.white,
    opacity: 1,
  },
  stepText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
  stepTextActive: {
    color: Colors.primary,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.white,
    opacity: 0.3,
    marginHorizontal: Spacing.sm,
  },
  stepLineActive: {
    opacity: 1,
  },
  contentContainer: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    flex: 1,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.gray900,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  stepDescription: {
    fontSize: Typography.size.md,
    color: Colors.gray600,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  input: {
    marginBottom: Spacing.md,
  },
  userTypeContainer: {
    gap: Spacing.md,
  },
  userTypeCard: {
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.gray200,
    backgroundColor: Colors.gray100,
  },
  userTypeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  userTypeLabel: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  userTypeLabelSelected: {
    color: Colors.primary,
  },
  userTypeDescription: {
    fontSize: Typography.size.md,
    color: Colors.gray600,
  },
  userTypeDescriptionSelected: {
    color: Colors.primary,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  interestCard: {
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray300,
    backgroundColor: Colors.gray100,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    minHeight: 50,
  },
  interestCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  interestLabel: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.medium,
    color: Colors.gray700,
    textAlign: 'center',
  },
  interestLabelSelected: {
    color: Colors.white,
  },
  selectedCount: {
    fontSize: Typography.size.sm,
    color: Colors.gray600,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  button: {
    flex: 1,
  },
  backButton: {
    flex: 0.4,
  },
  nextButton: {
    flex: 0.6,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: Typography.size.md,
    color: Colors.gray600,
  },
  loginLink: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
  },
});