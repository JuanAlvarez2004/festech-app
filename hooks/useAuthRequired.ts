import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native';

interface AuthRequiredOptions {
  showAlert?: boolean;
  redirectTo?: string;
  alertTitle?: string;
  alertMessage?: string;
}

/**
 * Hook para manejar acciones que requieren autenticación
 * Estrategia: Permitir exploración libre, requerir auth para interacciones
 */
export function useAuthRequired() {
  const { user, loading } = useAuth();

  /**
   * Verifica si el usuario está autenticado antes de ejecutar una acción
   * @param action - Función a ejecutar si está autenticado
   * @param options - Opciones de configuración
   * @returns Boolean indicando si se puede proceder
   */
  const requireAuth = useCallback(
    async (
      action?: () => void | Promise<void>,
      options: AuthRequiredOptions = {}
    ): Promise<boolean> => {
      // Si está cargando, no hacer nada
      if (loading) {
        return false;
      }

      // Si está autenticado, ejecutar la acción
      if (user) {
        if (action) {
          try {
            await action();
          } catch (error) {
            console.error('Error executing authenticated action:', error);
          }
        }
        return true;
      }

      const {
        showAlert = true,
        redirectTo = '/auth/welcome',
        alertTitle = '¡Únete a Festech!',
        alertMessage = 'Para realizar esta acción necesitas tener una cuenta. ¡Es rápido y gratis!'
      } = options;

      if (showAlert) {
        Alert.alert(
          alertTitle,
          alertMessage,
          [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {
              text: 'Registrarse',
              style: 'default',
              onPress: () => router.push('/auth/register' as any),
            },
            {
              text: 'Iniciar Sesión',
              style: 'default',
              onPress: () => router.push('/auth/login' as any),
            },
          ],
          { cancelable: true }
        );
      } else {
        router.push(redirectTo as any);
      }

      return false;
    },
    [user, loading]
  );

  /**
   * Verifica si una acción específica requiere autenticación
   * @param actionType - Tipo de acción
   * @returns Boolean indicando si requiere autenticación
   */
  const isAuthRequired = useCallback((actionType: AuthRequiredAction): boolean => {
    return AUTH_REQUIRED_ACTIONS.includes(actionType);
  }, []);

  /**
   * Obtiene el mensaje personalizado para cada tipo de acción
   */
  const getAuthMessage = useCallback((actionType: AuthRequiredAction): string => {
    const messages: Record<AuthRequiredAction, string> = {
      like: '¡Dale like a tus videos favoritos! Regístrate para interactuar con el contenido.',
      follow: 'Sigue a tus negocios favoritos para recibir notificaciones de sus nuevos videos.',
      comment: 'Comparte tu opinión y conecta con otros usuarios registrándote.',
      chat: 'Chatea directamente con los negocios para hacer consultas y reservas.',
      profile: 'Accede a tu perfil personalizado para gestionar tu actividad y favoritos.',
      business_detail: 'Explora información detallada y deja reseñas registrándote.',
      create_plan: 'Crea planes personalizados y compártelos con la comunidad.',
      buy_coupon: 'Compra cupones exclusivos con tus coins ganados por actividad.',
      review: 'Ayuda a otros usuarios compartiendo tu experiencia en los negocios.',
      save_favorite: 'Guarda tus videos favoritos en colecciones personalizadas.',
      upload_video: 'Sube contenido de tu negocio para llegar a más clientes.',
      create_business: 'Registra tu negocio y comienza a atraer clientes locales.',
      view_stats: 'Accede a las estadísticas detalladas de tu negocio.',
    };
    
    return messages[actionType] || 'Para continuar necesitas registrarte. ¡Es gratis y solo toma un minuto!';
  }, []);

  return {
    requireAuth,
    isAuthRequired,
    getAuthMessage,
    isAuthenticated: !!user,
    isLoading: loading,
  };
}

// Tipos de acciones que requieren autenticación
export type AuthRequiredAction =
  | 'like'
  | 'follow'
  | 'comment'
  | 'chat'
  | 'profile'
  | 'business_detail'
  | 'create_plan'
  | 'buy_coupon'
  | 'review'
  | 'save_favorite'
  | 'upload_video'
  | 'create_business'
  | 'view_stats';

// Lista de acciones que requieren autenticación
const AUTH_REQUIRED_ACTIONS: AuthRequiredAction[] = [
  'like',
  'follow',
  'comment',
  'chat',
  'profile',
  'business_detail',
  'create_plan',
  'buy_coupon',
  'review',
  'save_favorite',
  'upload_video',
  'create_business',
  'view_stats',
];

// Acciones que NO requieren autenticación (exploración libre)
export type PublicAction = 
  | 'view_video'
  | 'browse_feed'
  | 'search'
  | 'view_categories'
  | 'view_business_basic'
  | 'view_public_plans';