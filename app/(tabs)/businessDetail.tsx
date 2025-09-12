import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  ArrowLeft,
  Star,
  MessageCircle,
  Users,
  MapPin,
  Phone,
  Clock,
  Edit3,
  Settings,
  Upload,
  BarChart3,
  Eye,
  Heart,
  Instagram,
  Facebook,
} from 'lucide-react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface BusinessDetailProps {
  onBack: () => void;
  onChat: () => void;
  onReviews?: () => void;
  onContentUpload?: () => void;
  onContentManager?: () => void;
  isOwnerView?: boolean; // Para distinguir si es el dueño viendo su perfil
}

type TabType = 'videos' | 'info' | 'reviews' | 'stats';

interface Video {
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

export default function BusinessDetail({
  onBack,
  onChat,
  onReviews,
  onContentUpload,
  onContentManager,
  isOwnerView = false,
}: BusinessDetailProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [activeTab, setActiveTab] = useState<TabType>('videos');
  const [isFollowing, setIsFollowing] = useState(false);

  // Colores personalizados para elementos específicos
  const themeColors = {
    primary: colors.tint,
    warning: '#FFB800',
    success: '#10B981',
    onPrimary: '#FFFFFF',
    onOverlay: '#FFFFFF',
    textTertiary: colors.textSecondary,
  };

  // 🚀 MOCK DATA
  const businessData: BusinessData = {
    id: 'rest1',
    name: 'La Fonda Criolla',
    category: 'Gastronomía',
    description:
      'Restaurante tradicional especializado en comida típica tolimense. Más de 20 años sirviendo los mejores sabores de la región.',
    logo: 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?w=150&h=150&fit=crop&crop=center',
    cover:
      'https://images.unsplash.com/photo-1723693407703-f42009db4cd7?w=400&h=200&fit=crop',
    rating: 4.8,
    totalReviews: 156,
    followers: 2340,
    isVerified: true,
    address: 'Carrera 3 #12-45, Centro Histórico',
    phone: '+57 318 456 7890',
    whatsapp: '+57 318 456 7890',
    hours: {
      'Lun-Vie': '6:00 AM - 10:00 PM',
      'Sáb-Dom': '6:00 AM - 11:00 PM'
    },
    services: [
      'Desayunos típicos',
      'Almuerzos ejecutivos', 
      'Comida para llevar',
      'Eventos privados'
    ],
    priceRange: '$15.000 - $35.000',
    social: {
      instagram: '@lafondacriolla',
      facebook: 'La Fonda Criolla Ibagué'
    }
  };

  const videos: Video[] = [
    {
      id: '1',
      title: 'Desayuno típico tolimense completo',
      thumbnail:
        'https://images.unsplash.com/photo-1723693407703-f42009db4cd7?w=200&h=350&fit=crop',
      views: 5420,
      likes: 234,
      comments: 45,
      date: '2 días'
    },
    {
      id: '2',
      title: 'Preparación de la lechona criolla',
      thumbnail:
        'https://images.unsplash.com/photo-1695654389026-ac27bd5dd57c?w=200&h=350&fit=crop',
      views: 8930,
      likes: 467,
      comments: 89,
      date: '5 días'
    },
    {
      id: '3',
      title: 'Tour por nuestra cocina tradicional',
      thumbnail:
        'https://images.unsplash.com/photo-1556908114-f6e7ad7d3136?w=200&h=350&fit=crop',
      views: 3210,
      likes: 189,
      comments: 34,
      date: '1 semana'
    }
  ];

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

  const stats: Stats = {
    thisMonth: {
      views: 18560,
      likes: 890,
      newFollowers: 234,
      chatsStarted: 67,
      conversions: 23
    },
    lastMonth: {
      views: 15240,
      likes: 723,
      newFollowers: 189,
      chatsStarted: 45,
      conversions: 18
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const calculateGrowth = (current: number, previous: number): string => {
    return ((current - previous) / previous * 100).toFixed(1);
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

  const renderVideoItem = ({ item }: { item: Video }) => (
    <View style={[styles.videoCard, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.thumbnail }} style={styles.videoThumb} />
      
      {/* Overlay con información del video */}
      <View style={styles.videoOverlay}>
        <Text numberOfLines={2} style={[styles.videoTitle, { color: themeColors.onOverlay }]}>
          {item.title}
        </Text>
        <View style={styles.videoStats}>
          <View style={styles.videoStatItem}>
            <Eye size={12} color={themeColors.onOverlay} />
            <Text style={[styles.videoStatText, { color: themeColors.onOverlay }]}>
              {formatNumber(item.views)}
            </Text>
          </View>
          <View style={styles.videoStatItem}>
            <Heart size={12} color={themeColors.onOverlay} />
            <Text style={[styles.videoStatText, { color: themeColors.onOverlay }]}>
              {item.likes}
            </Text>
          </View>
          <View style={styles.videoStatItem}>
            <MessageCircle size={12} color={themeColors.onOverlay} />
            <Text style={[styles.videoStatText, { color: themeColors.onOverlay }]}>
              {item.comments}
            </Text>
          </View>
          <Text style={[styles.videoDate, { color: themeColors.onOverlay }]}>
            {item.date}
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
          {businessData.description}
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
            {businessData.address}
          </Text>
        </View>
        <View style={styles.contactItem}>
          <Phone size={18} color={colors.textSecondary} />
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            {businessData.phone}
          </Text>
        </View>
        <View style={styles.contactItem}>
          <Text style={[styles.whatsappIcon, { color: colors.textSecondary }]}>📱</Text>
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            WhatsApp: {businessData.whatsapp}
          </Text>
        </View>
      </View>

      {/* Horarios */}
      <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Horarios de atención
        </Text>
        {Object.entries(businessData.hours).map(([days, hours]) => (
          <View key={days} style={styles.hoursItem}>
            <Text style={[styles.hoursDay, { color: colors.textSecondary }]}>{days}</Text>
            <Text style={[styles.hoursTime, { color: colors.text }]}>{hours}</Text>
          </View>
        ))}
      </View>

      {/* Servicios */}
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

      {/* Rango de precios */}
      <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Rango de precios
        </Text>
        <Text style={[styles.priceRange, { color: colors.textSecondary }]}>
          {businessData.priceRange}
        </Text>
      </View>

      {/* Redes sociales */}
      <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Redes sociales
        </Text>
        <View style={styles.contactItem}>
          <Instagram size={18} color="#E4405F" />
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            {businessData.social.instagram}
          </Text>
        </View>
        <View style={styles.contactItem}>
          <Facebook size={18} color="#1877F2" />
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            {businessData.social.facebook}
          </Text>
        </View>
      </View>
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
          <View style={[styles.statCard, { backgroundColor: '#EBF8FF' }]}>
            <Text style={[styles.statNumber, { color: '#1E40AF' }]}>
              {stats.thisMonth.views.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Visualizaciones
            </Text>
            <Text style={[styles.statGrowth, { color: themeColors.success }]}>
              +{calculateGrowth(stats.thisMonth.views, stats.lastMonth.views)}%
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FEF2F2' }]}>
            <Text style={[styles.statNumber, { color: '#DC2626' }]}>
              {stats.thisMonth.likes}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Likes
            </Text>
            <Text style={[styles.statGrowth, { color: themeColors.success }]}>
              +{calculateGrowth(stats.thisMonth.likes, stats.lastMonth.likes)}%
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#F3E8FF' }]}>
            <Text style={[styles.statNumber, { color: '#7C3AED' }]}>
              {stats.thisMonth.newFollowers}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Nuevos seguidores
            </Text>
            <Text style={[styles.statGrowth, { color: themeColors.success }]}>
              +{calculateGrowth(stats.thisMonth.newFollowers, stats.lastMonth.newFollowers)}%
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#ECFDF5' }]}>
            <Text style={[styles.statNumber, { color: '#059669' }]}>
              {stats.thisMonth.conversions}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Conversiones
            </Text>
            <Text style={[styles.statGrowth, { color: themeColors.success }]}>
              +{calculateGrowth(stats.thisMonth.conversions, stats.lastMonth.conversions)}%
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
            {stats.thisMonth.chatsStarted}
          </Text>
        </View>
        <View style={styles.engagementItem}>
          <Text style={[styles.engagementLabel, { color: colors.textSecondary }]}>
            Tasa de conversión
          </Text>
          <Text style={[styles.engagementValue, { color: colors.text }]}>
            {((stats.thisMonth.conversions / stats.thisMonth.chatsStarted) * 100).toFixed(1)}%
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
            <Image source={{ uri: video.thumbnail }} style={styles.topVideoThumb} />
            <View style={styles.topVideoInfo}>
              <Text style={[styles.topVideoTitle, { color: colors.text }]} numberOfLines={2}>
                {video.title}
              </Text>
              <View style={styles.topVideoStats}>
                <Text style={[styles.topVideoStat, { color: colors.textSecondary }]}>
                  {video.views.toLocaleString()} vistas
                </Text>
                <Text style={[styles.topVideoStat, { color: colors.textSecondary }]}>
                  {video.likes} likes
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
                isOwnerView ? (
                  <TouchableOpacity 
                    style={[styles.uploadButton, { borderColor: colors.border }]}
                    onPress={onContentUpload}
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
        return isOwnerView ? renderStats() : renderInfo();
      default:
        return null;
    }
  };

  const getVisibleTabs = (): TabType[] => {
    const baseTabs: TabType[] = ['videos', 'info', 'reviews'];
    if (isOwnerView) {
      baseTabs.push('stats');
    }
    return baseTabs;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header con portada */}
      <View>
        <Image source={{ uri: businessData.cover }} style={styles.cover} />
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.overlay }]}
            onPress={onBack}
          >
            <ArrowLeft size={22} color={themeColors.onOverlay} />
          </TouchableOpacity>
          
          {isOwnerView && (
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
        <Image source={{ uri: businessData.logo }} style={styles.logo} />
        
        <View style={styles.businessHeader}>
          <View style={styles.businessInfo}>
            <Text style={[styles.title, { color: colors.text }]}>
              {businessData.name}
            </Text>
            <Text style={[styles.category, { color: colors.textSecondary }]}>
              {businessData.category}
            </Text>
            <View style={styles.statsRow}>
              <TouchableOpacity
                onPress={onReviews}
                style={[
                  styles.row,
                  !onReviews && styles.disabledButton,
                ]}
                disabled={!onReviews}
              >
                <Star size={16} color={themeColors.warning} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>
                  {businessData.rating} ({businessData.totalReviews})
                </Text>
              </TouchableOpacity>
              <View style={styles.row}>
                <Users size={16} color={colors.textSecondary} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>
                  {formatNumber(businessData.followers)} seguidores
                </Text>
              </View>
            </View>
          </View>
          
          {!isOwnerView && (
            <View style={styles.followersInfo}>
              <Text style={[styles.followersNumber, { color: colors.text }]}>
                {businessData.followers.toLocaleString()}
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
          {businessData.description}
        </Text>

        {/* Botones */}
        <View style={styles.actionRow}>
          {isOwnerView ? (
            <>
              <TouchableOpacity
                onPress={onContentUpload}
                style={[styles.primaryBtn, { backgroundColor: themeColors.primary }]}
              >
                <Upload size={16} color={themeColors.onPrimary} />
                <Text style={[styles.primaryBtnText, { color: themeColors.onPrimary }]}>
                  Subir contenido
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryBtn, { borderColor: colors.border }]}
                onPress={onContentManager}
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
                onPress={onChat}
              >
                <MessageCircle size={18} color={themeColors.onPrimary} />
                <Text style={[styles.chatBtnText, { color: themeColors.onPrimary }]}>
                  Chat directo
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
});