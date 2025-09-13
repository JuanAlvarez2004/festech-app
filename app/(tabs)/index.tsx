import { router } from 'expo-router';
import React, { useCallback, useRef } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import { useVideos } from '@/hooks/useVideos';
import type { VideoWithBusiness } from '@/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, loading } = useAuth();
  const { requireAuth } = useAuthRequired();
  const flatListRef = useRef<FlatList>(null);
  
  // Usar el hook de videos con todas las funcionalidades
  const {
    videos,
    loading: loadingVideos,
    refreshing,
    loadingMore,
    error,
    hasMore,
    currentIndex,
    setCurrentIndex,
    handleRefresh,
    handleLoadMore,
    handleLike,
    handleVideoView
  } = useVideos({ 
    userId: user?.id,
    limit: 10 
  });

  // Manejar cambio de video visible
  const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index || 0;
      setCurrentIndex(newIndex);
      
      // Incrementar vistas del video actual
      const currentVideo = videos[newIndex];
      if (currentVideo) {
        handleVideoView(currentVideo.id);
      }
    }
  }, [videos, setCurrentIndex, handleVideoView]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // Acciones de video
  const handleLikeWithAuth = (videoId: string) => {
    requireAuth(() => {
      handleLike(videoId);
    });
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
    requireAuth(() => {
      Alert.alert('Comentarios', 'Próximamente: Sistema de comentarios');
    });
  };

  const handleBusinessPress = (video: VideoWithBusiness) => {
    // Navegar a businessDetail pasando el businessId como parámetro
    router.push({
      pathname: '/(tabs)/businessDetail',
      params: { businessId: video.business.id }
    });
  };

  const handleUserPress = (video: VideoWithBusiness) => {
    // Usar la ruta del tab clientProfile
    router.push('/(tabs)/clientProfile' as any);
  };

  const renderVideoItem = ({ item, index }: { item: VideoWithBusiness; index: number }) => (
    <VideoCard
      video={item}
      isActive={index === currentIndex}
      onLike={() => handleLikeWithAuth(item.id)}
      onShare={() => handleShare(item)}
      onComment={() => handleComment(item)}
      onBusinessPress={() => handleBusinessPress(item)}
      onUserPress={() => handleUserPress(item)}
    />
  );

  if (loading || loadingVideos) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Loading fullScreen text="Cargando videos..." />
      </SafeAreaView>
    );
  }

  if (error && videos.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Loading fullScreen text={`Error: ${error}`} />
      </SafeAreaView>
    );
  }

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
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
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
