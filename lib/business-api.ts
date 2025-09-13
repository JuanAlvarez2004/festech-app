import type { BusinessWithOwner, VideoWithBusiness } from '@/types';
import { supabase } from './supabase';

export interface GetBusinessParams {
  businessId: string;
  userId?: string;
}

export interface BusinessDetailResponse extends BusinessWithOwner {
  videos: VideoWithBusiness[];
  isFollowing?: boolean;
  stats?: BusinessStats;
}

export interface BusinessStats {
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
  totalViews: number;
  totalLikes: number;
  totalFollowers: number;
  averageEngagement: number;
}

/**
 * Obtiene información completa de un negocio incluyendo videos y estadísticas
 */
export const getBusinessDetail = async (params: GetBusinessParams): Promise<BusinessDetailResponse> => {
  const { businessId, userId } = params;

  try {
    // Obtener información básica del negocio
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select(`
        id,
        owner_id,
        name,
        category,
        description,
        phone,
        address,
        full_address,
        neighborhood,
        latitude,
        longitude,
        logo_url,
        cover_image_url,
        whatsapp,
        schedule,
        social_media,
        services,
        price_range,
        is_active,
        rating_average,
        total_reviews,
        followers_count,
        created_at,
        owner:profiles!businesses_owner_id_fkey (
          id,
          email,
          full_name,
          user_type,
          phone,
          city,
          avatar_url,
          bio,
          interests,
          date_of_birth,
          created_at
        )
      `)
      .eq('id', businessId)
      .eq('is_active', true)
      .single();

    if (businessError || !business) {
      throw new Error(`Negocio no encontrado: ${businessError?.message}`);
    }

    // Verificar si el usuario sigue al negocio
    let isFollowing = false;
    if (userId) {
      const { data: followData } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', userId)
        .eq('business_id', businessId)
        .single();
      
      isFollowing = !!followData;
    }

    // Obtener videos del negocio
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select(`
        id,
        business_id,
        title,
        description,
        video_url,
        thumbnail_url,
        duration,
        file_size,
        location_lat,
        location_lng,
        location_name,
        tags,
        views_count,
        likes_count,
        coupon_id,
        has_active_coupon,
        is_active,
        created_at,
        coupon:coupons!videos_coupon_id_fkey (
          id,
          title,
          description,
          discount_type,
          discount_value,
          coin_price,
          max_uses,
          current_uses,
          is_active,
          expires_at
        )
      `)
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (videosError) {
      console.error('Error obteniendo videos del negocio:', videosError);
    }

    // Obtener likes del usuario para los videos
    let userLikes: string[] = [];
    if (userId && videos && videos.length > 0) {
      const { data: likes } = await supabase
        .from('video_likes')
        .select('video_id')
        .eq('user_id', userId)
        .in('video_id', videos.map(v => v.id));
      
      userLikes = likes?.map(like => like.video_id) || [];
    }

    // Procesar videos con información adicional
    const processedVideos: VideoWithBusiness[] = (videos || []).map(video => ({
      ...video,
      business: {
        ...business,
        owner: Array.isArray(business.owner) ? business.owner[0] : business.owner
      },
      liked: userLikes.includes(video.id),
      likesCount: video.likes_count,
      coupon: video.coupon ? {
        ...(Array.isArray(video.coupon) ? video.coupon[0] : video.coupon),
        business_id: businessId,
        created_at: new Date().toISOString()
      } : undefined,
      has_active_coupon: video.has_active_coupon || false
    }));

    // Obtener estadísticas (solo para el propietario)
    let stats: BusinessStats | undefined;
    if (userId === business.owner_id) {
      stats = await getBusinessStats(businessId);
    }

    const result: BusinessDetailResponse = {
      ...business,
      owner: Array.isArray(business.owner) ? business.owner[0] : business.owner,
      followed: isFollowing,
      isFollowing,
      videos: processedVideos,
      stats
    };

    return result;
  } catch (error) {
    console.error('Error obteniendo detalles del negocio:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas detalladas del negocio
 */
export const getBusinessStats = async (businessId: string): Promise<BusinessStats> => {
  try {
    // Calcular fechas para este mes y el mes pasado
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Obtener estadísticas de videos de este mes
    const { data: thisMonthVideos } = await supabase
      .from('videos')
      .select('views_count, likes_count')
      .eq('business_id', businessId)
      .gte('created_at', thisMonthStart.toISOString());

    // Obtener estadísticas de videos del mes pasado
    const { data: lastMonthVideos } = await supabase
      .from('videos')
      .select('views_count, likes_count')
      .eq('business_id', businessId)
      .gte('created_at', lastMonthStart.toISOString())
      .lte('created_at', lastMonthEnd.toISOString());

    // Obtener nuevos seguidores de este mes
    const { data: thisMonthFollowers } = await supabase
      .from('user_follows')
      .select('id')
      .eq('business_id', businessId)
      .gte('created_at', thisMonthStart.toISOString());

    // Obtener nuevos seguidores del mes pasado
    const { data: lastMonthFollowers } = await supabase
      .from('user_follows')
      .select('id')
      .eq('business_id', businessId)
      .gte('created_at', lastMonthStart.toISOString())
      .lte('created_at', lastMonthEnd.toISOString());

    // Obtener conversaciones iniciadas este mes
    const { data: thisMonthChats } = await supabase
      .from('conversations')
      .select('id')
      .eq('business_id', businessId)
      .gte('created_at', thisMonthStart.toISOString());

    // Obtener conversaciones iniciadas el mes pasado
    const { data: lastMonthChats } = await supabase
      .from('conversations')
      .select('id')
      .eq('business_id', businessId)
      .gte('created_at', lastMonthStart.toISOString())
      .lte('created_at', lastMonthEnd.toISOString());

    // Calcular totales
    const thisMonthStats = {
      views: thisMonthVideos?.reduce((sum, video) => sum + (video.views_count || 0), 0) || 0,
      likes: thisMonthVideos?.reduce((sum, video) => sum + (video.likes_count || 0), 0) || 0,
      newFollowers: thisMonthFollowers?.length || 0,
      chatsStarted: thisMonthChats?.length || 0,
      conversions: Math.floor((thisMonthChats?.length || 0) * 0.15) // Estimación de conversión del 15%
    };

    const lastMonthStats = {
      views: lastMonthVideos?.reduce((sum, video) => sum + (video.views_count || 0), 0) || 0,
      likes: lastMonthVideos?.reduce((sum, video) => sum + (video.likes_count || 0), 0) || 0,
      newFollowers: lastMonthFollowers?.length || 0,
      chatsStarted: lastMonthChats?.length || 0,
      conversions: Math.floor((lastMonthChats?.length || 0) * 0.15)
    };

    // Obtener totales de todo el tiempo
    const { data: allVideos } = await supabase
      .from('videos')
      .select('views_count, likes_count')
      .eq('business_id', businessId);

    const totalViews = allVideos?.reduce((sum, video) => sum + (video.views_count || 0), 0) || 0;
    const totalLikes = allVideos?.reduce((sum, video) => sum + (video.likes_count || 0), 0) || 0;

    const { data: business } = await supabase
      .from('businesses')
      .select('followers_count')
      .eq('id', businessId)
      .single();

    const totalFollowers = business?.followers_count || 0;
    const averageEngagement = totalViews > 0 ? (totalLikes / totalViews) * 100 : 0;

    return {
      thisMonth: thisMonthStats,
      lastMonth: lastMonthStats,
      totalViews,
      totalLikes,
      totalFollowers,
      averageEngagement
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas del negocio:', error);
    // Retornar estadísticas vacías en caso de error
    return {
      thisMonth: { views: 0, likes: 0, newFollowers: 0, chatsStarted: 0, conversions: 0 },
      lastMonth: { views: 0, likes: 0, newFollowers: 0, chatsStarted: 0, conversions: 0 },
      totalViews: 0,
      totalLikes: 0,
      totalFollowers: 0,
      averageEngagement: 0
    };
  }
};

/**
 * Sigue o deja de seguir un negocio
 */
export const toggleBusinessFollow = async (businessId: string, userId: string): Promise<boolean> => {
  try {
    // Verificar si ya sigue al negocio
    const { data: existingFollow } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', userId)
      .eq('business_id', businessId)
      .single();

    if (existingFollow) {
      // Dejar de seguir
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', userId)
        .eq('business_id', businessId);

      if (error) {
        console.error('Error al dejar de seguir:', error);
        throw error;
      }
      return false; // no siguiendo
    } else {
      // Seguir
      const { error } = await supabase
        .from('user_follows')
        .insert({ follower_id: userId, business_id: businessId });

      if (error) {
        console.error('Error al seguir:', error);
        throw error;
      }
      return true; // siguiendo
    }
  } catch (error) {
    console.error('Error en toggleBusinessFollow:', error);
    throw error;
  }
};

/**
 * Obtiene negocios cercanos a una ubicación
 */
export const getNearbyBusinesses = async (
  latitude: number,
  longitude: number,
  radius: number = 10,
  category?: string,
  limit: number = 20
): Promise<BusinessWithOwner[]> => {
  try {
    let query = supabase
      .from('businesses')
      .select(`
        id,
        owner_id,
        name,
        category,
        description,
        phone,
        address,
        full_address,
        neighborhood,
        latitude,
        longitude,
        logo_url,
        cover_image_url,
        whatsapp,
        schedule,
        social_media,
        services,
        price_range,
        is_active,
        rating_average,
        total_reviews,
        followers_count,
        created_at,
        owner:profiles!businesses_owner_id_fkey (
          id,
          email,
          full_name,
          user_type,
          phone,
          city,
          avatar_url,
          bio,
          interests,
          date_of_birth,
          created_at
        )
      `)
      .eq('is_active', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: businesses, error } = await query;

    if (error) {
      console.error('Error obteniendo negocios cercanos:', error);
      throw error;
    }

    if (!businesses) return [];

    // Filtrar por distancia (implementación simple, para mejor rendimiento usar PostGIS)
    const businessesWithDistance = businesses
      .map(business => {
        if (!business.latitude || !business.longitude) return null;
        
        const distance = calculateDistance(
          latitude,
          longitude,
          business.latitude,
          business.longitude
        );

        return {
          ...business,
          owner: Array.isArray(business.owner) ? business.owner[0] : business.owner,
          distance
        };
      })
      .filter(business => business !== null && business!.distance <= radius)
      .sort((a, b) => a!.distance - b!.distance);

    return businessesWithDistance.filter(b => b !== null) as BusinessWithOwner[];
  } catch (error) {
    console.error('Error en getNearbyBusinesses:', error);
    throw error;
  }
};

/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Busca negocios por texto
 */
export const searchBusinesses = async (
  searchTerm: string,
  category?: string,
  limit: number = 20
): Promise<BusinessWithOwner[]> => {
  try {
    let query = supabase
      .from('businesses')
      .select(`
        id,
        owner_id,
        name,
        category,
        description,
        phone,
        address,
        full_address,
        neighborhood,
        latitude,
        longitude,
        logo_url,
        cover_image_url,
        whatsapp,
        schedule,
        social_media,
        services,
        price_range,
        is_active,
        rating_average,
        total_reviews,
        followers_count,
        created_at,
        owner:profiles!businesses_owner_id_fkey (
          id,
          email,
          full_name,
          user_type,
          phone,
          city,
          avatar_url,
          bio,
          interests,
          date_of_birth,
          created_at
        )
      `)
      .eq('is_active', true)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,services.cs.{${searchTerm}}`)
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: businesses, error } = await query;

    if (error) {
      console.error('Error buscando negocios:', error);
      throw error;
    }

    if (!businesses) return [];

    return businesses.map(business => ({
      ...business,
      owner: Array.isArray(business.owner) ? business.owner[0] : business.owner
    }));
  } catch (error) {
    console.error('Error en searchBusinesses:', error);
    throw error;
  }
};