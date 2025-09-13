import {
  getBusinessDetail,
  toggleBusinessFollow,
  type BusinessStats
} from '@/lib/business-api';
import {
  getMockBusinessById,
  getMockBusinessStats,
  isMockBusinessFollowed,
  toggleMockBusinessFollow
} from '@/lib/mock-business';
import type { BusinessWithOwner } from '@/types';
import { useCallback, useEffect, useState } from 'react';

// Flag para usar datos mock o reales
const USE_MOCK_DATA = false;

interface UseBusinessDetailState {
  business: BusinessWithOwner | null;
  videos: any[];
  stats: BusinessStats | null;
  isFollowing: boolean;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

interface UseBusinessDetailResult extends UseBusinessDetailState {
  refreshBusiness: () => Promise<void>;
  toggleFollow: () => Promise<void>;
  isOwner: boolean;
}

export const useBusinessDetail = (businessId: string, userId?: string): UseBusinessDetailResult => {
  const [state, setState] = useState<UseBusinessDetailState>({
    business: null,
    videos: [],
    stats: null,
    isFollowing: false,
    loading: true,
    error: null,
    refreshing: false
  });

  // Debug logs para identificar el problema
  console.log('🔧 useBusinessDetail - Hook initialized with:', { businessId, userId, USE_MOCK_DATA });

  // Función para cargar detalles del negocio
  const loadBusinessDetail = useCallback(async (isRefresh: boolean = false) => {
    try {
      console.log('🔄 useBusinessDetail - Loading business detail for:', businessId);
      
      setState(prev => ({
        ...prev,
        loading: !isRefresh,
        refreshing: isRefresh,
        error: null
      }));

      // Validar que businessId existe
      if (!businessId) {
        throw new Error('BusinessId is required');
      }

      if (USE_MOCK_DATA) {
        console.log('📋 useBusinessDetail - Using mock data for businessId:', businessId);
        
        // Usar datos mock
        const mockBusiness = getMockBusinessById(businessId);
        console.log('📋 useBusinessDetail - Mock business found:', mockBusiness?.name || 'NOT FOUND');
        
        if (!mockBusiness) {
          throw new Error(`Negocio con ID ${businessId} no encontrado en datos mock`);
        }

        const mockStats = userId === mockBusiness.owner_id ? getMockBusinessStats(businessId) : null;
        const mockIsFollowing = userId ? isMockBusinessFollowed(businessId) : false;

        console.log('📊 useBusinessDetail - Mock data loaded:', {
          businessName: mockBusiness.name,
          statsLoaded: !!mockStats,
          isFollowing: mockIsFollowing,
          isOwner: userId === mockBusiness.owner_id
        });

        // Mock videos para el negocio
        const mockVideos = [
          {
            id: `video-${businessId}-1`,
            title: `Video destacado de ${mockBusiness.name}`,
            thumbnail: `https://picsum.photos/300/400?random=${businessId.slice(-1)}`,
            views: Math.floor(Math.random() * 5000) + 500,
            likes: Math.floor(Math.random() * 200) + 50,
            comments: Math.floor(Math.random() * 50) + 10,
            date: '2 días'
          },
          {
            id: `video-${businessId}-2`,
            title: `Conoce más sobre ${mockBusiness.name}`,
            thumbnail: `https://picsum.photos/300/400?random=${businessId.slice(-2)}`,
            views: Math.floor(Math.random() * 3000) + 300,
            likes: Math.floor(Math.random() * 150) + 30,
            comments: Math.floor(Math.random() * 30) + 5,
            date: '5 días'
          },
          {
            id: `video-${businessId}-3`,
            title: `Lo mejor de ${mockBusiness.category}`,
            thumbnail: `https://picsum.photos/300/400?random=${businessId.slice(-3)}`,
            views: Math.floor(Math.random() * 2000) + 200,
            likes: Math.floor(Math.random() * 100) + 20,
            comments: Math.floor(Math.random() * 20) + 3,
            date: '1 semana'
          }
        ];

        console.log('✅ useBusinessDetail - Mock data successfully loaded');

        setState(prev => ({
          ...prev,
          business: mockBusiness,
          videos: mockVideos,
          stats: mockStats,
          isFollowing: mockIsFollowing,
          loading: false,
          refreshing: false,
          error: null
        }));
      } else {
        console.log('🌐 useBusinessDetail - Using Supabase API for businessId:', businessId);
        
        // Usar API real
        const businessDetail = await getBusinessDetail({ businessId, userId });
        
        console.log('✅ useBusinessDetail - Supabase data loaded:', {
          businessName: businessDetail.name,
          videosCount: businessDetail.videos?.length || 0,
          statsLoaded: !!businessDetail.stats,
          isFollowing: businessDetail.isFollowing,
          isOwner: userId === businessDetail.owner_id
        });
        
        setState(prev => ({
          ...prev,
          business: businessDetail,
          videos: businessDetail.videos || [],
          stats: businessDetail.stats || null,
          isFollowing: businessDetail.isFollowing || false,
          loading: false,
          refreshing: false,
          error: null
        }));
      }
    } catch (error) {
      console.error('❌ useBusinessDetail - Error loading business detail:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: error instanceof Error ? error.message : 'Error desconocido al cargar el negocio'
      }));
    }
  }, [businessId, userId]);

  // Función para alternar seguimiento
  const toggleFollow = useCallback(async () => {
    if (!userId || !state.business) {
      console.warn('Usuario no autenticado o negocio no cargado');
      return;
    }

    // Actualización optimista
    const previousIsFollowing = state.isFollowing;
    setState(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      business: prev.business ? {
        ...prev.business,
        followers_count: prev.isFollowing 
          ? prev.business.followers_count - 1 
          : prev.business.followers_count + 1
      } : null
    }));

    try {
      if (USE_MOCK_DATA) {
        // Usar datos mock
        const newFollowStatus = toggleMockBusinessFollow(businessId);
        setState(prev => ({
          ...prev,
          isFollowing: newFollowStatus
        }));
      } else {
        console.log('🔄 useBusinessDetail - Toggling follow via Supabase API');
        // Usar API real
        const newFollowStatus = await toggleBusinessFollow(businessId, userId);
        console.log('✅ useBusinessDetail - Follow status updated:', newFollowStatus);
        setState(prev => ({
          ...prev,
          isFollowing: newFollowStatus
        }));
      }
    } catch (error) {
      console.error('❌ useBusinessDetail - Error toggling follow:', error);
      
      // Revertir cambio optimista
      setState(prev => ({
        ...prev,
        isFollowing: previousIsFollowing,
        business: prev.business ? {
          ...prev.business,
          followers_count: previousIsFollowing 
            ? prev.business.followers_count + 1 
            : prev.business.followers_count - 1
        } : null
      }));
    }
  }, [businessId, userId, state.isFollowing, state.business]);

  // Función para refrescar datos
  const refreshBusiness = useCallback(async () => {
    await loadBusinessDetail(true);
  }, [loadBusinessDetail]);

  // Verificar si el usuario actual es el propietario del negocio
  const isOwner = userId === state.business?.owner_id;

  // Cargar datos iniciales
  useEffect(() => {
    if (businessId) {
      console.log('🚀 useBusinessDetail - Starting initial load for businessId:', businessId);
      loadBusinessDetail();
    } else {
      console.error('❌ useBusinessDetail - No businessId provided to hook');
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'ID de negocio requerido'
      }));
    }
  }, [businessId, loadBusinessDetail]);

  return {
    ...state,
    refreshBusiness,
    toggleFollow,
    isOwner
  };
};

export default useBusinessDetail;