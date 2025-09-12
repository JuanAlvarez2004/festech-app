import { router } from 'expo-router';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Loading, VideoCard } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useVideosFromSupabase } from '@/hooks/useVideosFromSupabase';
import { useLocalVideos } from '@/hooks/useLocalVideos';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { VideoWithBusiness } from '@/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Datos de ejemplo para el feed (reemplazar con datos reales de Supabase)
const MOCK_VIDEOS: VideoWithBusiness[] = [
  {
    id: '1',
    business_id: 'biz1',
    title: 'El mejor café de Ibagué ☕',
    description: '¡Ven a probar nuestro café de especialidad! Recién tostado todas las mañanas. #café #ibagué #especialidad',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail_url: 'https://picsum.photos/400/600?random=1',
    duration: 25,
    tags: ['café', 'ibagué', 'especialidad'],
    location_name: 'Café Central Ibagué',
    location_lat: 4.4389,
    location_lng: -75.2322,
    views_count: 1250,
    likes_count: 89,
    is_active: true,
    created_at: '2024-01-15T10:30:00Z',
    business: {
      id: 'biz1',
      owner_id: 'user1',
      name: 'Café Central Ibagué',
      category: 'gastronomia',
      description: 'El mejor café de especialidad',
      logo_url: 'https://picsum.photos/50/50?random=1',
      rating_average: 4.5,
      total_reviews: 23,
      followers_count: 156,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
    },
    liked: false,
    likesCount: 89,
  },
  {
    id: '2',
    business_id: 'biz2',
    title: 'Aventura extrema en el Tolima 🏔️',
    description: 'Vive la adrenalina al máximo con nuestros deportes extremos. ¡Una experiencia única en el corazón del Tolima! #aventura #extremo #tolima',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_url: 'https://picsum.photos/400/600?random=2',
    duration: 30,
    tags: ['aventura', 'extremo', 'tolima'],
    location_name: 'Cordillera Central',
    location_lat: 4.5000,
    location_lng: -75.3000,
    views_count: 2100,
    likes_count: 156,
    is_active: true,
    created_at: '2024-01-14T15:45:00Z',
    business: {
      id: 'biz2',
      owner_id: 'user2',
      name: 'Aventuras Tolima',
      category: 'aventura',
      description: 'Deportes extremos y aventura',
      logo_url: 'https://picsum.photos/50/50?random=2',
      rating_average: 4.8,
      total_reviews: 45,
      followers_count: 320,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
    },
    liked: true,
    likesCount: 156,
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { videos: supabaseVideos, loading: videosLoading, error: videosError, refreshVideos } = useVideosFromSupabase();
  const { localVideos, refreshLocalVideos } = useLocalVideos();
  const [videos, setVideos] = useState<VideoWithBusiness[]>([]);

  // Combine Supabase videos with local and mock data, avoiding duplicates
  useEffect(() => {
    if (supabaseVideos.length > 0) {
      // Remove duplicates by ID
      const allVideos = [...supabaseVideos, ...localVideos, ...MOCK_VIDEOS];
      const uniqueVideos = allVideos.filter((video, index, self) => 
        index === self.findIndex(v => v.id === video.id)
      );
      setVideos(uniqueVideos);
    } else if (!videosLoading) {
      console.warn('Using local + mock data:', videosError || 'No videos from Supabase');
      setVideos([...localVideos, ...MOCK_VIDEOS]);
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

  // Acciones de video
  const handleLike = (videoId: string) => {
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
  };

  const handleShare = (video: VideoWithBusiness) => {
    Alert.alert(
      'Compartir Video',
      `¿Quieres compartir "${video.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Compartir', onPress: () => console.log('Compartir video:', video.id) },
      ]
    );
  };

  const handleComment = (video: VideoWithBusiness) => {
    Alert.alert('Comentarios', 'Próximamente: Sistema de comentarios');
  };

  const handleBusinessPress = (video: VideoWithBusiness) => {
    // Usar la ruta del tab businessDetail
    router.push('/(tabs)/businessDetail' as any);
  };

  const handleUserPress = (video: VideoWithBusiness) => {
    // Usar la ruta del tab clientProfile
    router.push('/(tabs)/clientProfile' as any);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshLocalVideos();
      await refreshVideos();
    } catch (error) {
      console.error('Error refreshing videos:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderVideoItem = ({ item, index }: { item: VideoWithBusiness; index: number }) => (
    <VideoCard
      video={item}
      isActive={index === currentIndex}
      onLike={() => handleLike(item.id)}
      onShare={() => handleShare(item)}
      onComment={() => handleComment(item)}
      onBusinessPress={() => handleBusinessPress(item)}
      onUserPress={() => handleUserPress(item)}
    />
  );



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
      
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT} // Altura completa de la pantalla
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
});
