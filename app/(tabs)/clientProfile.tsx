import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Loading } from "../../components/ui";
import { Colors } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { useTabAuthGuard } from "../../hooks/useTabAuthGuard";
import { UserActivity, useUserActivity } from "../../hooks/useUserActivity";
import { ExtendedUserProfile, useUserProfile } from "../../hooks/useUserProfile";

interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  profileImage: string;
  bio: string;
  interests: string[];
  coins: number;
  following: number;
  favorites: number;
  // 🎮 Gamificación
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalReviews: number;
  totalPlans: number;
  streak: number; // Días consecutivos activo
  badges: string[];
}

interface ProfileClientProps {
  user: User;
}

type TabType = "activity" | "favorites" | "plans" | "challenges";

interface Activity {
  id: string;
  type: "review" | "plan" | "coupon" | "achievement";
  business?: string;
  rating?: number;
  comment?: string;
  title?: string;
  services?: number;
  date: string;
  coinsEarned?: number;
  experienceGained?: number;
}

interface Achievement {
  icon: string;
  title: string;
  desc: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: number;
  isCompleted: boolean;
  icon: string;
}

// 🗺️ Interfaces para planes personalizados
interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  location: string;
  description: string;
  estimatedTime: number; // en minutos
  priceRange: "$" | "$$" | "$$$";
}

interface CustomPlan {
  id: string;
  title: string;
  description: string;
  creator: string;
  createdAt: string;
  businesses: BusinessProfile[];
  totalTime: number; // en minutos
  totalCost: "$" | "$$" | "$$$";
  difficulty: "Fácil" | "Moderado" | "Avanzado";
  tags: string[];
  likes: number;
  saves: number;
  isPublic: boolean;
  coverImage: string;
}

