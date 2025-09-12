import { BorderRadius, Spacing, Typography } from '@/constants/Design';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { VideoWithBusiness } from '@/types';
import { Image } from 'expo-image';
import React from 'react';
import {
    Dimensions,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { IconSymbol } from './icon-symbol';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = (SCREEN_WIDTH - Spacing.lg * 3) / 2;

interface SearchResultsProps {
  videos: VideoWithBusiness[];
  isLoading: boolean;
  hasMore: boolean;
  onVideoPress: (video: VideoWithBusiness) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  emptyStateMessage?: string;
}

export default function SearchResults({
  videos,
  isLoading,
  hasMore,
  onVideoPress,
  onLoadMore,
  onRefresh,
  emptyStateMessage = 'No se encontraron videos',
}: SearchResultsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderVideoItem = ({ item: video, index }: { item: VideoWithBusiness; index: number }) => (
    <TouchableOpacity
      style={[
        styles.videoItem,
        {
          backgroundColor: colors.backgroundSecondary,
          marginLeft: index % 2 === 0 ? 0 : Spacing.sm,
        },
      ]}
      onPress={() => onVideoPress(video)}
      activeOpacity={0.8}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.thumbnail_url || 'https://via.placeholder.com/300x400' }}
          style={styles.thumbnail}
          contentFit="cover"
        />
        
        {/* Duration */}
        {video.duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {formatDuration(video.duration)}
            </Text>
          </View>
        )}

        {/* Coupon Badge */}
        {video.has_active_coupon && (
          <View style={styles.couponBadge}>
            <IconSymbol name="tag" size={12} color={Colors.white} />
            <Text style={styles.couponText}>Cupón</Text>
          </View>
        )}

        {/* Play Icon Overlay */}
        <View style={styles.playOverlay}>
          <IconSymbol name="play.fill" size={20} color={Colors.white} />
        </View>
      </View>

      {/* Business Info */}
      <View style={styles.businessInfo}>
        <Image
          source={{ uri: video.business.logo_url || 'https://via.placeholder.com/24' }}
          style={styles.businessLogo}
          contentFit="cover"
        />
        <View style={styles.businessDetails}>
          <Text 
            style={[styles.businessName, { color: colors.text }]}
            numberOfLines={1}
          >
            {video.business.name}
          </Text>
          <Text 
            style={[styles.businessCategory, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {video.business.category}
          </Text>
        </View>
      </View>

      {/* Video Title */}
      <Text 
        style={[styles.videoTitle, { color: colors.text }]}
        numberOfLines={2}
      >
        {video.title}
      </Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <IconSymbol name="heart" size={14} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {formatCount(video.likes_count || 0)}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <IconSymbol name="person" size={14} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {formatCount(video.views_count || 0)}
          </Text>
        </View>
      </View>

      {/* Tags */}
      {video.tags && video.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {video.tags.slice(0, 2).map((tag, tagIndex) => (
            <Text 
              key={tagIndex} 
              style={[styles.tag, { color: Colors.primary }]}
              numberOfLines={1}
            >
              #{tag}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="magnifyingglass" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        {emptyStateMessage}
      </Text>
      <Text style={[styles.emptyStateDescription, { color: colors.textSecondary }]}>
        Intenta ajustar tus filtros de búsqueda o explorar diferentes categorías.
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <TouchableOpacity
        style={[styles.loadMoreButton, { backgroundColor: colors.backgroundSecondary }]}
        onPress={onLoadMore}
        disabled={isLoading}
      >
        <Text style={[styles.loadMoreText, { color: Colors.primary }]}>
          {isLoading ? 'Cargando...' : 'Cargar más videos'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && videos.length === 0}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        ListFooterComponent={renderFooter}
        onEndReached={hasMore ? onLoadMore : undefined}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  videoItem: {
    width: ITEM_WIDTH,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: 9 / 16, // Aspect ratio tipo TikTok
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  durationText: {
    color: Colors.white,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
  },
  couponBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  couponText: {
    color: Colors.white,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    width: 30,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  businessLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  businessDetails: {
    flex: 1,
  },
  businessName: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
  },
  businessCategory: {
    fontSize: Typography.size.xs,
    textTransform: 'capitalize',
  },
  videoTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeight.tight * Typography.size.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
  },
  tagsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  tag: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.lg,
  },
  emptyStateTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: Typography.size.md,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.size.md,
  },
  loadMoreButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
  },
  loadMoreText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.medium,
  },
});