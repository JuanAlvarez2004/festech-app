import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui';
import { useVideoUpload, VideoUploadData } from '@/hooks/useVideoUpload';
import { useSupabaseTest } from '@/hooks/useSupabaseTest';
import { BusinessCategory } from '@/types/database';

const { width } = Dimensions.get('window');

interface VideoUploadProps {
  businessId: string;
  onUploadComplete?: (videoId: string) => void;
}

const CATEGORIES: { id: BusinessCategory; name: string; icon: string }[] = [
  { id: 'gastronomia', name: 'Gastronomía', icon: '🍕' },
  { id: 'hospedaje', name: 'Hospedaje', icon: '🏨' },
  { id: 'aventura', name: 'Aventura', icon: '🎯' },
  { id: 'cultura', name: 'Cultura', icon: '🏛️' },
  { id: 'compras', name: 'Compras', icon: '🛍️' },
  { id: 'vida_nocturna', name: 'Vida Nocturna', icon: '🌙' },
  { id: 'naturaleza', name: 'Naturaleza', icon: '🌿' },
];

const SUGGESTED_TAGS = [
  'delicioso', 'recomendado', 'imperdible', 'auténtico', 'local',
  'familiar', 'romántico', 'aventura', 'relajante', 'único'
];

export const VideoUpload: React.FC<VideoUploadProps> = ({ businessId, onUploadComplete }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { uploadProgress, uploadVideo, resetProgress, isUploading } = useVideoUpload();
  const { testResult, testing, testConnection } = useSupabaseTest();

  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [formData, setFormData] = useState<VideoUploadData>({
    title: '',
    description: '',
    category: 'gastronomia',
    locationName: '',
    tags: [],
    allowComments: true,
  });

  const selectVideo = async () => {
    Alert.alert(
      'Seleccionar Video',
      '¿Cómo quieres agregar el video?',
      [
        {
          text: 'Video de Prueba',
          onPress: useMockVideo
        },
        {
          text: 'Grabar Video',
          onPress: recordVideo
        },
        {
          text: 'Desde Galería',
          onPress: pickFromGallery
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  const useMockVideo = () => {
    // Create a mock video for testing
    const mockVideo = {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video',
      width: 1280,
      height: 720,
      duration: 30000,
      fileSize: 5000000
    };
    
    setSelectedVideo(mockVideo as any);
    Alert.alert('Éxito', 'Video de prueba seleccionado');
  };

  const recordVideo = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Necesitamos acceso a la cámara.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedVideo(result.assets[0]);
        Alert.alert('Éxito', 'Video grabado correctamente');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo grabar el video');
    }
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu galería.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedVideo(result.assets[0]);
        Alert.alert('Éxito', 'Video seleccionado correctamente');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el video');
    }
  };

  const addTag = (tag: string) => {
    if (!formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handlePublish = async () => {
    if (!selectedVideo) {
      Alert.alert('Error', 'Selecciona un video primero.');
      return;
    }

    if (!formData.title.trim()) {
      Alert.alert('Error', 'El título es requerido.');
      return;
    }

    const result = await uploadVideo(
      selectedVideo.uri,
      null, // No thumbnail for now
      businessId,
      formData
    );

    if (result.success && result.videoId) {
      Alert.alert('¡Éxito!', 'Video publicado correctamente.', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedVideo(null);
            setFormData({
              title: '',
              description: '',
              category: 'gastronomia',
              locationName: '',
              tags: [],
              allowComments: true,
            });
            resetProgress();
            onUploadComplete?.(result.videoId);
          }
        }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Error al publicar video.');
    }
  };

  const isFormValid = selectedVideo && formData.title.trim().length > 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Crear Video</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            title="Test DB"
            onPress={testConnection}
            disabled={testing}
            loading={testing}
            size="sm"
            variant="outline"
          />
          <Button
            title="Publicar"
            onPress={handlePublish}
            disabled={!isFormValid || isUploading}
            loading={isUploading}
            size="sm"
          />
        </View>
      </View>



      {/* Progress Bar */}
      {isUploading && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: colors.primary,
                  width: `${uploadProgress.progress}%`
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {uploadProgress.message}
          </Text>
        </View>
      )}

      {/* Video Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Video</Text>
        
        {!selectedVideo ? (
          <TouchableOpacity 
            style={[styles.videoSelector, { borderColor: colors.border }]}
            onPress={selectVideo}
          >
            <Ionicons name="videocam" size={48} color={colors.textSecondary} />
            <Text style={[styles.videoSelectorText, { color: colors.textSecondary }]}>
              Agregar video
            </Text>
            <Text style={[styles.videoSelectorSubtext, { color: colors.textSecondary }]}>
              Grabar o seleccionar desde galería
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.videoPreview}>
            <View style={[styles.videoPlaceholder, { backgroundColor: colors.card }]}>
              <Ionicons name="checkmark-circle" size={48} color={colors.primary} />
              <Text style={[styles.videoSelectedText, { color: colors.text }]}>
                Video seleccionado
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.changeVideoButton, { backgroundColor: colors.primary }]}
              onPress={selectVideo}
            >
              <Text style={styles.changeVideoText}>Cambiar video</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Form Fields */}
      <>
          {/* Title */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Título *
            </Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="Describe tu video en pocas palabras..."
              placeholderTextColor={colors.textSecondary}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              maxLength={100}
            />
            <Text style={[styles.charCount, { color: colors.textSecondary }]}>
              {formData.title.length}/100
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Descripción
            </Text>
            <TextInput
              style={[styles.textArea, { borderColor: colors.border, color: colors.text }]}
              placeholder="Cuéntanos más detalles sobre tu negocio..."
              placeholderTextColor={colors.textSecondary}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
              maxLength={300}
            />
            <Text style={[styles.charCount, { color: colors.textSecondary }]}>
              {formData.description?.length || 0}/300
            </Text>
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Categoría
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoriesContainer}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      { 
                        backgroundColor: formData.category === category.id 
                          ? colors.primary 
                          : colors.card,
                        borderColor: colors.border
                      }
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text 
                      style={[
                        styles.categoryText,
                        { 
                          color: formData.category === category.id 
                            ? '#FFFFFF' 
                            : colors.text
                        }
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Ubicación
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.inputWithIcon, { color: colors.text }]}
                placeholder="Ej: Centro de Ibagué"
                placeholderTextColor={colors.textSecondary}
                value={formData.locationName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, locationName: text }))}
              />
            </View>
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Etiquetas
            </Text>
            
            {/* Selected Tags */}
            {formData.tags && formData.tags.length > 0 && (
              <View style={styles.selectedTags}>
                {formData.tags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.selectedTag, { backgroundColor: colors.primary }]}
                    onPress={() => removeTag(tag)}
                  >
                    <Text style={styles.selectedTagText}>{tag}</Text>
                    <Ionicons name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Suggested Tags */}
            <Text style={[styles.suggestedTitle, { color: colors.textSecondary }]}>
              Sugeridas:
            </Text>
            <View style={styles.suggestedTags}>
              {SUGGESTED_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.suggestedTag,
                    { 
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      opacity: formData.tags?.includes(tag) ? 0.5 : 1
                    }
                  ]}
                  onPress={() => addTag(tag)}
                  disabled={formData.tags?.includes(tag)}
                >
                  <Text style={[styles.suggestedTagText, { color: colors.text }]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Database Test Results */}
          {testResult && (
            <View style={[styles.tipsContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.tipsTitle, { color: colors.text }]}>
                🔍 Resultado de Prueba
              </Text>
              <Text style={[styles.tipsText, { color: colors.textSecondary }]}>
                {testResult}
              </Text>
            </View>
          )}

          {/* Tips */}
          <View style={[styles.tipsContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.tipsTitle, { color: colors.text }]}>
              💡 Consejos para un buen video
            </Text>
            <Text style={[styles.tipsText, { color: colors.textSecondary }]}>
              • Graba en vertical para mejor visualización{'\n'}
              • Muestra lo mejor de tu negocio{'\n'}
              • Usa buena iluminación{'\n'}
              • Mantén el video corto y atractivo
            </Text>
          </View>
      </>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60, // Espacio para la barra de notificaciones
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  videoSelector: {
    height: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoSelectorText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
  },
  videoSelectorSubtext: {
    fontSize: 12,
    marginTop: 5,
  },
  videoPreview: {
    alignItems: 'center',
  },
  videoPlaceholder: {
    width: width - 40,
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoSelectedText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
  },
  changeVideoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  changeVideoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputWithIcon: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginRight: 4,
  },
  suggestedTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  suggestedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestedTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestedTagText: {
    fontSize: 12,
  },
  tipsContainer: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 12,
    lineHeight: 18,
  },
});