export default function ProfileClient() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { shouldShowContent } = useTabAuthGuard('clientProfile');
  const { signOut, loading: authLoading, user: authUser } = useAuth();
  
  // Hooks para obtener datos del usuario
  const { userProfile, loading: profileLoading, error: profileError, refreshProfile } = useUserProfile();
  const { activities, loading: activityLoading, error: activityError, loadActivity } = useUserActivity();

  // Estados locales
  const [activeTab, setActiveTab] = useState<TabType>("activity");
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Función para manejar el refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshProfile(),
        authUser?.id ? loadActivity(authUser.id) : Promise.resolve()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshProfile, authUser?.id, loadActivity]);

  // Cargar actividad cuando el usuario esté disponible
  useEffect(() => {
    if (authUser?.id) {
      loadActivity(authUser.id);
    }
  }, [authUser?.id, loadActivity]);

  // Si no está autenticado, mostrar loading hasta que se resuelva
  if (!shouldShowContent) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Loading />
      </View>
    );
  }

  // Si está cargando el perfil, mostrar loading
  if (profileLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Loading />
        <Text style={{ marginTop: 16, color: colors.text }}>Cargando perfil...</Text>
      </View>
    );
  }

  // Si hay error y no hay datos, mostrar error
  if (profileError && !userProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 24 }}>
        <Ionicons name="alert-circle" size={48} color={Colors.error} />
        <Text style={{ marginTop: 16, color: Colors.error, textAlign: 'center', fontSize: 16 }}>
          Error al cargar el perfil
        </Text>
        <Text style={{ marginTop: 8, color: colors.text, textAlign: 'center' }}>
          {profileError}
        </Text>
        <TouchableOpacity 
          style={{
            marginTop: 16,
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: Colors.primary,
            borderRadius: 8
          }}
          onPress={refreshProfile}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Si no hay datos del perfil, usar datos básicos del auth
  const currentUser: ExtendedUserProfile = userProfile || {
    id: authUser?.id || '',
    email: authUser?.email || '',
    full_name: authUser?.full_name || 'Usuario',
    user_type: 'client',
    phone: '',
    city: 'Ibagué',
    avatar_url: '',
    created_at: new Date().toISOString(),
    bio: '',
    interests: [],
    date_of_birth: undefined,
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    streak: 0,
    badges: []
  };
  
  // Colores del design system siguiendo la paleta de Festech
  const themeColors = {
    primary: Colors.primary, // '#2A9D8F'
    secondary: Colors.secondary, // '#264653'
    accent: Colors.accent, // '#E9C46A'
    warning: Colors.warning, // '#FFC107'
    success: Colors.success, // '#28A745'
    error: Colors.error, // '#DC3545'
    white: Colors.white,
    overlay: 'rgba(42, 157, 143, 0.9)', // Primary con transparencia
  };

  // Datos mock para los elementos que aún no están implementados
  const achievements: Achievement[] = [
    { 
      icon: "", 
      title: "Explorador", 
      desc: "Visitó 10 lugares diferentes",
      isUnlocked: (currentUser.stats?.followingCount || 0) >= 10,
      progress: currentUser.stats?.followingCount || 0,
      maxProgress: 10,
    },
    { 
      icon: "", 
      title: "Crítico", 
      desc: "Dejó 25 reseñas",
      isUnlocked: (currentUser.stats?.totalReviews || 0) >= 25,
      progress: currentUser.stats?.totalReviews || 0,
      maxProgress: 25,
    },
    { 
      icon: "", 
      title: "VIP", 
      desc: "Acumuló 1000+ coins",
      isUnlocked: (currentUser.wallet?.balance || 0) >= 1000,
      progress: currentUser.wallet?.balance || 0,
      maxProgress: 1000,
    },
    { 
      icon: "", 
      title: "Local", 
      desc: "Conoce Ibagué como su casa",
      isUnlocked: (currentUser.stats?.totalPlans || 0) >= 3,
      progress: currentUser.stats?.totalPlans || 0,
      maxProgress: 3,
    },
    { 
      icon: "", 
      title: "Racha", 
      desc: "7 días activo consecutivos",
      isUnlocked: (currentUser.streak || 0) >= 7,
      progress: currentUser.streak || 0,
      maxProgress: 7,
    },
    { 
      icon: "", 
      title: "Social", 
      desc: "Sigue a 50 negocios",
      isUnlocked: (currentUser.stats?.followingCount || 0) >= 50,
      progress: currentUser.stats?.followingCount || 0,
      maxProgress: 50,
    },
  ];

  const dailyChallenges: DailyChallenge[] = [
    {
      id: "1",
      title: "Explorador del día",
      description: "Visita 2 negocios nuevos",
      progress: 1,
      maxProgress: 2,
      reward: 20,
      isCompleted: false,
      icon: "🗺️",
    },
    {
      id: "2", 
      title: "Crítico activo",
      description: "Deja una reseña",
      progress: 0,
      maxProgress: 1,
      reward: 15,
      isCompleted: false,
      icon: "✍️",
    },
    {
      id: "3",
      title: "Socializador",
      description: "Sigue a 3 negocios",
      progress: 2,
      maxProgress: 3,
      reward: 10,
      isCompleted: false,
      icon: "👥",
    },
  ];

  // 🗺️ Datos simulados para planes personalizados
  const customPlans: CustomPlan[] = [];

  const getTabText = (tab: TabType): string => {
    switch (tab) {
      case "activity":
        return "Actividad";
      case "favorites":
        return "Favoritos";
      case "plans":
        return "Mis Planes";
      case "challenges":
        return "Desafíos";
      default:
        return "";
    }
  };

  // 🎮 Calcular progreso de nivel
  const levelProgress = ((currentUser.experience || 0) / (currentUser.experienceToNextLevel || 100)) * 100;

  // 🎮 Generar color de nivel
  const getLevelColor = (level: number): string => {
    if (level < 5) return themeColors.success;
    if (level < 10) return themeColors.warning;
    if (level < 15) return themeColors.accent;
    return themeColors.primary;
  };

  // 🗺️ Funciones helper para planes
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Fácil": return themeColors.success;
      case "Moderado": return themeColors.warning;
      case "Avanzado": return themeColors.error;
      default: return themeColors.primary;
    }
  };

  const getCostColor = (cost: string): string => {
    switch (cost) {
      case "$": return themeColors.success;
      case "$$": return themeColors.warning;
      case "$$$": return themeColors.error;
      default: return themeColors.primary;
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case "Restaurante": return "🍽️";
      case "Cafetería": return "☕";
      case "Hospedaje": return "🏨";
      case "Atracción": return "🎯";
      case "Cultural": return "🎨";
      case "Mercado": return "🛒";
      case "Bar": return "🍻";
      case "Entretenimiento": return "🎵";
      default: return "📍";
    }
  };

  // 🗺️ Funciones para manejar planes
  const handleCreatePlan = () => {
    setIsCreatingPlan(true);
    // Aquí se abriría un modal o navegaría a una pantalla de creación
    console.log("Crear nuevo plan");
  };

  const handleEditPlan = (planId: string) => {
    console.log("Editar plan:", planId);
    // Navegar a pantalla de edición
  };

  const handleSharePlan = (planId: string) => {
    console.log("Compartir plan:", planId);
    // Abrir modal de compartir
  };

  const handleStartRoute = (planId: string) => {
    console.log("Iniciar ruta:", planId);
    // Navegar a la vista de navegación del plan
  };

  // Función para manejar el logout
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              // La navegación se manejará automáticamente por el AuthContext
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión. Inténtalo de nuevo.');
            }
          }
        }
      ]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <Ionicons key={i} name="star" size={14} color={themeColors.warning} />
    ));
  };

  const renderActivityItem = (act: UserActivity) => (
    <View key={act.id} style={styles.activityCard}>
      {act.type === "review" && (
        <>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Reseña en {act.business}</Text>
            <View style={styles.activityReward}>
              <Text style={styles.activityDate}>{act.relativeDate}</Text>
              {act.coinsEarned && (
                <Text style={[styles.coinsEarned, { color: themeColors.warning }]}>
                  +{act.coinsEarned} 🪙
                </Text>
              )}
            </View>
          </View>
          <View style={styles.starsRow}>
            {renderStars(act.rating || 0)}
          </View>
          <Text style={styles.activityComment}>{act.comment}</Text>
          {act.experienceGained && (
            <Text style={[styles.experienceGained, { color: themeColors.primary }]}>
              +{act.experienceGained} XP
            </Text>
          )}
        </>
      )}
      {act.type === "plan" && (
        <>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Plan creado</Text>
            <View style={styles.activityReward}>
              <Text style={styles.activityDate}>{act.relativeDate}</Text>
              {act.coinsEarned && (
                <Text style={[styles.coinsEarned, { color: themeColors.warning }]}>
                  +{act.coinsEarned} 🪙
                </Text>
              )}
            </View>
          </View>
          <Text style={styles.planTitle}>{act.title}</Text>
          {act.description && (
            <Text style={styles.planServices}>{act.description}</Text>
          )}
          {act.experienceGained && (
            <Text style={[styles.experienceGained, { color: themeColors.primary }]}>
              +{act.experienceGained} XP
            </Text>
          )}
        </>
      )}
      {act.type === "coupon" && (
        <>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Cupón usado en {act.business}</Text>
            <Text style={styles.activityDate}>{act.relativeDate}</Text>
          </View>
          <Text style={styles.planTitle}>{act.title}</Text>
          {act.experienceGained && (
            <Text style={[styles.experienceGained, { color: themeColors.primary }]}>
              +{act.experienceGained} XP
            </Text>
          )}
        </>
      )}
      {act.type === "achievement" && (
        <>
          <View style={styles.activityHeader}>
            <Text style={[styles.activityTitle, { color: themeColors.accent }]}>
              {act.title}
            </Text>
            <View style={styles.activityReward}>
              <Text style={styles.activityDate}>{act.relativeDate}</Text>
              {act.coinsEarned && (
                <Text style={[styles.coinsEarned, { color: themeColors.warning }]}>
                  +{act.coinsEarned} 🪙
                </Text>
              )}
            </View>
          </View>
          {act.experienceGained && (
            <Text style={[styles.experienceGained, { color: themeColors.primary }]}>
              +{act.experienceGained} XP
            </Text>
          )}
        </>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "activity":
        return (
          <View style={styles.tabContent}>
            {activityLoading ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <Loading />
                <Text style={{ marginTop: 8, color: colors.text }}>Cargando actividad...</Text>
              </View>
            ) : activityError ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <Text style={{ color: Colors.error, textAlign: 'center' }}>
                  Error al cargar actividad
                </Text>
                <TouchableOpacity 
                  style={{ marginTop: 8, padding: 8 }}
                  onPress={() => authUser?.id && loadActivity(authUser.id)}
                >
                  <Text style={{ color: Colors.primary }}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            ) : activities.length > 0 ? (
              activities.map(renderActivityItem)
            ) : (
              <Text style={styles.emptyText}>No hay actividad reciente</Text>
            )}
          </View>
        );
        case "favorites":
          return (
            <View style={styles.tabContent}>
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>❤️</Text>
                <Text style={styles.emptyTitle}>No tienes favoritos aún</Text>
                <Text style={styles.emptySubtitle}>
                  Los videos que marques como favoritos aparecerán aquí
                </Text>
              </View>
            </View>
          );
      case "plans":
        return (
          <View style={styles.tabContent}>
            <View style={styles.plansHeader}>
              <Text style={[styles.sectionTitle, { color: Colors.secondary, marginBottom: 8 }]}>
                Mis Planes Personalizados
              </Text>
              <Text style={[styles.plansSubtitle, { color: Colors.gray600, marginBottom: 16 }]}>
                Rutas y experiencias que has creado para compartir
              </Text>
              <TouchableOpacity 
                style={[styles.createPlanButton, { backgroundColor: themeColors.primary }]}
                onPress={handleCreatePlan}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={[styles.createPlanText, { color: "white" }]}>
                  Crear Nuevo Plan
                </Text>
              </TouchableOpacity>
            </View>

            {customPlans.length > 0 ? (
              customPlans.map((plan) => (
                <View key={plan.id} style={[styles.planCard, { backgroundColor: Colors.white }]}>
                  {/* Header del plan */}
                  <View style={styles.planHeader}>
                    <Image source={{ uri: plan.coverImage }} style={styles.planCoverImage} />
                    <View style={styles.planHeaderInfo}>
                      <View style={styles.planTitleRow}>
                        <Text style={[styles.planCardTitle, { color: Colors.secondary }]}>
                          {plan.title}
                        </Text>
                        <View style={styles.planVisibilityBadge}>
                          <Ionicons 
                            name={plan.isPublic ? "globe-outline" : "lock-closed-outline"} 
                            size={12} 
                            color={plan.isPublic ? themeColors.success : Colors.gray500} 
                          />
                          <Text style={[
                            styles.planVisibilityText, 
                            { color: plan.isPublic ? themeColors.success : Colors.gray500 }
                          ]}>
                            {plan.isPublic ? "Público" : "Privado"}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.planDescription, { color: Colors.gray600 }]}>
                        {plan.description}
                      </Text>
                      
                      {/* Badges informativos */}
                      <View style={styles.planBadges}>
                        <View style={[styles.planBadge, { backgroundColor: getDifficultyColor(plan.difficulty) }]}>
                          <Text style={styles.planBadgeText}>{plan.difficulty}</Text>
                        </View>
                        <View style={[styles.planBadge, { backgroundColor: getCostColor(plan.totalCost) }]}>
                          <Text style={styles.planBadgeText}>{plan.totalCost}</Text>
                        </View>
                        <View style={[styles.planBadge, { backgroundColor: themeColors.primary }]}>
                          <Text style={styles.planBadgeText}>{formatTime(plan.totalTime)}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Stats del plan */}
                  <View style={styles.planStats}>
                    <View style={styles.planStatItem}>
                      <Ionicons name="heart-outline" size={16} color={themeColors.error} />
                      <Text style={[styles.planStatText, { color: Colors.gray600 }]}>
                        {plan.likes} likes
                      </Text>
                    </View>
                    <View style={styles.planStatItem}>
                      <Ionicons name="bookmark-outline" size={16} color={themeColors.warning} />
                      <Text style={[styles.planStatText, { color: Colors.gray600 }]}>
                        {plan.saves} guardados
                      </Text>
                    </View>
                    <View style={styles.planStatItem}>
                      <Ionicons name="business-outline" size={16} color={themeColors.primary} />
                      <Text style={[styles.planStatText, { color: Colors.gray600 }]}>
                        {plan.businesses.length} lugares
                      </Text>
                    </View>
                  </View>

                  {/* Tags */}
                  <View style={styles.planTags}>
                    {plan.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={[styles.planTag, { backgroundColor: Colors.gray100 }]}>
                        <Text style={[styles.planTagText, { color: Colors.gray700 }]}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                    {plan.tags.length > 3 && (
                      <Text style={[styles.planTagMore, { color: Colors.gray600 }]}>
                        +{plan.tags.length - 3} más
                      </Text>
                    )}
                  </View>

                  {/* Lista de negocios del plan */}
                  <View style={styles.planBusinesses}>
                    <Text style={[styles.planBusinessesTitle, { color: Colors.secondary }]}>
                      Ruta del Plan:
                    </Text>
                    {plan.businesses.map((business, index) => (
                      <View key={business.id} style={styles.businessItem}>
                        <View style={styles.businessNumber}>
                          <Text style={[styles.businessNumberText, { color: "white" }]}>
                            {index + 1}
                          </Text>
                        </View>
                        <Image source={{ uri: business.image }} style={styles.businessImage} />
                        <View style={styles.businessInfo}>
                          <View style={styles.businessHeader}>
                            <Text style={[styles.businessName, { color: Colors.secondary }]}>
                              {getCategoryIcon(business.category)} {business.name}
                            </Text>
                            <View style={styles.businessRating}>
                              <Ionicons name="star" size={12} color={themeColors.warning} />
                              <Text style={[styles.businessRatingText, { color: Colors.gray600 }]}>
                                {business.rating}
                              </Text>
                            </View>
                          </View>
                          <Text style={[styles.businessCategory, { color: Colors.gray600 }]}>
                            {business.category} • {business.priceRange} • {formatTime(business.estimatedTime)}
                          </Text>
                          <Text style={[styles.businessDescription, { color: Colors.gray500 }]}>
                            {business.description}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Acciones del plan */}
                  <View style={styles.planActions}>
                    <TouchableOpacity 
                      style={[styles.planActionButton, { backgroundColor: Colors.gray100 }]}
                      onPress={() => handleEditPlan(plan.id)}
                    >
                      <Ionicons name="create-outline" size={18} color={themeColors.primary} />
                      <Text style={[styles.planActionText, { color: themeColors.primary }]}>
                        Editar
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.planActionButton, { backgroundColor: Colors.gray100 }]}
                      onPress={() => handleSharePlan(plan.id)}
                    >
                      <Ionicons name="share-outline" size={18} color={themeColors.secondary} />
                      <Text style={[styles.planActionText, { color: themeColors.secondary }]}>
                        Compartir
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.planActionButton, { backgroundColor: themeColors.primary }]}
                      onPress={() => handleStartRoute(plan.id)}
                    >
                      <Ionicons name="play-outline" size={18} color="white" />
                      <Text style={[styles.planActionText, { color: "white" }]}>
                        Iniciar Ruta
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyPlansContainer}>
                <Text style={styles.emptyPlansIcon}>🗺️</Text>
                <Text style={[styles.emptyPlansTitle, { color: Colors.secondary }]}>
                  No tienes planes creados
                </Text>
                <Text style={[styles.emptyPlansSubtitle, { color: Colors.gray600 }]}>
                  Crea tu primer plan personalizado combinando tus lugares favoritos
                </Text>
              </View>
            )}
          </View>
        );
      case "challenges":
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { color: Colors.secondary, marginBottom: 16 }]}>
              Desafíos Diarios
            </Text>
            {dailyChallenges.map((challenge) => (
              <View key={challenge.id} style={[styles.challengeCard, { backgroundColor: Colors.white }]}>
                <View style={styles.challengeHeader}>
                  <Text style={styles.challengeIcon}>{challenge.icon}</Text>
                  <View style={styles.challengeInfo}>
                    <Text style={[styles.challengeTitle, { color: Colors.secondary }]}>
                      {challenge.title}
                    </Text>
                    <Text style={[styles.challengeDescription, { color: Colors.gray600 }]}>
                      {challenge.description}
                    </Text>
                  </View>
                  <View style={styles.challengeReward}>
                    <Text style={[styles.challengeCoins, { color: themeColors.warning }]}>
                      +{challenge.reward} 🪙
                    </Text>
                  </View>
                </View>
                <View style={styles.challengeProgressContainer}>
                  <View style={styles.challengeProgressBar}>
                    <View 
                      style={[
                        styles.challengeProgressFill, 
                        { 
                          width: `${(challenge.progress / challenge.maxProgress) * 100}%`,
                          backgroundColor: challenge.isCompleted ? themeColors.success : themeColors.primary
                        }
                      ]}
                    />
                  </View>
                  <Text style={[styles.challengeProgressText, { color: Colors.gray600 }]}>
                    {challenge.progress}/{challenge.maxProgress}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      {/* 🔹 Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <TouchableOpacity 
            style={styles.settingsBtn}
            onPress={handleLogout}
            disabled={authLoading}
          >
            <Ionicons 
              name="log-out-outline" 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>

        {/* 🔹 Info */}
        <View style={styles.profileInfo}>
          <Image
            source={{ 
              uri: currentUser.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{currentUser.full_name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="white" />
              <Text style={styles.locationText}>{currentUser.city}</Text>
            </View>
            <Text style={styles.profileBio}>{currentUser.bio || 'Sin biografía'}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Stats gamificados */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.levelBadge, { backgroundColor: getLevelColor(currentUser.level || 1) }]}>
              <Text style={styles.levelText}>LV{currentUser.level || 1}</Text>
            </View>
            <Text style={styles.statLabel}>Nivel</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser.wallet?.balance || 0}</Text>
            <Text style={styles.statLabel}>Coins</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.streakContainer}>
              <Text style={styles.streakNumber}>{currentUser.streak || 0}</Text>
            </View>
            <Text style={styles.statLabel}>Racha</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser.stats?.followingCount || 0}</Text>
            <Text style={styles.statLabel}>Siguiendo</Text>
          </View>
        </View>

        {/* 🔹 Barra de progreso de nivel */}
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {currentUser.experience || 0}/{currentUser.experienceToNextLevel || 100} XP
            </Text>
            <Text style={styles.progressNext}>
              {(currentUser.experienceToNextLevel || 100) - (currentUser.experience || 0)} para nivel {(currentUser.level || 1) + 1}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${levelProgress}%`,
                  backgroundColor: getLevelColor(currentUser.level || 1)
                }
              ]}
            />
          </View>
        </View>

        {/* 🔹 Interests */}
        <View style={styles.interestsContainer}>
          {(currentUser.interests || []).map((interest: string, index: number) => (
            <View key={`${interest}-${index}`} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 🔹 Achievements gamificados */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Logros</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement, index) => (
            <View key={index} style={[
              styles.achievementCard,
              { backgroundColor: achievement.isUnlocked ? Colors.white : Colors.gray200 }
            ]}>
              <Text style={[
                styles.achievementIcon,
                { opacity: achievement.isUnlocked ? 1 : 0.5 }
              ]}>
                {achievement.icon}
              </Text>
              <View style={styles.achievementInfo}>
                <Text style={[
                  styles.achievementTitle,
                  { color: achievement.isUnlocked ? Colors.secondary : Colors.gray500 }
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDesc,
                  { color: achievement.isUnlocked ? Colors.gray600 : Colors.gray400 }
                ]}>
                  {achievement.desc}
                </Text>
                {achievement.progress !== undefined && achievement.maxProgress && (
                  <View style={styles.achievementProgressContainer}>
                    <View style={styles.achievementProgressBar}>
                      <View 
                        style={[
                          styles.achievementProgressFill, 
                          { 
                            width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                            backgroundColor: achievement.isUnlocked ? themeColors.success : themeColors.primary
                          }
                        ]}
                      />
                    </View>
                    <Text style={[styles.achievementProgressText, { color: Colors.gray600 }]}>
                      {achievement.progress}/{achievement.maxProgress}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 🔹 Tabs */}
      <View style={styles.tabsContainer}>
        {(["activity", "challenges", "favorites", "plans"] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}
            >
              {getTabText(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔹 Content */}
      {renderTabContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsBtn: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    color: 'white',
    marginLeft: 4,
  },
  profileBio: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  editBtn: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  interestsContainer: {
    paddingVertical: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: 'white',
    fontSize: 14,
  },
  achievementsSection: {
    padding: 16,
    backgroundColor: Colors.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.secondary,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondary,
  },
  achievementDesc: {
    fontSize: 12,
    color: Colors.gray600,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray300,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    color: Colors.gray600,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  activityCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondary,
  },
  activityDate: {
    fontSize: 12,
    color: Colors.gray600,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  activityComment: {
    color: Colors.gray600,
    fontSize: 14,
  },
  planTitle: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 2,
  },
  planServices: {
    fontSize: 12,
    color: Colors.gray600,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.gray600,
    fontSize: 16,
    marginTop: 20,
  },
  // 🎮 Estilos de gamificación
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNumber: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: 'bold',
    marginRight: 4,
  },
  streakIcon: {
    fontSize: 16,
  },
  progressContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  progressNext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  activityReward: {
    alignItems: 'flex-end',
  },
  coinsEarned: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  experienceGained: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'right',
  },
  // Estilos para challenges
  challengeCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  challengeDescription: {
    fontSize: 14,
  },
  challengeReward: {
    alignItems: 'flex-end',
  },
  challengeCoins: {
    fontSize: 14,
    fontWeight: '600',
  },
  challengeProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  challengeProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  challengeProgressText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'center',
  },
  // Estilos para achievements mejorados
  achievementProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  achievementProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 6,
  },
  achievementProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  achievementProgressText: {
    fontSize: 10,
    fontWeight: '500',
    minWidth: 30,
    textAlign: 'center',
  },
  // 🗺️ Estilos para planes personalizados
  plansHeader: {
    marginBottom: 20,
  },
  plansSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  createPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 8,
  },
  createPlanText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  planCard: {
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  planCoverImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  planHeaderInfo: {
    flex: 1,
  },
  planTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  planCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  planVisibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  planVisibilityText: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 4,
  },
  planDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  planBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  planStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray200,
    marginVertical: 12,
  },
  planStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planStatText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  planTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  planTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  planTagMore: {
    fontSize: 12,
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  planBusinesses: {
    marginBottom: 12,
  },
  planBusinessesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  businessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  businessNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  businessNumberText: {
    fontSize: 12,
    fontWeight: '600',
  },
  businessImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  businessInfo: {
    flex: 1,
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  businessName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  businessRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  businessRatingText: {
    fontSize: 12,
    marginLeft: 2,
    fontWeight: '500',
  },
  businessCategory: {
    fontSize: 12,
    marginBottom: 2,
  },
  businessDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  planActions: {
    flexDirection: 'row',
    gap: 8,
  },
  planActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  planActionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyPlansContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPlansIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyPlansTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyPlansSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  // Estilos para contenedores vacíos mejorados
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: Colors.secondary,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    color: Colors.gray600,
  },
});