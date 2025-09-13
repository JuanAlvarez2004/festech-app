import { getMockVideos, simulateNetworkDelay } from '@/lib/mock-videos';
import { getVideosWithBusiness, incrementVideoViews, toggleVideoLike } from '@/lib/videos-api';
import type { VideoWithBusiness } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

// Configuración para usar datos de prueba o reales
const USE_MOCK_DATA = true; // Cambiar a false cuando tengas datos reales en Supabase

interface UseVideosOptions {
  limit?: number;
  category?: string;
  businessId?: string;
  userId?: string;
}

interface UseVideosReturn {
  videos: VideoWithBusiness[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  handleRefresh: () => Promise<void>;
  handleLoadMore: () => Promise<void>;
  handleLike: (videoId: string) => Promise<void>;
  handleVideoView: (videoId: string) => void;
  refresh: () => void;
  loadMore: () => void;
  likeVideo: (videoId: string) => Promise<void>;
}

export function useVideos(options: UseVideosOptions = {}): UseVideosReturn {
  const { limit = 10, category, businessId, userId } = options;
  
  const [videos, setVideos] = useState<VideoWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cargar videos iniciales
  const loadInitialVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        await simulateNetworkDelay(800);
        const mockResponse = getMockVideos(1, limit);
        setVideos(mockResponse.data);
        setHasMore(mockResponse.hasMore);
        setPage(1);
      } else {
        const response = await getVideosWithBusiness({
          page: 1,
          limit,
          userId,
          category
        });
        setVideos(response.data);
        setHasMore(response.hasMore);
        setPage(1);
      }
    } catch (err) {
      console.error('Error cargando videos:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar videos');
    } finally {
      setLoading(false);
    }
  }, [userId, limit, category]);

  // Cargar más videos (paginación)
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loadingMore || loading) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      if (USE_MOCK_DATA) {
        await simulateNetworkDelay(500);
        const mockResponse = getMockVideos(nextPage, limit);
        if (mockResponse.data.length > 0) {
          setVideos(prev => [...prev, ...mockResponse.data]);
          setHasMore(mockResponse.hasMore);
          setPage(nextPage);
        }
      } else {
        const response = await getVideosWithBusiness({
          page: nextPage,
          limit,
          userId,
          category
        });
        if (response.data.length > 0) {
          setVideos(prev => [...prev, ...response.data]);
          setHasMore(response.hasMore);
          setPage(nextPage);
        }
      }
    } catch (err) {
      console.error('Error cargando más videos:', err);
      Alert.alert('Error', 'No se pudieron cargar más videos');
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, loading, page, limit, userId, category]);

  // Refrescar videos
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (USE_MOCK_DATA) {
        await simulateNetworkDelay(800);
        const mockResponse = getMockVideos(1, limit);
        setVideos(mockResponse.data);
        setHasMore(mockResponse.hasMore);
        setPage(1);
      } else {
        const response = await getVideosWithBusiness({
          page: 1,
          limit,
          userId,
          category
        });
        setVideos(response.data);
        setHasMore(response.hasMore);
        setPage(1);
      }
      setError(null);
    } catch (err) {
      console.error('Error al refrescar:', err);
      setError(err instanceof Error ? err.message : 'Error al refrescar videos');
    } finally {
      setRefreshing(false);
    }
  }, [limit, userId, category]);

  // Manejar like/unlike
  const handleLike = useCallback(async (videoId: string) => {
    if (!userId) {
      Alert.alert('Inicia sesión', 'Necesitas iniciar sesión para dar like a los videos');
      return;
    }

    try {
      // Optimistic update
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video.id === videoId 
            ? { 
                ...video, 
                liked: !video.liked,
                likes_count: video.liked ? video.likes_count - 1 : video.likes_count + 1,
                likesCount: video.liked ? (video.likesCount || 0) - 1 : (video.likesCount || 0) + 1
              }
            : video
        )
      );

      if (!USE_MOCK_DATA) {
        await toggleVideoLike(videoId, userId);
      }
    } catch (error) {
      console.error('Error al dar like:', error);
      // Revertir optimistic update en caso de error
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video.id === videoId 
            ? { 
                ...video, 
                liked: !video.liked,
                likes_count: video.liked ? video.likes_count + 1 : video.likes_count - 1,
                likesCount: video.liked ? (video.likesCount || 0) + 1 : (video.likesCount || 0) - 1
              }
            : video
        )
      );
      Alert.alert('Error', 'No se pudo actualizar el like');
    }
  }, [userId]);

  // Manejar visualización de video
  const handleVideoView = useCallback((videoId: string) => {
    if (!USE_MOCK_DATA) {
      incrementVideoViews(videoId).catch(err => 
        console.error('Error incrementando vistas:', err)
      );
    }
  }, []);

  // Métodos de compatibilidad con la implementación anterior
  const loadMore = useCallback(() => {
    handleLoadMore();
  }, [handleLoadMore]);

  const refresh = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  const likeVideo = useCallback((videoId: string) => {
    return handleLike(videoId);
  }, [handleLike]);

  // Cargar videos iniciales al montar el componente
  useEffect(() => {
    loadInitialVideos();
  }, [loadInitialVideos]);

  return {
    videos,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    page,
    currentIndex,
    setCurrentIndex,
    handleRefresh,
    handleLoadMore,
    handleLike,
    handleVideoView,
    refresh,
    loadMore,
    likeVideo
  };
}