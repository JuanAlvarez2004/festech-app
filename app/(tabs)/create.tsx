import { VideoUpload } from '@/components/VideoUpload';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { View } from 'react-native';

export default function CreateScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleUploadComplete = (videoId: string) => {
    console.log('Video uploaded successfully:', videoId);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <VideoUpload 
        businessId="550e8400-e29b-41d4-a716-446655440000"
        onUploadComplete={handleUploadComplete}
      />
    </View>
  );
}
