import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database';
import { useCallback, useEffect, useState } from 'react';

// Tipos para los datos extendidos del usuario
export interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface CoinTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'earn' | 'spend';
  description: string;
  created_at: string;
}

export interface UserStats {
  totalReviews: number;
  totalPlans: number;
  followingCount: number;
  favoritesCount: number;
  videosLiked: number;
  plansLiked: number;
}

export interface ExtendedUserProfile extends Profile {
  wallet?: UserWallet;
  stats?: UserStats;
  recentTransactions?: CoinTransaction[];
  level?: number;
  experience?: number;
  experienceToNextLevel?: number;
  streak?: number;
  badges?: string[];
}

export interface UseUserProfileReturn {
  userProfile: ExtendedUserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<ExtendedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserWallet = useCallback(async (userId: string): Promise<UserWallet | null> => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.warn('Error fetching wallet:', error.message);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in fetchUserWallet:', err);
      return null;
    }
  }, []);

  const fetchUserStats = useCallback(async (userId: string): Promise<UserStats> => {
    try {
      // Obtener estadísticas en paralelo
      const [
        reviewsResponse,
        plansResponse,
        followingResponse,
        favoritesResponse,
        videoLikesResponse,
        planLikesResponse
      ] = await Promise.allSettled([
        // Total de reviews del usuario
        supabase
          .from('business_reviews')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        
        // Total de planes creados
        supabase
          .from('user_plans')
          .select('id', { count: 'exact', head: true })
          .eq('creator_id', userId),
        
        // Total de negocios que sigue
        supabase
          .from('user_follows')
          .select('id', { count: 'exact', head: true })
          .eq('follower_id', userId),
        
        // Total de videos favoritos
        supabase
          .from('user_favorites')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        
        // Total de videos que le ha dado like
        supabase
          .from('video_likes')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
        
        // Total de planes que le ha dado like
        supabase
          .from('plan_likes')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
      ]);

      const stats: UserStats = {
        totalReviews: reviewsResponse.status === 'fulfilled' ? reviewsResponse.value.count || 0 : 0,
        totalPlans: plansResponse.status === 'fulfilled' ? plansResponse.value.count || 0 : 0,
        followingCount: followingResponse.status === 'fulfilled' ? followingResponse.value.count || 0 : 0,
        favoritesCount: favoritesResponse.status === 'fulfilled' ? favoritesResponse.value.count || 0 : 0,
        videosLiked: videoLikesResponse.status === 'fulfilled' ? videoLikesResponse.value.count || 0 : 0,
        plansLiked: planLikesResponse.status === 'fulfilled' ? planLikesResponse.value.count || 0 : 0,
      };

      return stats;
    } catch (err) {
      console.error('Error in fetchUserStats:', err);
      return {
        totalReviews: 0,
        totalPlans: 0,
        followingCount: 0,
        favoritesCount: 0,
        videosLiked: 0,
        plansLiked: 0,
      };
    }
  }, []);

  const fetchRecentTransactions = useCallback(async (userId: string): Promise<CoinTransaction[]> => {
    try {
      const { data, error } = await supabase
        .from('coin_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.warn('Error fetching transactions:', error.message);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in fetchRecentTransactions:', err);
      return [];
    }
  }, []);

  // Función para calcular gamificación basada en stats
  const calculateGamification = useCallback((stats: UserStats, transactions: CoinTransaction[]): {
    level: number;
    experience: number;
    experienceToNextLevel: number;
    streak: number;
    badges: string[];
  } => {
    // Calcular experiencia total basada en actividades
    const reviewExperience = stats.totalReviews * 25;
    const planExperience = stats.totalPlans * 50;
    const socialExperience = (stats.videosLiked + stats.plansLiked) * 5;
    const followExperience = stats.followingCount * 10;
    
    const totalExperience = reviewExperience + planExperience + socialExperience + followExperience;
    
    // Calcular nivel (cada nivel requiere más experiencia)
    let level = 1;
    let experienceForCurrentLevel = 0;
    const baseExpPerLevel = 100;
    
    while (experienceForCurrentLevel + (baseExpPerLevel * level) <= totalExperience) {
      experienceForCurrentLevel += baseExpPerLevel * level;
      level++;
    }
    
    const experience = totalExperience - experienceForCurrentLevel;
    const experienceToNextLevel = baseExpPerLevel * level;
    
    // Calcular racha simple (días consecutivos con actividad)
    // Por simplicidad, calculamos basado en transacciones recientes
    const today = new Date();
    const recentDays = 7;
    let streak = 0;
    
    for (let i = 0; i < recentDays; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];
      
      const hasActivity = transactions.some(transaction => 
        transaction.created_at.startsWith(dateString)
      );
      
      if (hasActivity) {
        streak = i + 1;
      } else {
        break;
      }
    }
    
    // Calcular badges basado en logros
    const badges: string[] = [];
    
    if (stats.totalReviews >= 1) badges.push('first_reviewer');
    if (stats.totalReviews >= 10) badges.push('critic');
    if (stats.totalReviews >= 25) badges.push('super_critic');
    
    if (stats.totalPlans >= 1) badges.push('planner');
    if (stats.totalPlans >= 5) badges.push('master_planner');
    
    if (stats.followingCount >= 10) badges.push('explorer');
    if (stats.followingCount >= 25) badges.push('local_expert');
    
    if (level >= 5) badges.push('experienced');
    if (level >= 10) badges.push('veteran');
    
    if (streak >= 7) badges.push('consistent');
    if (streak >= 30) badges.push('dedicated');
    
    return {
      level,
      experience,
      experienceToNextLevel,
      streak,
      badges
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Obtener datos del usuario en paralelo
      const [wallet, stats, transactions] = await Promise.all([
        fetchUserWallet(user.id),
        fetchUserStats(user.id),
        fetchRecentTransactions(user.id)
      ]);

      // Calcular gamificación
      const gamification = calculateGamification(stats, transactions);

      // Combinar todos los datos
      const extendedProfile: ExtendedUserProfile = {
        ...user,
        wallet: wallet || undefined,
        stats,
        recentTransactions: transactions,
        ...gamification
      };

      setUserProfile(extendedProfile);
    } catch (err: any) {
      console.error('Error refreshing user profile:', err);
      setError(err.message || 'Error al cargar el perfil del usuario');
    } finally {
      setLoading(false);
    }
  }, [user, fetchUserWallet, fetchUserStats, fetchRecentTransactions, calculateGamification]);

  // Cargar datos cuando cambie el usuario
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return {
    userProfile,
    loading,
    error,
    refreshProfile
  };
}