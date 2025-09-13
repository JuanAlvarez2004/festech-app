import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  BarChart3,
  Edit3,
  Eye,
  Facebook,
  Heart,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Settings,
  Star,
  Upload,
  Users
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Loading } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBusinessDetail } from '@/hooks/useBusinessDetail';
import { useConversations } from '@/hooks/useConversations';
import type { VideoWithBusiness } from '@/types';

interface BusinessDetailProps {
  onBack: () => void;
  onChat: () => void;
  onReviews?: () => void;
  onContentUpload?: () => void;
  onContentManager?: () => void;
  isOwnerView?: boolean; // Para distinguir si es el dueño viendo su perfil
}

type TabType = 'videos' | 'info' | 'reviews' | 'stats';

interface MockVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  date: string;
}

interface Review {
  id: string;
  user: {
    name: string;
    isVerified: boolean;
  };
  rating: number;
  comment: string;
  date: string;
}

interface BusinessData {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  cover: string;
  rating: number;
  totalReviews: number;
  followers: number;
  isVerified: boolean;
  address: string;
  phone: string;
  whatsapp: string;
  hours: { [key: string]: string };
  services: string[];
  priceRange: string;
  social: {
    instagram: string;
    facebook: string;
  };
  // 🎮 Gamificación para empresarios
  businessLevel: number;
  businessExperience: number;
  businessExperienceToNext: number;
  totalViews: number;
  totalEngagement: number;
  badges: string[];
  streak: number; // Días consecutivos con actividad
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  monthlyTarget: {
    views: number;
    followers: number;
    engagement: number;
  };
}

interface Stats {
  thisMonth: {
    views: number;
    likes: number;
    newFollowers: number;
    chatsStarted: number;
    conversions: number;
  };
  lastMonth: {
    views: number;
    likes: number;
    newFollowers: number;
    chatsStarted: number;
    conversions: number;
  };
}

