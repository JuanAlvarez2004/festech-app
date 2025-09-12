import { supabase } from '@/lib/supabase';
import type { VideoWithBusiness } from '@/types';

export interface SearchFilters {
  searchQuery: string;
  tags: string[];
  businessName: string;
  category: string;
  hasActiveCoupon: boolean;
  location: {
    latitude?: number;
    longitude?: number;
    radius?: number; // en kilómetros
  };
  minRating: number;
  priceRange: string[];
}

export interface SearchResults {
  videos: VideoWithBusiness[];
  totalCount: number;
  hasMore: boolean;
}

/**
 * Función principal de búsqueda que combina todos los filtros
 */
export async function searchVideos(
  filters: SearchFilters,
  page: number = 0,
  limit: number = 20
): Promise<SearchResults> {
  try {
    let query = supabase
      .from('videos')
      .select(`
        *,
        business:businesses(
          id,
          name,
          category,
          logo_url,
          rating_average,
          price_range,
          latitude,
          longitude
        ),
        coupon:coupons(
          id,
          title,
          discount_type,
          discount_value,
          coin_price,
          expires_at,
          is_active
        )
      `, { count: 'exact' })
      .eq('is_active', true);

    // Filtro por cupones activos - MUY IMPORTANTE
    if (filters.hasActiveCoupon) {
      query = query.eq('has_active_coupon', true);
    }

    // Filtro por búsqueda general (título o descripción del video)
    if (filters.searchQuery.trim()) {
      query = query.or(
        `title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
      );
    }

    // Filtro por nombre de negocio
    if (filters.businessName.trim()) {
      query = query.eq('business.name', `ilike.%${filters.businessName}%`);
    }

    // Filtro por categoría
    if (filters.category) {
      query = query.eq('business.category', filters.category);
    }

    // Filtro por tags - buscar cualquier tag coincidente
    if (filters.tags.length > 0) {
      const tagConditions = filters.tags.map(tag => `tags.cs.{${tag}}`).join(',');
      query = query.or(tagConditions);
    }

    // Filtro por calificación mínima del negocio
    if (filters.minRating > 0) {
      query = query.gte('business.rating_average', filters.minRating);
    }

    // Filtro por rango de precios
    if (filters.priceRange.length > 0) {
      query = query.in('business.price_range', filters.priceRange);
    }

    // Ordenamiento: priorizar videos con cupones activos
    query = query.order('has_active_coupon', { ascending: false })
                 .order('created_at', { ascending: false });

    // Paginación
    const from = page * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error searching videos:', error);
      throw error;
    }

    // Si hay filtros de ubicación, aplicar filtro geoespacial
    let filteredVideos = data || [];
    if (filters.location.latitude && filters.location.longitude && filters.location.radius) {
      filteredVideos = await filterVideosByLocation(
        filteredVideos,
        filters.location.latitude,
        filters.location.longitude,
        filters.location.radius
      );
    }

    return {
      videos: filteredVideos as VideoWithBusiness[],
      totalCount: count || 0,
      hasMore: (count || 0) > from + filteredVideos.length,
    };

  } catch (error) {
    console.error('Error in searchVideos:', error);
    throw error;
  }
}

/**
 * Búsqueda específica por tags de video
 */
export async function searchVideosByTags(
  tags: string[],
  limit: number = 20
): Promise<VideoWithBusiness[]> {
  try {
    if (tags.length === 0) return [];

    // Construir condición OR para múltiples tags
    const tagConditions = tags.map(tag => `tags.cs.{${tag}}`).join(',');

    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        business:businesses(
          id,
          name,
          category,
          logo_url,
          rating_average
        ),
        coupon:coupons(
          id,
          title,
          discount_type,
          discount_value,
          coin_price,
          expires_at,
          is_active
        )
      `)
      .eq('is_active', true)
      .or(tagConditions)
      .order('has_active_coupon', { ascending: false })
      .order('likes_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error searching videos by tags:', error);
      throw error;
    }

    return data as VideoWithBusiness[];
  } catch (error) {
    console.error('Error in searchVideosByTags:', error);
    throw error;
  }
}

/**
 * Búsqueda por nombre de negocio
 */
