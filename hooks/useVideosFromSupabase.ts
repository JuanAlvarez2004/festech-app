import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { VideoWithBusiness } from '@/types';

export const useVideosFromSupabase = () => {
  const [videos, setVideos] = useState<VideoWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVideos = async () => {
    try {
      const { data, error: queryError } = await supabase
        .from('videos')
        .select(`
          *,
          business:businesses(
            id,
            owner_id,
            name,
            category,
            description,
            logo_url,
            rating_average,
            total_reviews,
            followers_count,
            is_active,
            created_at
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (queryError) throw queryError;

      const transformedVideos: VideoWithBusiness[] = (data || []).map(video => ({
        ...video,
        liked: false,
        likesCount: video.likes_count,
        business: video.business
      }));

      setVideos(transformedVideos);
      setError(null);
    } catch (err) {
      console.error('Error loading videos:', err);
      setError(err instanceof Error ? err.message : 'Error loading videos');
    } finally {
      setLoading(false);
    }
  };

  const refreshVideos = async () => {
    await loadVideos();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('No connection - using fallback');
    }, 3000);

    loadVideos().then(() => {
      clearTimeout(timeoutId);
    });

    return () => clearTimeout(timeoutId);
  }, []);

  return {
    videos,
    loading,
    error,
    refreshVideos
  };
};