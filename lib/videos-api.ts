import type { VideoWithBusiness } from '@/types';
import { supabase } from './supabase';

export interface GetVideosParams {
  page?: number;
  limit?: number;
  userId?: string;
  category?: string;
  userLat?: number;
  userLng?: number;
  radius?: number;
}

export interface GetVideosResponse {
  data: VideoWithBusiness[];
  hasMore: boolean;
  page: number;
  total: number;
}

/**
 * Obtiene videos con información del negocio y datos del usuario (likes, etc.)
 */
export const getVideosWithBusiness = async (params: GetVideosParams = {}): Promise<GetVideosResponse> => {
  const {
    page = 1,
    limit = 10,
    userId,
    category,
    userLat,
    userLng,
    radius = 50 // radio en km
  } = params;

  const offset = (page - 1) * limit;

  let query = supabase
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
      business:businesses!videos_business_id_fkey (
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
        created_at
      ),
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
    .eq('is_active', true)
    .eq('business.is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Filtrar por categoría si se proporciona
  if (category) {
    query = query.eq('business.category', category);
  }

  // Ejecutar la query principal
  const { data: videos, error, count } = await query;

  if (error) {
    console.error('Error obteniendo videos:', error);
    throw new Error(`Error al cargar videos: ${error.message}`);
  }

  if (!videos) {
    return {
      data: [],
      hasMore: false,
      page,
      total: 0
    };
  }

  // Si hay un usuario logueado, obtener sus likes
  let userLikes: string[] = [];
  if (userId) {
    const { data: likes } = await supabase
      .from('video_likes')
      .select('video_id')
      .eq('user_id', userId)
      .in('video_id', videos.map(v => v.id));
    
    userLikes = likes?.map(like => like.video_id) || [];
  }

  // Procesar los videos con la información adicional
  const processedVideos: VideoWithBusiness[] = videos.map(video => {
    // Verificar que el negocio existe
    if (!video.business || Array.isArray(video.business)) {
      console.warn(`Video ${video.id} no tiene negocio asociado`);
      return null;
    }

    const videoWithBusiness: VideoWithBusiness = {
      ...video,
      business: Array.isArray(video.business) ? video.business[0] : video.business,
      liked: userLikes.includes(video.id),
      likesCount: video.likes_count,
      coupon: video.coupon && !Array.isArray(video.coupon) ? video.coupon : undefined,
      has_active_coupon: video.has_active_coupon || false
    };

    return videoWithBusiness;
  }).filter(Boolean) as VideoWithBusiness[];

  // Calcular si hay más páginas
  const hasMore = videos.length === limit;

  return {
    data: processedVideos,
    hasMore,
    page,
    total: count || 0
  };
};

/**
 * Obtiene videos cercanos a una ubicación específica
 */
export const getNearbyVideos = async (
  latitude: number,
  longitude: number,
  radius: number = 50,
  limit: number = 20,
  userId?: string
): Promise<VideoWithBusiness[]> => {
  // Usar la función de Supabase para obtener videos con cupones activos y ubicación
  const { data, error } = await supabase.rpc('get_videos_with_active_coupons', {
    user_lat: latitude,
    user_lng: longitude,
    radius_km: radius,
    limit_results: limit
  });

  if (error) {
    console.error('Error obteniendo videos cercanos:', error);
    throw new Error(`Error al cargar videos cercanos: ${error.message}`);
  }

  if (!data) return [];

  // Si hay un usuario logueado, obtener sus likes
  let userLikes: string[] = [];
  if (userId) {
    const { data: likes } = await supabase
      .from('video_likes')
      .select('video_id')
      .eq('user_id', userId)
      .in('video_id', data.map((v: any) => v.id));
    
    userLikes = likes?.map(like => like.video_id) || [];
  }

  // Procesar y mapear los datos
  return data.map((item: any) => ({
    id: item.id,
    business_id: item.business_id,
    title: item.title,
    description: item.description,
    video_url: item.video_url,
    thumbnail_url: item.thumbnail_url,
    duration: item.duration,
    file_size: item.file_size,
    location_lat: item.location_lat,
    location_lng: item.location_lng,
    location_name: item.location_name,
    tags: item.tags || [],
    views_count: item.views_count,
    likes_count: item.likes_count,
    coupon_id: item.coupon_id,
    has_active_coupon: item.has_active_coupon,
    is_active: item.is_active,
    created_at: item.created_at,
    business: {
      id: item.business_id,
      owner_id: item.business_owner_id,
      name: item.business_name,
      category: item.business_category,
      description: item.business_description,
      phone: item.business_phone,
      address: item.business_address,
      full_address: item.business_full_address,
      neighborhood: item.business_neighborhood,
      latitude: item.business_latitude,
      longitude: item.business_longitude,
      logo_url: item.business_logo_url,
      cover_image_url: item.business_cover_image_url,
      whatsapp: item.business_whatsapp,
      schedule: item.business_schedule,
      social_media: item.business_social_media,
      services: item.business_services,
      price_range: item.business_price_range,
      is_active: item.business_is_active,
      rating_average: item.business_rating_average,
      total_reviews: item.business_total_reviews,
      followers_count: item.business_followers_count,
      created_at: item.business_created_at
    },
    coupon: item.coupon_id ? {
      id: item.coupon_id,
      business_id: item.business_id,
      title: item.coupon_title,
      description: item.coupon_description,
      discount_type: item.coupon_discount_type,
      discount_value: item.coupon_discount_value,
      coin_price: item.coupon_coin_price,
      max_uses: item.coupon_max_uses,
      current_uses: item.coupon_current_uses,
      is_active: item.coupon_is_active,
      expires_at: item.coupon_expires_at,
      created_at: item.coupon_created_at
    } : undefined,
    liked: userLikes.includes(item.id),
    likesCount: item.likes_count,
    distance: item.distance_km
  }));
};

/**
 * Actualiza el conteo de visualizaciones de un video
 */
export const incrementVideoViews = async (videoId: string): Promise<void> => {
  try {
    // Primero obtener el conteo actual
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('views_count')
      .eq('id', videoId)
      .single();

    if (fetchError || !video) {
      console.error('Error obteniendo video para incrementar vistas:', fetchError);
      return;
    }

    // Incrementar las vistas
    const { error: updateError } = await supabase
      .from('videos')
      .update({ views_count: video.views_count + 1 })
      .eq('id', videoId);

    if (updateError) {
      console.error('Error incrementando vistas:', updateError);
    }
  } catch (error) {
    console.error('Error incrementando vistas:', error);
  }
};

/**
 * Maneja el like/unlike de un video
 */
export const toggleVideoLike = async (videoId: string, userId: string): Promise<boolean> => {
  // Verificar si ya existe el like
  const { data: existingLike } = await supabase
    .from('video_likes')
    .select('id')
    .eq('video_id', videoId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    // Quitar like
    const { error } = await supabase
      .from('video_likes')
      .delete()
      .eq('video_id', videoId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error quitando like:', error);
      throw error;
    }
    return false; // no liked
  } else {
    // Agregar like
    const { error } = await supabase
      .from('video_likes')
      .insert({ video_id: videoId, user_id: userId });

    if (error) {
      console.error('Error agregando like:', error);
      throw error;
    }
    return true; // liked
  }
};

/**
 * Obtiene videos de un negocio específico
 */
export const getBusinessVideos = async (
  businessId: string, 
  page: number = 1, 
  limit: number = 10,
  userId?: string
): Promise<GetVideosResponse> => {
  const params: GetVideosParams = {
    page,
    limit,
    userId
  };

  const response = await getVideosWithBusiness(params);
  
  // Filtrar por business_id
  const businessVideos = response.data.filter(video => video.business_id === businessId);
  
  return {
    ...response,
    data: businessVideos
  };
};