export async function searchVideosByBusinessName(
  businessName: string,
  limit: number = 20
): Promise<VideoWithBusiness[]> {
  try {
    if (!businessName.trim()) return [];

    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        business:businesses(
          id,
          name,
          category,
          logo_url,
          rating_average
        ),
        coupon:coupons(
          id,
          title,
          discount_type,
          discount_value,
          coin_price,
          expires_at,
          is_active
        )
      `)
      .eq('is_active', true)
      .ilike('business.name', `%${businessName}%`)
      .order('has_active_coupon', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error searching videos by business name:', error);
      throw error;
    }

    return data as VideoWithBusiness[];
  } catch (error) {
    console.error('Error in searchVideosByBusinessName:', error);
    throw error;
  }
}

/**
 * Obtener videos solo con cupones activos (filtro prioritario)
 */
export async function getVideosWithActiveCoupons(
  category?: string,
  limit: number = 20
): Promise<VideoWithBusiness[]> {
  try {
    let query = supabase
      .from('videos')
      .select(`
        *,
        business:businesses(
          id,
          name,
          category,
          logo_url,
          rating_average
        ),
        coupon:coupons(
          id,
          title,
          discount_type,
          discount_value,
          coin_price,
          expires_at,
          is_active
        )
      `)
      .eq('is_active', true)
      .eq('has_active_coupon', true); // Campo calculado automáticamente

    // Filtro opcional por categoría
    if (category) {
      query = query.eq('business.category', category);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error getting videos with active coupons:', error);
      throw error;
    }

    return data as VideoWithBusiness[];
  } catch (error) {
    console.error('Error in getVideosWithActiveCoupons:', error);
    throw error;
  }
}

/**
 * Búsqueda por ubicación usando función RPC de Supabase
 */
export async function searchVideosByLocation(
  latitude: number,
  longitude: number,
  radiusKm: number = 5,
  category?: string,
  limit: number = 20
): Promise<VideoWithBusiness[]> {
  try {
    const { data, error } = await supabase.rpc('search_videos_by_location', {
      user_lat: latitude,
      user_lng: longitude,
      radius_km: radiusKm,
      category_filter: category || null,
      limit_results: limit
    });

    if (error) {
      console.error('Error searching videos by location:', error);
      throw error;
    }

    return data as VideoWithBusiness[];
  } catch (error) {
    console.error('Error in searchVideosByLocation:', error);
    // Fallback: buscar manualmente si la función RPC no existe
    return await fallbackLocationSearch(latitude, longitude, radiusKm, category, limit);
  }
}

/**
 * Función helper para filtrar videos por ubicación manualmente
 */
async function filterVideosByLocation(
  videos: any[],
  userLat: number,
  userLng: number,
  radiusKm: number
): Promise<any[]> {
  return videos.filter(video => {
    if (!video.business.latitude || !video.business.longitude) {
      return false;
    }

    const distance = calculateDistance(
      userLat,
      userLng,
      video.business.latitude,
      video.business.longitude
    );

    return distance <= radiusKm;
  });
}

/**
 * Fallback para búsqueda por ubicación si RPC no está disponible
 */
async function fallbackLocationSearch(
  latitude: number,
  longitude: number,
  radiusKm: number,
  category?: string,
  limit: number = 20
): Promise<VideoWithBusiness[]> {
  try {
    let query = supabase
      .from('videos')
      .select(`
        *,
        business:businesses(
          id,
          name,
          category,
          logo_url,
          rating_average,
          latitude,
          longitude
        ),
        coupon:coupons(
          id,
          title,
          discount_type,
          discount_value,
          coin_price,
          expires_at,
          is_active
        )
      `)
      .eq('is_active', true)
      .not('business.latitude', 'is', null)
      .not('business.longitude', 'is', null);

    if (category) {
      query = query.eq('business.category', category);
    }

    const { data, error } = await query.limit(limit * 3); // Obtener más para filtrar después

    if (error) throw error;

    // Filtrar por distancia manualmente
    const filteredVideos = await filterVideosByLocation(
      data || [],
      latitude,
      longitude,
      radiusKm
    );

    return filteredVideos.slice(0, limit) as VideoWithBusiness[];
  } catch (error) {
    console.error('Error in fallbackLocationSearch:', error);
    throw error;
  }
}

/**
 * Función para calcular distancia entre dos puntos (fórmula Haversine)
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function toRad(value: number): number {
  return value * Math.PI / 180;
}

/**
 * Búsqueda global (función RPC del backend)
 */
export async function globalSearch(
  searchTerm: string,
  categories?: string[],
  userLat?: number,
  userLng?: number,
  radiusKm?: number,
  limit: number = 20
): Promise<SearchResults> {
  try {
    const { data, error } = await supabase.rpc('global_search', {
      search_term: searchTerm,
      categories: categories || [],
      user_lat: userLat,
      user_lng: userLng,
      radius_km: radiusKm,
      limit_results: limit
    });

    if (error) {
      console.error('Error in global search:', error);
      throw error;
    }

    return {
      videos: data as VideoWithBusiness[],
      totalCount: data?.length || 0,
      hasMore: false, // La función RPC maneja la paginación internamente
    };
  } catch (error) {
    console.error('Error in globalSearch:', error);
    // Fallback a búsqueda simple
    return await searchVideos({
      searchQuery: searchTerm,
      tags: [],
      businessName: '',
      category: categories?.[0] || '',
      hasActiveCoupon: false,
      location: {
        latitude: userLat,
        longitude: userLng,
        radius: radiusKm,
      },
      minRating: 0,
      priceRange: [],
    }, 0, limit);
  }
}

/**
 * Obtener feed optimizado con priorización de cupones
 */
export async function getPrioritizedFeed(
  userLat?: number,
  userLng?: number,
  radiusKm: number = 10,
  userInterests: string[] = [],
  followedBusinesses: string[] = [],
  limit: number = 20
): Promise<VideoWithBusiness[]> {
  try {
    const { data, error } = await supabase.rpc('get_prioritized_feed', {
      user_lat: userLat,
      user_lng: userLng,
      radius_km: radiusKm,
      user_interests: userInterests,
      followed_businesses: followedBusinesses,
      limit_results: limit
    });

    if (error) {
      console.error('Error getting prioritized feed:', error);
      throw error;
    }

    return data as VideoWithBusiness[];
  } catch (error) {
    console.error('Error in getPrioritizedFeed:', error);
    // Fallback: obtener videos normales priorizando cupones
    const { data, error: fallbackError } = await supabase
      .from('videos')
      .select(`
        *,
        business:businesses(
          id,
          name,
          category,
          logo_url,
          rating_average
        ),
        coupon:coupons(
          id,
          title,
          discount_type,
          discount_value,
          coin_price,
          expires_at,
          is_active
        )
      `)
      .eq('is_active', true)
      .order('has_active_coupon', { ascending: false })
      .order('likes_count', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (fallbackError) throw fallbackError;
    return data as VideoWithBusiness[];
  }
}