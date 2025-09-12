import { supabase } from '@/lib/supabase';
import { useCallback, useState } from 'react';

// Tipos para la actividad del usuario
export interface UserActivity {
  id: string;
  type: 'review' | 'plan' | 'coupon' | 'achievement' | 'like' | 'follow';
  title: string;
  description?: string;
  business?: string;
  rating?: number;
  comment?: string;
  servicesCount?: number;
  coinsEarned?: number;
  experienceGained?: number;
  date: string;
  relativeDate: string;
}

export interface UseUserActivityReturn {
  activities: UserActivity[];
  loading: boolean;
  error: string | null;
  loadActivity: (userId: string) => Promise<void>;
}

export function useUserActivity(): UseUserActivityReturn {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper para formatear fechas relativas
  const getRelativeDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `${diffDays} días`;
    if (diffDays < 14) return '1 semana';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 60) return '1 mes';
    return `${Math.floor(diffDays / 30)} meses`;
  }, []);

  const loadActivity = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const userActivities: UserActivity[] = [];

      // Obtener reviews recientes del usuario
      try {
        const { data: reviews, error: reviewsError } = await supabase
          .from('business_reviews')
          .select(`
            id,
            rating,
            comment,
            created_at,
            business:businesses!inner(name)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (!reviewsError && reviews) {
          reviews.forEach((review: any) => {
            userActivities.push({
              id: `review-${review.id}`,
              type: 'review',
              title: `Reseña en ${review.business?.name || 'Negocio'}`,
              business: review.business?.name,
              rating: review.rating,
              comment: review.comment,
              date: review.created_at,
              relativeDate: getRelativeDate(review.created_at),
              coinsEarned: 15,
              experienceGained: 25
            });
          });
        }
      } catch (err) {
        console.warn('Error fetching reviews:', err);
      }

      // Obtener planes creados recientemente
      try {
        const { data: plans, error: plansError } = await supabase
          .from('user_plans')
          .select('id, title, description, created_at')
          .eq('creator_id', userId)
          .order('created_at', { ascending: false })
          .limit(3);

        if (!plansError && plans) {
          plans.forEach((plan: any) => {
            userActivities.push({
              id: `plan-${plan.id}`,
              type: 'plan',
              title: plan.title,
              description: plan.description,
              date: plan.created_at,
              relativeDate: getRelativeDate(plan.created_at),
              coinsEarned: 10,
              experienceGained: 50
            });
          });
        }
      } catch (err) {
        console.warn('Error fetching plans:', err);
      }

      // Obtener cupones comprados recientemente
      try {
        const { data: userCoupons, error: couponsError } = await supabase
          .from('user_coupons')
          .select(`
            id,
            purchased_at,
            coupon:coupons!inner(
              title,
              coin_price,
              business:businesses!inner(name)
            )
          `)
          .eq('user_id', userId)
          .order('purchased_at', { ascending: false })
          .limit(5);

        if (!couponsError && userCoupons) {
          userCoupons.forEach((userCoupon: any) => {
            userActivities.push({
              id: `coupon-${userCoupon.id}`,
              type: 'coupon',
              title: `Cupón usado: ${userCoupon.coupon?.title || 'Cupón'}`,
              business: userCoupon.coupon?.business?.name,
              date: userCoupon.purchased_at,
              relativeDate: getRelativeDate(userCoupon.purchased_at),
              experienceGained: 10
            });
          });
        }
      } catch (err) {
        console.warn('Error fetching coupons:', err);
      }

      // Obtener transacciones para identificar logros
      try {
        const { data: transactions, error: transactionsError } = await supabase
          .from('coin_transactions')
          .select('*')
          .eq('user_id', userId)
          .eq('type', 'earn')
          .order('created_at', { ascending: false })
          .limit(10);

        if (!transactionsError && transactions) {
          const achievementTransactions = transactions.filter(
            (t: any) => t.description?.includes('logro') || 
                       t.description?.includes('achievement') || 
                       t.amount >= 25
          );

          achievementTransactions.slice(0, 2).forEach((transaction: any) => {
            userActivities.push({
              id: `achievement-${transaction.id}`,
              type: 'achievement',
              title: '🏆 ' + (transaction.description || 'Nuevo logro desbloqueado'),
              date: transaction.created_at,
              relativeDate: getRelativeDate(transaction.created_at),
              coinsEarned: transaction.amount,
              experienceGained: transaction.amount * 2
            });
          });
        }
      } catch (err) {
        console.warn('Error fetching transactions:', err);
      }

      // Ordenar todas las actividades por fecha
      userActivities.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Limitar a las 10 actividades más recientes
      setActivities(userActivities.slice(0, 10));

    } catch (err: any) {
      console.error('Error loading user activity:', err);
      setError(err.message || 'Error al cargar la actividad del usuario');
    } finally {
      setLoading(false);
    }
  }, [getRelativeDate]);

  return {
    activities,
    loading,
    error,
    loadActivity
  };
}