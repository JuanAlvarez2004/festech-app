import { useAuth } from '@/contexts/AuthContext';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

// Tabs que requieren autenticación
const AUTH_REQUIRED_TABS = [
  'clientProfile',
  'create',
  'inbox'
];

export function useTabAuthGuard(currentTab: string) {
  const { user } = useAuth();
  const { requireAuth } = useAuthRequired();
  const router = useRouter();

  useEffect(() => {
    // Si el tab requiere autenticación y no hay usuario
    if (AUTH_REQUIRED_TABS.includes(currentTab) && !user) {
      // Mostrar el dialog de autenticación requerida
      requireAuth(() => {
        // Acción después de autenticarse: quedarse en el tab actual
      });
    }
  }, [currentTab, user]);

  return {
    isAuthenticated: !!user,
    shouldShowContent: !AUTH_REQUIRED_TABS.includes(currentTab) || !!user
  };
}