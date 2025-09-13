import { supabase } from '@/lib/supabase';
import type { VideoWithBusiness } from '@/types';
import { useEffect, useState } from 'react';

export const useVideosFromSupabase = () => {
  const [videos, setVideos] = useState<VideoWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVideos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Querying Supabase for videos...');
      
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

      if (queryError) {
        console.warn('❌ Supabase query error:', queryError);
        throw queryError;
      }

      if (!data || data.length === 0) {
        console.log('📭 No videos found in Supabase database');
        setVideos([]);
        setError(null); // Clear error when successfully queried but no data
        return;
      }

      const transformedVideos: VideoWithBusiness[] = (data || []).map(video => {
        // Validate business data
        if (!video.business || Array.isArray(video.business)) {
          console.warn(`⚠️ Video ${video.id} has invalid business data`);
          return null;
        }
        
        return {
          ...video,
          liked: false,
          likesCount: video.likes_count || 0,
          business: video.business
        };
      }).filter(Boolean) as VideoWithBusiness[];

      console.log(`✅ Successfully loaded ${transformedVideos.length} videos from Supabase`);
      setVideos(transformedVideos);
      setError(null);
    } catch (err) {
      console.error('❌ Error loading videos from Supabase:', err);
      setError(err instanceof Error ? err.message : 'Error loading videos from database');
      setVideos([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const refreshVideos = async () => {
    await loadVideos();
  };

  useEffect(() => {
    console.log('🔄 Starting video load from Supabase...');
    
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Connection timeout - check your internet connection');
        console.warn('⏰ Supabase connection timeout');
      }
    }, 5000); // Increased timeout to 5 seconds

    loadVideos().then(() => {
      clearTimeout(timeoutId);
    }).catch((err) => {
      clearTimeout(timeoutId);
      console.error('❌ Failed to load videos:', err);
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