import React, { useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

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
}

interface ProfileClientProps {
  user: User;
}

type TabType = "activity" | "favorites" | "plans";

interface Activity {
  id: string;
  type: "review" | "plan";
  business?: string;
  rating?: number;
  comment?: string;
  title?: string;
  services?: number;
  date: string;
}

interface Achievement {
  icon: string;
  title: string;
  desc: string;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("activity");

  // 🔹 Dummy data (estos luego los jalas de Supabase)
  const recentActivity: Activity[] = [
    {
      id: "1",
      type: "review",
      business: "La Fonda Criolla",
      rating: 5,
      comment: "Excelente desayuno típico, muy auténtico",
      date: "2 días",
    },
    {
      id: "2",
      type: "plan",
      title: "Mi día perfecto en Ibagué",
      services: 3,
      date: "5 días",
    },
  ];

  const achievements: Achievement[] = [
    { icon: "🏆", title: "Explorador", desc: "Visitó 10 lugares diferentes" },
    { icon: "⭐", title: "Crítico", desc: "Dejó 25 reseñas" },
    { icon: "💎", title: "VIP", desc: "Acumuló 1000+ coins" },
    { icon: "📍", title: "Local", desc: "Conoce Ibagué como su casa" },
  ];

  const getTabText = (tab: TabType): string => {
    switch (tab) {
      case "activity":
        return "Actividad";
      case "favorites":
        return "Favoritos";
      case "plans":
        return "Mis Planes";
      default:
        return "";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <Ionicons key={i} name="star" size={14} color="#FFB400" />
    ));
  };

  const renderActivityItem = (act: Activity) => (
    <View key={act.id} style={styles.activityCard}>
      {act.type === "review" && (
        <>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Reseña en {act.business}</Text>
            <Text style={styles.activityDate}>{act.date}</Text>
          </View>
          <View style={styles.starsRow}>
            {renderStars(act.rating || 0)}
          </View>
          <Text style={styles.activityComment}>{act.comment}</Text>
        </>
      )}
      {act.type === "plan" && (
        <>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Plan creado</Text>
            <Text style={styles.activityDate}>{act.date}</Text>
          </View>
          <Text style={styles.planTitle}>{act.title}</Text>
          <Text style={styles.planServices}>
            {act.services} servicios incluidos
          </Text>
        </>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "activity":
        return (
          <View style={styles.tabContent}>
            {recentActivity.map(renderActivityItem)}
          </View>
        );
      case "favorites":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>No tienes favoritos aún</Text>
          </View>
        );
      case "plans":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>No tienes planes creados</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Info */}
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: user.profileImage }}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{user.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="white" />
              <Text style={styles.locationText}>{user.city}</Text>
            </View>
            <Text style={styles.profileBio}>{user.bio}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.coins}</Text>
            <Text style={styles.statLabel}>Coins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.following}</Text>
            <Text style={styles.statLabel}>Siguiendo</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.favorites}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
        </View>

        {/* 🔹 Interests */}
        <View style={styles.interestsContainer}>
          {user.interests.map((interest, index) => (
            <View key={`${interest}-${index}`} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 🔹 Achievements */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Logros</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDesc}>{achievement.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 🔹 Tabs */}
      <View style={styles.tabsContainer}>
        {(["activity", "favorites", "plans"] as TabType[]).map((tab) => (
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FF5A5F',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1F2937',
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
    backgroundColor: '#F9FAFB',
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
    color: '#1F2937',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF5A5F',
  },
  tabText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF5A5F',
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  activityCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
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
    color: '#1F2937',
  },
  activityDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  activityComment: {
    color: '#6B7280',
    fontSize: 14,
  },
  planTitle: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 2,
  },
  planServices: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 20,
  },
});