import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';
import { Spacing, Typography } from '@/constants/Design';
import { Colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    router.push('/auth/login' as any);
  };

  const handleSignUp = () => {
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
        {/* Logo y Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>🌿</Text>
            <Text style={styles.appName}>Festech</Text>
          </View>
          
          <Text style={styles.tagline}>
            Descubre los mejores negocios del Tolima
          </Text>
          
          <Text style={styles.description}>
            Videos auténticos, experiencias únicas y conexiones reales con los emprendedores locales
          </Text>
        </View>

        {/* Illustration/Image */}
        <View style={styles.illustrationContainer}>
          {/* Aquí puedes agregar una ilustración o imagen */}
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📱</Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomSection}>
          <Button
            title="Comenzar"
            onPress={handleGetStarted}
            variant="secondary"
            size="lg"
            fullWidth
            style={styles.primaryButton}
          />
          
          <Button
            title="¿Ya tienes cuenta? Inicia sesión"
            onPress={handleSignUp}
            variant="ghost"
            size="md"
            fullWidth
            style={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}
          />
        </View>
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
    paddingHorizontal: Spacing.lg,
  },
  heroSection: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoText: {
    fontSize: 60,
    marginBottom: Spacing.sm,
  },
  appName: {
    fontSize: Typography.size.display,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
    textAlign: 'center',
  },
  tagline: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.semibold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.size.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.size.md,
    paddingHorizontal: Spacing.md,
  },
  illustrationContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
  },
  bottomSection: {
    flex: 0.3,
    justifyContent: 'flex-end',
    paddingBottom: Spacing.xl,
  },
  primaryButton: {
    marginBottom: Spacing.md,
  },
  secondaryButton: {
    marginTop: Spacing.sm,
  },
  secondaryButtonText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
  },
});