export default function BusinessDetail() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const businessId = params.businessId as string;

  const [activeTab, setActiveTab] = useState<TabType>('videos');

  // Debug logs para identificar el problema
  console.log('🏪 BusinessDetail - Params received:', params);
  console.log('🏪 BusinessDetail - BusinessId:', businessId);
  console.log('🏪 BusinessDetail - User ID:', user?.id);

  // Verificar que businessId existe
  if (!businessId) {
    console.error('❌ BusinessDetail - No businessId provided');
  }

  // Usar el hook de business detail
  const {
    business,
    videos,
    stats,
    isFollowing,
    loading,
    error,
    refreshBusiness,
    toggleFollow,
    isOwner
  } = useBusinessDetail(businessId, user?.id);

  // Hook para manejar conversaciones
  const { createBusinessConversation } = useConversations(user?.id);

  // Funciones de navegación (definir antes de su uso)
  const handleBack = () => {
    router.back();
  };

  const handleChat = async () => {
    console.log('🎯 handleChat iniciado', { 
      userId: user?.id, 
      businessId, 
      isOwner,
      businessExists: !!business 
    });

    if (!user?.id) {
      console.log('❌ No hay usuario autenticado');
      Alert.alert('Error', 'Debes iniciar sesión para chatear con negocios');
      return;
    }

    if (!businessId) {
      console.log('❌ No hay businessId');
      Alert.alert('Error', 'No se pudo identificar el negocio');
      return;
    }

    if (isOwner) {
      console.log('👤 Usuario es dueño, navegando directamente al inbox');
      // Si es el dueño, ir directamente al inbox
      router.push('/(tabs)/inbox');
      return;
    }

    try {
      console.log('🚀 Iniciando creación de conversación:', { 
        userId: user.id, 
        businessId,
        businessName: business?.name 
      });
      
      // Verificar que tenemos todos los datos necesarios
      if (!business) {
        throw new Error('Información del negocio no disponible');
      }
      
      // Crear o encontrar la conversación existente
      const conversationId = await createBusinessConversation(businessId);
      
      console.log('📞 Resultado de createBusinessConversation:', conversationId);
      
      if (conversationId) {
        console.log('✅ Conversación lista, navegando al inbox:', conversationId);
        
        // Navegar al inbox con la conversación específica
        router.push({
          pathname: '/(tabs)/inbox',
          params: { conversationId }
        });
      } else {
        console.log('❌ createBusinessConversation retornó null/undefined');
        throw new Error('No se pudo crear la conversación - función retornó null');
      }
    } catch (error) {
      console.error('❌ Error completo al iniciar chat:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        userId: user?.id,
        businessId,
        businessName: business?.name
      });
      
      Alert.alert(
        'Error de Chat', 
        `No se pudo iniciar el chat con ${business?.name || 'este negocio'}.\n\nDetalles: ${error instanceof Error ? error.message : 'Error desconocido'}\n\n¿Deseas intentar de nuevo?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Reintentar', onPress: () => handleChat() }
        ]
      );
    }
  };

  const handleContentUpload = () => {
    // TODO: implementar subida de contenido
    console.log('Subir contenido');
  };

  const handleReviews = () => {
    // TODO: implementar navegación a reseñas
    console.log('Ver reseñas');
  };

  // Mostrar loading si está cargando
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Loading fullScreen text="Cargando negocio..." />
      </View>
    );
  }

  // Mostrar error si no se encontró el negocio
  if (error || !business) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
          {/* Header con botón de regreso */}
          <View style={styles.errorHeader}>
            <TouchableOpacity
              style={[styles.backBtn, { backgroundColor: colors.overlay }]}
              onPress={handleBack}
            >
              <ArrowLeft size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {/* Contenido del error */}
          <View style={styles.errorContent}>
            <Text style={[styles.errorIcon, { color: colors.textSecondary }]}>🏪</Text>
            <Text style={[styles.errorTitle, { color: colors.text }]}>
              Negocio no disponible
            </Text>
            <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
              {error || "No pudimos cargar la información de este negocio en este momento."}
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.tint }]}
              onPress={refreshBusiness}
            >
              <Text style={[styles.retryButtonText, { color: colors.background }]}>
                Intentar de nuevo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Colores personalizados para elementos específicos siguiendo el design system
  const themeColors = {
    primary: colors.tint,
    warning: '#FFC107', // Del design system
    success: '#28A745', // Del design system
    error: '#DC3545', // Del design system
    info: '#17A2B8', // Del design system
    onPrimary: '#FFFFFF',
    onOverlay: '#FFFFFF',
    textTertiary: colors.textSecondary,
    accent: '#E9C46A', // Color accent del design system
    secondary: '#264653', // Color secondary del design system
  };

  // 🚀 MOCK DATA como fallback (se mantiene businessData para compatibilidad)
  const businessData = business ? {
    id: business.id,
    name: business.name,
    category: business.category,
    description: business.description,
    logo: business.logo_url,
    cover: business.cover_image_url,
    rating: business.rating_average,
    totalReviews: business.total_reviews,
    followers: business.followers_count,
    isVerified: true, // TODO: agregar campo verified a la DB
    address: business.full_address || business.address,
    phone: business.phone,
    whatsapp: business.whatsapp,
    hours: business.schedule,
    services: business.services,
    priceRange: business.price_range,
    social: business.social_media,
    // 🎮 Datos de gamificación para empresarios (mock mientras no están en DB)
    businessLevel: 12,
    businessExperience: 8500,
    businessExperienceToNext: 10000,
    totalViews: stats?.totalViews || 125000,
    totalEngagement: 15600,
    badges: ['top_rated', 'viral_creator', 'community_favorite', 'consistent_poster'],
    streak: 21, // 21 días consecutivos con actividad
    rank: 'Gold',
    monthlyTarget: {
      views: 15000,
      followers: 200,
      engagement: 1200,
    },
  } : null;

  const reviews: Review[] = [
    {
      id: '1',
      user: { name: 'María García', isVerified: true },
      rating: 5,
      comment: 'Excelente comida típica, muy auténtica. El desayuno tolimense es imperdible.',
      date: '3 días',
    },
    {
      id: '2',
      user: { name: 'Carlos Rodríguez', isVerified: true },
      rating: 5,
      comment: 'Lugar muy acogedor, la lechona está deliciosa. Altamente recomendado.',
      date: '1 semana',
    },
  ];

  const handleFollow = () => {
    toggleFollow();
  };

  const formatNumber = (num: number | undefined | null): string => {
    if (!num || num === 0) return '0';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const calculateGrowth = (current: number, previous: number): string => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getBusinessLevelProgress = (): number => {
    if (!businessData) return 0;
    return (businessData.businessExperience / businessData.businessExperienceToNext) * 100;
  };

  const getRankColor = (rank: string): string => {
    switch (rank) {
      case 'Bronze': return '#CD7F32';
      case 'Silver': return '#C0C0C0';
      case 'Gold': return '#FFD700';
      case 'Platinum': return '#E5E4E2';
      case 'Diamond': return '#B9F2FF';
      default: return themeColors.primary;
    }
  };

  const getBadgeInfo = (badgeId: string) => {
    const badges: Record<string, { icon: string; title: string; desc: string }> = {
      'top_rated': { icon: '⭐', title: 'Top Rated', desc: 'Calificación promedio 4.5+' },
      'viral_creator': { icon: '🚀', title: 'Viral Creator', desc: 'Video con 10k+ vistas' },
      'community_favorite': { icon: '❤️', title: 'Community Favorite', desc: '500+ seguidores' },
      'consistent_poster': { icon: '📅', title: 'Consistent Poster', desc: '30 días activo' },
      'engagement_king': { icon: '👑', title: 'Engagement King', desc: '80%+ engagement rate' },
      'growth_master': { icon: '📈', title: 'Growth Master', desc: '100+ seguidores/mes' },
    };
    return badges[badgeId] || { icon: '🏆', title: 'Achievement', desc: 'Logro desbloqueado' };
  };

  const getTabText = (tab: TabType): string => {
    switch (tab) {
      case 'videos':
        return 'Videos';
      case 'info':
        return 'Información';
      case 'reviews':
        return 'Reseñas';
      case 'stats':
        return 'Estadísticas';
      default:
        return '';
    }
  };

  const renderVideoItem = ({ item }: { item: VideoWithBusiness }) => (
    <View style={[styles.videoCard, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.thumbnail_url || 'https://via.placeholder.com/300x400' }} style={styles.videoThumb} />
      
      {/* Overlay con información del video */}
      <View style={styles.videoOverlay}>
        <Text numberOfLines={2} style={[styles.videoTitle, { color: themeColors.onOverlay }]}>
          {item.title}
        </Text>
        <View style={styles.videoStats}>
          <View style={styles.videoStatItem}>
            <Eye size={12} color={themeColors.onOverlay} />
            <Text style={[styles.videoStatText, { color: themeColors.onOverlay }]}>
              {formatNumber(item.views_count || 0)}
            </Text>
          </View>
          <View style={styles.videoStatItem}>
            <Heart size={12} color={themeColors.onOverlay} />
            <Text style={[styles.videoStatText, { color: themeColors.onOverlay }]}>
              {item.likes_count || 0}
            </Text>
          </View>
          <View style={styles.videoStatItem}>
            <MessageCircle size={12} color={themeColors.onOverlay} />
            <Text style={[styles.videoStatText, { color: themeColors.onOverlay }]}>
              {0}
            </Text>
          </View>
          <Text style={[styles.videoDate, { color: themeColors.onOverlay }]}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderInfo = () => (
    <ScrollView style={styles.tabContent}>
      {/* Descripción */}
      <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          {businessData?.description || 'Sin descripción disponible'}
        </Text>
      </View>

      {/* Información de contacto */}
      <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Información de contacto
        </Text>
        <View style={styles.contactItem}>
          <MapPin size={18} color={colors.textSecondary} />
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            {businessData?.address || 'Dirección no disponible'}
          </Text>
        </View>
        <View style={styles.contactItem}>
          <Phone size={18} color={colors.textSecondary} />
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            {businessData?.phone || 'Teléfono no disponible'}
          </Text>
        </View>
        <View style={styles.contactItem}>
          <Text style={[styles.whatsappIcon, { color: colors.textSecondary }]}>📱</Text>
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            WhatsApp: {businessData?.whatsapp || 'No disponible'}
          </Text>
        </View>
      </View>

      {/* Horarios */}
      {businessData?.hours && (
        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Horarios de atención
          </Text>
          {Object.entries(businessData.hours).map(([day, schedule]) => {
            // Formatear el día en español
            const dayNames: Record<string, string> = {
              'monday': 'Lunes',
              'tuesday': 'Martes', 
              'wednesday': 'Miércoles',
              'thursday': 'Jueves',
              'friday': 'Viernes',
              'saturday': 'Sábado',
              'sunday': 'Domingo'
            };

            // Formatear el horario según el tipo
            let scheduleText = '';
            if (typeof schedule === 'string') {
              scheduleText = schedule;
            } else if (typeof schedule === 'object' && schedule && 'open' in schedule && 'close' in schedule) {
              if (schedule.isOpen) {
                scheduleText = `${schedule.open} - ${schedule.close}`;
              } else {
                scheduleText = 'Cerrado';
              }
            } else {
              scheduleText = 'No disponible';
            }

            return (
              <View key={day} style={styles.hoursItem}>
                <Text style={[styles.hoursDay, { color: colors.textSecondary }]}>
                  {dayNames[day] || day}
                </Text>
                <Text style={[styles.hoursTime, { color: colors.text }]}>
                  {scheduleText}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Servicios */}
      {businessData?.services && businessData.services.length > 0 && (
        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Servicios
          </Text>
          <View style={styles.servicesGrid}>
            {businessData.services.map((service) => (
              <View key={service} style={[styles.serviceItem, { backgroundColor: colors.background }]}>
                <Text style={[styles.serviceText, { color: colors.text }]}>✓ {service}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Rango de precios */}
      {businessData?.priceRange && (
        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Rango de precios
          </Text>
          <Text style={[styles.priceRange, { color: colors.textSecondary }]}>
            {businessData.priceRange}
          </Text>
        </View>
      )}

      {/* Redes sociales */}
      {businessData?.social && (
        <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Redes sociales
          </Text>
          <View style={styles.contactItem}>
            <Instagram size={18} color="#E4405F" />
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
              {businessData.social.instagram || 'No disponible'}
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Facebook size={18} color="#1877F2" />
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
              {businessData.social.facebook || 'No disponible'}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderReviews = () => (
    <ScrollView style={styles.tabContent}>
      {reviews.map((review) => (
        <View
          key={review.id}
          style={[styles.reviewCard, { backgroundColor: colors.card }]}
        >
          <View style={styles.reviewHeader}>
            <View style={styles.reviewUserInfo}>
              <Text style={[styles.reviewUser, { color: colors.text }]}>
                {review.user.name}
              </Text>
              {review.user.isVerified && (
                <View style={[styles.verifiedBadge, { backgroundColor: themeColors.success }]}>
                  <Text style={[styles.verifiedText, { color: themeColors.onPrimary }]}>
                    Verificado
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.reviewDate, { color: themeColors.textTertiary }]}>
              {review.date}
            </Text>
          </View>
          <Text style={{ color: themeColors.warning }}>
            {'⭐'.repeat(review.rating)}
          </Text>
          <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>
            "{review.comment}"
          </Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderStats = () => (
    <ScrollView style={styles.tabContent}>
      {/* Resumen del mes */}
      <View style={[styles.statsSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Resumen de este mes
        </Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.statNumber, { color: themeColors.primary }]}>
              {stats?.thisMonth.views.toLocaleString() || '0'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Visualizaciones
            </Text>
            <Text style={[styles.statGrowth, { color: themeColors.success }]}>
              +{stats ? calculateGrowth(stats.thisMonth.views, stats.lastMonth.views) : '0'}%
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.statNumber, { color: themeColors.error }]}>
              {stats?.thisMonth.likes || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Likes
            </Text>
            <Text style={[styles.statGrowth, { color: themeColors.success }]}>
              +{stats ? calculateGrowth(stats.thisMonth.likes, stats.lastMonth.likes) : '0'}%
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.statNumber, { color: themeColors.secondary }]}>
              {stats?.thisMonth.newFollowers || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Nuevos seguidores
            </Text>
            <Text style={[styles.statGrowth, { color: themeColors.success }]}>
              +{stats ? calculateGrowth(stats.thisMonth.newFollowers, stats.lastMonth.newFollowers) : '0'}%
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.statNumber, { color: themeColors.accent }]}>
              {stats?.thisMonth.conversions || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Conversiones
            </Text>
            <Text style={[styles.statGrowth, { color: themeColors.success }]}>
              +{stats ? calculateGrowth(stats.thisMonth.conversions, stats.lastMonth.conversions) : '0'}%
            </Text>
          </View>
        </View>
      </View>

      {/* Engagement */}
      <View style={[styles.statsSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Engagement
        </Text>
        <View style={styles.engagementItem}>
          <Text style={[styles.engagementLabel, { color: colors.textSecondary }]}>
            Chats iniciados
          </Text>
          <Text style={[styles.engagementValue, { color: colors.text }]}>
            {stats?.thisMonth.chatsStarted || 0}
          </Text>
        </View>
        <View style={styles.engagementItem}>
          <Text style={[styles.engagementLabel, { color: colors.textSecondary }]}>
            Tasa de conversión
          </Text>
          <Text style={[styles.engagementValue, { color: colors.text }]}>
            {stats ? ((stats.thisMonth.conversions / stats.thisMonth.chatsStarted) * 100).toFixed(1) : '0'}%
          </Text>
        </View>
      </View>

      {/* Videos con mejor rendimiento */}
      <View style={[styles.statsSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Videos con mejor rendimiento
        </Text>
        {videos.slice(0, 2).map((video) => (
          <View key={video.id} style={styles.topVideoItem}>
            <Image source={{ uri: video.thumbnail_url || 'https://via.placeholder.com/60x40' }} style={styles.topVideoThumb} />
            <View style={styles.topVideoInfo}>
              <Text style={[styles.topVideoTitle, { color: colors.text }]} numberOfLines={2}>
                {video.title}
              </Text>
              <View style={styles.topVideoStats}>
                <Text style={[styles.topVideoStat, { color: colors.textSecondary }]}>
                  {(video.views_count || 0).toLocaleString()} vistas
                </Text>
                <Text style={[styles.topVideoStat, { color: colors.textSecondary }]}>
                  {video.likes_count || 0} likes
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'videos':
        return (
          <View style={styles.videosContainer}>
            <FlatList
              data={videos}
              numColumns={2}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.videoList}
              renderItem={renderVideoItem}
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No hay videos disponibles.
                </Text>
              }
              ListFooterComponent={
                isOwner ? (
                  <TouchableOpacity 
                    style={[styles.uploadButton, { borderColor: colors.border }]}
                    onPress={handleContentUpload}
                  >
                    <Upload size={24} color={colors.textSecondary} />
                    <Text style={[styles.uploadText, { color: colors.textSecondary }]}>
                      Subir nuevo video
                    </Text>
                  </TouchableOpacity>
                ) : null
              }
            />
          </View>
        );
      case 'reviews':
        return renderReviews();
      case 'info':
        return renderInfo();
      case 'stats':
        return isOwner ? renderStats() : renderInfo();
      default:
        return null;
    }
  };

  const getVisibleTabs = (): TabType[] => {
    const baseTabs: TabType[] = ['videos', 'info', 'reviews'];
    if (isOwner) {
      baseTabs.push('stats');
    }
    return baseTabs;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header con portada */}
      <View>
        <Image source={{ uri: businessData?.cover || '' }} style={styles.cover} />
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.overlay }]}
            onPress={handleBack}
          >
            <ArrowLeft size={22} color={themeColors.onOverlay} />
          </TouchableOpacity>
          
          {isOwner && (
            <View style={styles.ownerActions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.overlay }]}
              >
                <Edit3 size={20} color={themeColors.onOverlay} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.overlay }]}
              >
                <Settings size={20} color={themeColors.onOverlay} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Info negocio */}
      <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
        <Image source={{ uri: businessData?.logo }} style={styles.logo} />
        
        <View style={styles.businessHeader}>
          <View style={styles.businessInfo}>
            <Text style={[styles.title, { color: colors.text }]}>
              {businessData?.name || 'Negocio sin nombre'}
            </Text>
            <Text style={[styles.category, { color: colors.textSecondary }]}>
              {businessData?.category || 'Sin categoría'}
            </Text>
            <View style={styles.statsRow}>
              <TouchableOpacity
                onPress={handleReviews}
                style={[
                  styles.row,
                  !handleReviews && styles.disabledButton,
                ]}
                disabled={!handleReviews}
              >
                <Star size={16} color={themeColors.warning} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>
                  {businessData?.rating || 0} ({businessData?.totalReviews || 0})
                </Text>
              </TouchableOpacity>
              <View style={styles.row}>
                <Users size={16} color={colors.textSecondary} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>
                  {formatNumber(businessData?.followers || 0)} seguidores
                </Text>
              </View>
            </View>
          </View>
          
          {!isOwner && (
            <View style={styles.followersInfo}>
              <Text style={[styles.followersNumber, { color: colors.text }]}>
                {businessData?.followers?.toLocaleString() || '0'}
              </Text>
              <Text style={[styles.followersLabel, { color: colors.textSecondary }]}>
                Seguidores
              </Text>
            </View>
          )}
        </View>

        <Text
          style={[styles.desc, { color: colors.textSecondary }]}
          numberOfLines={3}
        >
          {businessData?.description || 'Sin descripción disponible'}
        </Text>

        {/* Botones */}
        <View style={styles.actionRow}>
          {isOwner ? (
            <>
              <TouchableOpacity
                onPress={handleContentUpload}
                style={[styles.primaryBtn, { backgroundColor: themeColors.primary }]}
              >
                <Upload size={16} color={themeColors.onPrimary} />
                <Text style={[styles.primaryBtnText, { color: themeColors.onPrimary }]}>
                  Subir contenido
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryBtn, { borderColor: colors.border }]}
                onPress={() => console.log('Gestionar contenido')}
              >
                <BarChart3 size={16} color={colors.text} />
                <Text style={[styles.secondaryBtnText, { color: colors.text }]}>
                  Gestionar
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleFollow}
                style={[
                  styles.followBtn,
                  {
                    backgroundColor: isFollowing
                      ? colors.border
                      : themeColors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.followBtnText,
                    {
                      color: isFollowing ? colors.text : themeColors.onPrimary,
                    },
                  ]}
                >
                  {isFollowing ? 'Siguiendo' : 'Seguir'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chatBtn, { backgroundColor: themeColors.success }]}
                onPress={handleChat}
              >
                <MessageCircle size={18} color={themeColors.onPrimary} />
                <Text style={[styles.chatBtnText, { color: themeColors.onPrimary }]}>
                  Chat directo
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* 🎮 Sección de gamificación para empresarios */}
        {isOwner && businessData && (
          <View style={styles.businessLevelContainer}>
            <View style={styles.businessLevelRow}>
              <View style={styles.businessLevelBadge}>
                <Text style={{ fontSize: 16 }}>🏢</Text>
                <Text style={[styles.businessLevelText, { color: themeColors.primary }]}>
                  Nivel {businessData.businessLevel}
                </Text>
              </View>
              <Text style={[styles.businessExperienceText, { color: colors.textSecondary }]}>
                {businessData.businessExperience}/{businessData.businessExperienceToNext} XP
              </Text>
            </View>
            
            <View style={styles.businessProgressContainer}>
              <View style={styles.businessProgressBar}>
                <View 
                  style={[
                    styles.businessProgressFill,
                    { width: `${getBusinessLevelProgress()}%` }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.businessRankContainer}>
              <Text style={[styles.businessRankIcon, { color: getRankColor(businessData.rank) }]}>
                👑
              </Text>
              <Text style={[styles.businessRankText, { color: colors.text }]}>
                Rango {businessData.rank}
              </Text>
            </View>

            <View style={styles.businessStreakContainer}>
              <Text style={styles.businessStreakIcon}>🔥</Text>
              <Text style={[styles.businessStreakText, { color: colors.text }]}>
                {businessData.streak} días activo
              </Text>
            </View>

            {businessData.badges && businessData.badges.length > 0 && (
              <View style={styles.businessBadgesContainer}>
                <Text style={[styles.businessBadgesTitle, { color: colors.text }]}>
                  Logros Recientes
                </Text>
                <View style={styles.businessBadgesGrid}>
                  {businessData.badges.slice(0, 3).map((badgeId, index) => {
                    const badge = getBadgeInfo(badgeId);
                    return (
                      <View key={index} style={styles.businessBadgeItem}>
                        <Text style={styles.businessBadgeIcon}>{badge.icon}</Text>
                        <Text style={[styles.businessBadgeText, { color: colors.text }]}>
                          {badge.title}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {businessData.monthlyTarget && (
              <View style={styles.businessTargetsContainer}>
                <Text style={[styles.businessTargetsTitle, { color: colors.text }]}>
                  Objetivos del Mes
                </Text>
                
                <View style={styles.businessTargetItem}>
                  <View style={styles.businessTargetHeader}>
                    <Text style={[styles.businessTargetLabel, { color: colors.text }]}>
                      👁️ Visualizaciones
                    </Text>
                    <Text style={[styles.businessTargetValue, { color: themeColors.primary }]}>
                      {businessData.totalViews.toLocaleString()}/{businessData.monthlyTarget.views.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.businessTargetProgress}>
                    <View 
                      style={[
                        styles.businessTargetFill,
                        { width: `${Math.min(100, (businessData.totalViews / businessData.monthlyTarget.views) * 100)}%` }
                      ]} 
                    />
                  </View>
                </View>

                <View style={styles.businessTargetItem}>
                  <View style={styles.businessTargetHeader}>
                    <Text style={[styles.businessTargetLabel, { color: colors.text }]}>
                      👥 Seguidores
                    </Text>
                    <Text style={[styles.businessTargetValue, { color: themeColors.primary }]}>
                      {businessData.followers.toLocaleString()}/{businessData.monthlyTarget.followers.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.businessTargetProgress}>
                    <View 
                      style={[
                        styles.businessTargetFill,
                        { width: `${Math.min(100, (businessData.followers / businessData.monthlyTarget.followers) * 100)}%` }
                      ]} 
                    />
                  </View>
                </View>

                <View style={styles.businessTargetItem}>
                  <View style={styles.businessTargetHeader}>
                    <Text style={[styles.businessTargetLabel, { color: colors.text }]}>
                      💬 Engagement
                    </Text>
                    <Text style={[styles.businessTargetValue, { color: themeColors.primary }]}>
                      {Math.round((businessData.totalEngagement / businessData.totalViews) * 100)}%/{businessData.monthlyTarget.engagement}%
                    </Text>
                  </View>
                  <View style={styles.businessTargetProgress}>
                    <View 
                      style={[
                        styles.businessTargetFill,
                        { width: `${Math.min(100, ((businessData.totalEngagement / businessData.totalViews) * 100 / businessData.monthlyTarget.engagement) * 100)}%` }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {getVisibleTabs().map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && {
                borderBottomWidth: 2,
                borderBottomColor: themeColors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab ? themeColors.primary : colors.textSecondary,
                },
              ]}
            >
              {getTabText(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido dinámico */}
      <View style={styles.tabContainer}>
        {renderTabContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  cover: { 
    width: '100%', 
    height: 160 
  },
  headerActions: {
    position: 'absolute',
    top: 30,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backBtn: {
    padding: 8,
    borderRadius: 50,
  },
  ownerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 50,
  },
  infoBox: { 
    padding: 16 
  },
  logo: { 
    width: 70, 
    height: 70, 
    borderRadius: 16, 
    marginBottom: 8 
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  businessInfo: {
    flex: 1,
  },
  followersInfo: {
    alignItems: 'flex-end',
  },
  followersNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  followersLabel: {
    fontSize: 12,
  },
  title: { 
    fontSize: 20, 
    fontWeight: '700',
    marginBottom: 2,
  },
  category: { 
    marginBottom: 4 
  },
  statsRow: { 
    flexDirection: 'row', 
    marginVertical: 8 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 16 
  },
  statText: { 
    marginLeft: 4 
  },
  desc: { 
    marginVertical: 8 
  },
  actionRow: { 
    flexDirection: 'row', 
    marginTop: 8,
    gap: 8,
  },
  followBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  followBtnText: {
    fontWeight: '600',
  },
  chatBtn: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  chatBtnText: {
    marginLeft: 6,
    fontWeight: '600',
  },
  tabs: { 
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: { 
    flex: 1, 
    padding: 12, 
    alignItems: 'center' 
  },
  tabText: {
    fontWeight: '600',
  },
  tabContainer: {
    flex: 1,
  },
  tabContent: { 
    padding: 12 
  },
  videoList: {
    padding: 4,
  },
  videoCard: { 
    flex: 1, 
    margin: 6, 
    borderRadius: 12, 
    padding: 6 
  },
  videoThumb: { 
    width: '100%', 
    height: 120, 
    borderRadius: 12 
  },
  videoTitle: { 
    fontWeight: '600', 
    marginTop: 6 
  },
  videoMeta: { 
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  reviewCard: { 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 8 
  },
  reviewUser: { 
    fontWeight: '600' 
  },
  reviewComment: { 
    marginVertical: 4 
  },
  reviewDate: { 
    fontSize: 12 
  },
  disabledButton: {
    opacity: 0.5,
  },
  // 🎮 Estilos de gamificación para empresarios
  businessLevelContainer: {
    backgroundColor: 'rgba(42, 157, 143, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  businessLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  businessLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 157, 143, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  businessLevelText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  businessExperienceText: {
    fontSize: 12,
    opacity: 0.8,
  },
  businessProgressContainer: {
    marginTop: 4,
  },
  businessProgressBar: {
    height: 6,
    backgroundColor: 'rgba(42, 157, 143, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  businessProgressFill: {
    height: '100%',
    backgroundColor: '#2A9D8F',
    borderRadius: 3,
  },
  businessRankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  businessRankIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  businessRankText: {
    fontSize: 16,
    fontWeight: '600',
  },
  businessStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(233, 196, 106, 0.1)',
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  businessStreakIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  businessStreakText: {
    fontSize: 14,
    fontWeight: '500',
  },
  businessBadgesContainer: {
    marginTop: 12,
  },
  businessBadgesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  businessBadgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  businessBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(38, 70, 83, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  businessBadgeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  businessBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  businessTargetsContainer: {
    marginTop: 16,
  },
  businessTargetsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  businessTargetItem: {
    backgroundColor: 'rgba(42, 157, 143, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  businessTargetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  businessTargetLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  businessTargetValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  businessTargetProgress: {
    height: 4,
    backgroundColor: 'rgba(42, 157, 143, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  businessTargetFill: {
    height: '100%',
    backgroundColor: '#2A9D8F',
    borderRadius: 2,
  },
  // Estilos para videos (que estaban faltando)
  videoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  videoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  videoStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoStatText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  videoDate: {
    fontSize: 10,
    opacity: 0.8,
  },
  // Estilos para información (que estaban faltando)
  infoSection: {
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 8,
  },
  whatsappIcon: {
    fontSize: 16,
  },
  // Estilos para upload
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  uploadText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  // Estilos adicionales para info y reviews
  hoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  hoursDay: {
    fontSize: 14,
    fontWeight: '500',
  },
  hoursTime: {
    fontSize: 14,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priceRange: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
  },
  // Estilos para estadísticas de propietarios
  statsSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  statGrowth: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  // Estilos adicionales para métricas de engagement
  engagementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  engagementLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  engagementValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  // Estilos para videos top
  topVideoItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  topVideoThumb: {
    width: 60,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  topVideoInfo: {
    flex: 1,
  },
  topVideoTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  topVideoStats: {
    flexDirection: 'row',
    gap: 12,
  },
  topVideoStat: {
    fontSize: 12,
  },
  // Contenedor de videos
  videosContainer: {
    padding: 0,
  },
  // Botones de acción
  primaryBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontWeight: '600',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  secondaryBtnText: {
    marginLeft: 6,
    fontWeight: '600',
  },
  // Estilos para el manejo de errores
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorHeader: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    zIndex: 1,
  },
  errorContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});