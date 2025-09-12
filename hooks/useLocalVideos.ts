import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { VideoWithBusiness } from '@/types';

const LOCAL_VIDEOS_KEY = 'festech_local_videos';

export const useLocalVideos = () => {
  const [localVideos, setLocalVideos] = useState<VideoWithBusiness[]>([]);

  const loadLocalVideos = async () => {
    try {
      const stored = await AsyncStorage.getItem(LOCAL_VIDEOS_KEY);
      if (stored) {
        const videos = JSON.parse(stored);
        setLocalVideos(videos);
      }
    } catch (error) {
      console.error('Error loading local videos:', error);
    }
  };

  const saveVideo = async (video: VideoWithBusiness) => {
    try {
      const existing = await AsyncStorage.getItem(LOCAL_VIDEOS_KEY);
      const videos = existing ? JSON.parse(existing) : [];
      
      const newVideos = [video, ...videos]; // Add to beginning
      
      await AsyncStorage.setItem(LOCAL_VIDEOS_KEY, JSON.stringify(newVideos));
      setLocalVideos(newVideos);
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  useEffect(() => {
    loadLocalVideos();
  }, []);

  return {
    localVideos,
    saveVideo,
    refreshLocalVideos: loadLocalVideos
  };
};