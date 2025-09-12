import { BorderRadius, Spacing, Typography } from '@/constants/Design';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { VideoWithBusiness } from '@/types';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { IconSymbol } from './icon-symbol';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoCardProps {
  video: VideoWithBusiness;
  isActive: boolean;
  onLike: () => void;
  onShare: () => void;
  onComment: () => void;
  onBusinessPress: () => void;
  onUserPress: () => void;
}

export default function VideoCard({
  video,
  isActive,
  onLike,
  onShare,
  onComment,
  onBusinessPress,
  onUserPress,
}: VideoCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showControls, setShowControls] = useState(false);
  const likeAnimation = useRef(new Animated.Value(1)).current;

  // Configurar el reproductor de video con la nueva API
  const player = useVideoPlayer(video.video_url, player => {
    player.loop = true;
    player.muted = false;
  });

  // Reproducir/pausar video basado en si está activo
  React.useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  const handleVideoPress = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
    setShowControls(true);
    setTimeout(() => setShowControls(false), 2000);
  };

  const handleLike = () => {
    // Animación del like
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    onLike();
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <View style={styles.container}>
      {/* Video */}
      <TouchableOpacity 
        style={styles.videoContainer} 
        activeOpacity={1}
        onPress={handleVideoPress}
      >
        <VideoView
          style={styles.video}
          player={player}
          allowsPictureInPicture={false}
          contentFit="cover"
        />

        {/* Play/Pause Overlay */}
        {showControls && (
          <View style={styles.playOverlay}>
            <IconSymbol
              name={player.playing ? 'pause.fill' : 'play.fill'}
              size={60}
              color="rgba(255, 255, 255, 0.8)"
            />
          </View>
        )}
      </TouchableOpacity>

      {/* Bottom Gradient */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.bottomGradient}
      />

      {/* Right Actions */}
      <View style={styles.rightActions}>
        {/* Business Avatar */}
        <TouchableOpacity onPress={onBusinessPress} style={styles.avatarContainer}>
          <Image
            source={{ uri: video.business.logo_url || 'https://via.placeholder.com/50' }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={styles.followButton}>
            <IconSymbol name="plus" size={12} color={Colors.white} />
          </View>
        </TouchableOpacity>

        {/* Like */}
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
            <IconSymbol
              name={video.liked ? 'heart.fill' : 'heart'}
              size={32}
              color={video.liked ? Colors.error : Colors.white}
            />
          </Animated.View>
          <Text style={styles.actionText}>
            {formatCount(video.likes_count || 0)}
          </Text>
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity onPress={onComment} style={styles.actionButton}>
          <IconSymbol name="message" size={32} color={Colors.white} />
          <Text style={styles.actionText}>0</Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity onPress={onShare} style={styles.actionButton}>
          <IconSymbol name="arrowshape.turn.up.right" size={32} color={Colors.white} />
          <Text style={styles.actionText}>Compartir</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Info */}
      <View style={styles.bottomInfo}>
        {/* Business Info */}
        <TouchableOpacity onPress={onBusinessPress} style={styles.businessInfo}>
          <Text style={styles.businessName}>@{video.business.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{video.business.category}</Text>
          </View>
        </TouchableOpacity>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {video.description}
        </Text>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {video.tags.slice(0, 3).map((tag, index) => (
              <Text key={index} style={styles.tag}>
                #{tag}
              </Text>
            ))}
          </View>
        )}

        {/* Location */}
        {video.location_name && (
          <View style={styles.locationContainer}>
            <IconSymbol name="location" size={14} color={Colors.white} />
            <Text style={styles.locationText}>{video.location_name}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - (Platform.OS === 'ios' ? 160 : 140), // Resta altura de tabs y status bar
    backgroundColor: Colors.black,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  rightActions: {
    position: 'absolute',
    right: Spacing.md,
    bottom: 100,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  followButton: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  actionText: {
    color: Colors.white,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    marginTop: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.md,
    right: 80, // Espacio para los botones de la derecha
  },
  businessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  businessName: {
    color: Colors.white,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  categoryText: {
    color: Colors.white,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
  },
  description: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    lineHeight: Typography.lineHeight.normal * Typography.size.sm,
    marginBottom: Spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  tag: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    marginRight: Spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: Colors.white,
    fontSize: Typography.size.xs,
    marginLeft: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});