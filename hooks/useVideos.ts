import { supabase } from '@/lib/supabase';
import type { VideoWithBusiness } from '@/types';
import { useEffect, useState } from 'react';

interface UseVideosOptions {
  limit?: number;
  category?: string;
  businessId?: string;
}

export function useVideos(options: UseVideosOptions = {}) {
  const [videos, setVideos] = useState<VideoWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const { limit = 20, category, businessId } = options;

  const fetchVideos = async (offset = 0) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('videos')
        .select(`
          *,
          business:businesses(
            id,
            name,
            category,
            logo_url,
            rating_average,
            total_reviews,
            followers_count
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Aplicar filtros
      if (category) {
        query = query.eq('business.category', category);
      }

      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const videosWithBusiness: VideoWithBusiness[] = data.map(video => ({
        ...video,
        liked: false, // TODO: Verificar si el usuario ya dio like
        likesCount: video.likes_count,
      }));

      if (offset === 0) {
        setVideos(videosWithBusiness);
      } else {
        setVideos(prev => [...prev, ...videosWithBusiness]);
      }

      setHasMore(data.length === limit);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchVideos(videos.length);
    }
  };

  const refresh = () => {
    setVideos([]);
    fetchVideos(0);
  };

  const likeVideo = async (videoId: string) => {
    // TODO: Implementar like en Supabase
    setVideos(prev =>
      prev.map(video =>
        video.id === videoId
          ? {
              ...video,
              liked: !video.liked,
              likes_count: video.liked ? video.likes_count - 1 : video.likes_count + 1,
            }
          : video
      )
    );
  };

  useEffect(() => {
    fetchVideos(0);
  }, [category, businessId]);

  return {
    videos,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    likeVideo,
  };
}