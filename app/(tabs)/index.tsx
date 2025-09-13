import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Loading, VideoCard } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalVideos } from '@/hooks/useLocalVideos';
import { useVideosFromSupabase } from '@/hooks/useVideosFromSupabase';

import type { VideoWithBusiness } from '@/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { videos: supabaseVideos, loading: videosLoading, error: videosError, refreshVideos } = useVideosFromSupabase();
  const { localVideos, refreshLocalVideos } = useLocalVideos();
  const [videos, setVideos] = useState<VideoWithBusiness[]>([]);

  // Combine Supabase videos with local data, avoiding duplicates
  useEffect(() => {
    console.log('Videos state update:', { 
      supabaseCount: supabaseVideos.length, 
      localCount: localVideos.length,
      loading: videosLoading,
      error: videosError 
    });

    // Always combine Supabase and local videos
    const allVideos = [...supabaseVideos, ...localVideos];
    const uniqueVideos = allVideos.filter((video, index, self) => 
      index === self.findIndex(v => v.id === video.id)
    );
    
    setVideos(uniqueVideos);
    
    if (uniqueVideos.length === 0 && !videosLoading) {
      console.warn('No videos available from any source');
    }
  }, [supabaseVideos, videosLoading, videosError, localVideos]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Manejar cambio de video visible
  const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // Acciones de video memoizadas
  const handleLike = useCallback((videoId: string) => {
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              liked: !video.liked,
              likes_count: video.liked ? video.likes_count - 1 : video.likes_count + 1 
            }
          : video
      )
    );
  }, []);

  const handleShare = useCallback((video: VideoWithBusiness) => {
    Alert.alert(
      'Compartir Video',
      `¿Quieres compartir "${video.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Compartir', onPress: () => console.log('Compartir video:', video.id) },
      ]
    );
  }, []);

  const handleComment = useCallback((video: VideoWithBusiness) => {
    Alert.alert('Comentarios', 'Próximamente: Sistema de comentarios');
  }, []);

  const handleBusinessPress = useCallback((video: VideoWithBusiness) => {
    // Navegar a la pantalla de detalle del negocio
    router.push(`/businessDetail?businessId=${video.business.id}` as any);
  }, []);

  const handleUserPress = useCallback((video: VideoWithBusiness) => {
    // Usar la ruta del tab clientProfile
    router.push('/(tabs)/clientProfile' as any);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshLocalVideos();
      await refreshVideos();
    } catch (error) {
      console.error('Error refreshing videos:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshLocalVideos, refreshVideos]);

  const renderVideoItem = useCallback(({ item, index }: { item: VideoWithBusiness; index: number }) => (
    <VideoCard
      video={item}
      isActive={index === currentIndex}
      onLike={() => handleLike(item.id)}
      onShare={() => handleShare(item)}
      onComment={() => handleComment(item)}
      onBusinessPress={() => handleBusinessPress(item)}
      onUserPress={() => handleUserPress(item)}
    />
  ), [currentIndex, handleLike, handleShare, handleComment, handleBusinessPress, handleUserPress]);

  const keyExtractor = useCallback((item: VideoWithBusiness) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: SCREEN_HEIGHT,
    offset: SCREEN_HEIGHT * index,
    index,
  }), []);



  // Si no hay usuario autenticado, mostrar pantalla de bienvenida
  // if (!user) {
  //   return (
  //     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
  //       <Loading fullScreen text="Redirigiendo..." />
  //     </SafeAreaView>
  //   );
  // }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {videosLoading && videos.length === 0 ? (
        <Loading fullScreen text="Cargando videos desde la base de datos..." />
      ) : videos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay videos disponibles</Text>
          <Text style={styles.emptySubtext}>
            {videosError 
              ? 'Error de conexión. Verifica tu internet e intenta de nuevo.' 
              : 'Sé el primero en subir un video. ¡Desliza para actualizar!'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={keyExtractor}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={SCREEN_HEIGHT} // Altura completa de la pantalla
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          maxToRenderPerBatch={3}
          initialNumToRender={2}
          windowSize={5}
          updateCellsBatchingPeriod={100}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  emptyText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: Colors.white,
    fontSize: 14,
    opacity: 0.7,
  },
});
