import { VideoUpload } from '@/components/VideoUpload';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { View } from 'react-native';

// ID estático del negocio demo creado en Supabase
const DEMO_BUSINESS_ID = '1b7521e7-5203-499a-8cdc-257dfb25a46e';

export default function CreateScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleUploadComplete = (videoId: string) => {
    console.log('✅ Video subido exitosamente:', videoId);
    console.log('🏢 Business ID usado:', DEMO_BUSINESS_ID);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <VideoUpload 
        businessId={DEMO_BUSINESS_ID}
        onUploadComplete={handleUploadComplete}
      />
    </View>
  );
}
