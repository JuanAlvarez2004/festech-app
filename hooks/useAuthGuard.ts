import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

type ActionType = 'contact' | 'like' | 'follow' | 'general';

export function useAuthGuard() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title?: string;
    message?: string;
    actionType: ActionType;
  }>({
    actionType: 'general',
  });

  const requireAuth = (
    callback: () => void,
    config?: {
      title?: string;
      message?: string;
      actionType?: ActionType;
    }
  ) => {
    if (user) {
      callback();
    } else {
      setModalConfig({
        title: config?.title,
        message: config?.message,
        actionType: config?.actionType || 'general',
      });
      setShowAuthModal(true);
    }
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return {
    requireAuth,
    showAuthModal,
    closeAuthModal,
    modalConfig,
    isAuthenticated: !!user,
    user,
  };
}