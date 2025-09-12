import { SearchFilters, getVideosWithActiveCoupons, searchVideos, searchVideosByBusinessName, searchVideosByLocation, searchVideosByTags } from '@/lib/search-api';
import type { VideoWithBusiness } from '@/types';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface UseSearchFiltersResult {
  // Estado de filtros
  filters: SearchFilters;
  updateFilters: (updates: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  
  // Estado de búsqueda
  isLoading: boolean;
  results: VideoWithBusiness[];
  totalCount: number;
  hasMore: boolean;
  
  // Funciones de búsqueda
  performSearch: () => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
  
  // Búsquedas específicas
  searchByTags: (tags: string[]) => Promise<void>;
  searchByBusinessName: (businessName: string) => Promise<void>;
  searchWithActiveCoupons: (category?: string) => Promise<void>;
  searchByLocation: (lat: number, lng: number, radius?: number) => Promise<void>;
  
  // Utilidades
  getCurrentLocation: () => Promise<boolean>;
  isFiltersEmpty: boolean;
  hasActiveFilters: boolean;
  
  // Estado de ubicación
  userLocation: {
    latitude?: number;
    longitude?: number;
  };
  locationPermission: boolean;
}

const defaultFilters: SearchFilters = {
  searchQuery: '',
  tags: [],
  businessName: '',
  category: '',
  hasActiveCoupon: false,
  location: {},
  minRating: 0,
  priceRange: [],
};

export function useSearchFilters(): UseSearchFiltersResult {
  // Estado de filtros
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  
  // Estado de búsqueda
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<VideoWithBusiness[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Estado de ubicación
  const [userLocation, setUserLocation] = useState<{ latitude?: number; longitude?: number }>({});
  const [locationPermission, setLocationPermission] = useState(false);

  // Verificar y solicitar permisos de ubicación
  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }, []);

  // Obtener ubicación actual
  const getCurrentLocation = useCallback(async (): Promise<boolean> => {
    try {
      const hasPermission = locationPermission || await requestLocationPermission();
      
      if (!hasPermission) {
        Alert.alert(
          'Ubicación requerida',
          'Para buscar por ubicación necesitamos acceso a tu ubicación actual.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Configurar', onPress: () => requestLocationPermission() },
          ]
        );
        return false;
      }

      setIsLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(newLocation);
      
      // Actualizar filtros con la nueva ubicación
      setFilters(prev => ({
        ...prev,
        location: {
          ...prev.location,
          ...newLocation,
          radius: prev.location.radius || 5, // 5km por defecto
        },
      }));

      return true;
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Error de ubicación',
        'No pudimos obtener tu ubicación actual. Verifica que tengas el GPS activado.'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [locationPermission, requestLocationPermission]);

  // Actualizar filtros
  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
    setCurrentPage(0); // Reset page when filters change
  }, []);

  // Resetear filtros
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setResults([]);
    setTotalCount(0);
    setHasMore(false);
    setCurrentPage(0);
  }, []);

  // Limpiar resultados
  const clearResults = useCallback(() => {
    setResults([]);
    setTotalCount(0);
    setHasMore(false);
    setCurrentPage(0);
  }, []);

  // Búsqueda principal
  const performSearch = useCallback(async () => {
    try {
      setIsLoading(true);
      setCurrentPage(0);

      const searchResults = await searchVideos(filters, 0, 20);
      
      setResults(searchResults.videos);
      setTotalCount(searchResults.totalCount);
      setHasMore(searchResults.hasMore);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error performing search:', error);
      Alert.alert('Error', 'No pudimos realizar la búsqueda. Inténtalo de nuevo.');
      setResults([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Cargar más resultados
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      
      const searchResults = await searchVideos(filters, currentPage, 20);
      
      setResults(prev => [...prev, ...searchResults.videos]);
      setHasMore(searchResults.hasMore);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more results:', error);
      Alert.alert('Error', 'No pudimos cargar más resultados.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage, hasMore, isLoading]);

  // Búsqueda por tags específicos
  const searchByTags = useCallback(async (tags: string[]) => {
    try {
      setIsLoading(true);
      const videos = await searchVideosByTags(tags);
      setResults(videos);
      setTotalCount(videos.length);
      setHasMore(false);
      
      // Actualizar filtros para reflejar la búsqueda
      updateFilters({ tags });
    } catch (error) {
      console.error('Error searching by tags:', error);
      Alert.alert('Error', 'No pudimos buscar por esos tags.');
    } finally {
      setIsLoading(false);
    }
  }, [updateFilters]);

  // Búsqueda por nombre de negocio
  const searchByBusinessName = useCallback(async (businessName: string) => {
    try {
      setIsLoading(true);
      const videos = await searchVideosByBusinessName(businessName);
      setResults(videos);
      setTotalCount(videos.length);
      setHasMore(false);
      
      // Actualizar filtros
      updateFilters({ businessName });
    } catch (error) {
      console.error('Error searching by business name:', error);
      Alert.alert('Error', 'No pudimos buscar por ese nombre de negocio.');
    } finally {
      setIsLoading(false);
    }
  }, [updateFilters]);

  // Búsqueda de videos con cupones activos
  const searchWithActiveCoupons = useCallback(async (category?: string) => {
    try {
      setIsLoading(true);
      const videos = await getVideosWithActiveCoupons(category);
      setResults(videos);
      setTotalCount(videos.length);
      setHasMore(false);
      
      // Actualizar filtros
      updateFilters({ 
        hasActiveCoupon: true,
        category: category || filters.category 
      });
    } catch (error) {
      console.error('Error searching videos with active coupons:', error);
      Alert.alert('Error', 'No pudimos obtener videos con cupones activos.');
    } finally {
      setIsLoading(false);
    }
  }, [filters.category, updateFilters]);

  // Búsqueda por ubicación
  const searchByLocation = useCallback(async (
    lat: number, 
    lng: number, 
    radius: number = 5
  ) => {
    try {
      setIsLoading(true);
      const videos = await searchVideosByLocation(lat, lng, radius, filters.category);
      setResults(videos);
      setTotalCount(videos.length);
      setHasMore(false);
      
      // Actualizar filtros
      updateFilters({
        location: { latitude: lat, longitude: lng, radius }
      });
    } catch (error) {
      console.error('Error searching by location:', error);
      Alert.alert('Error', 'No pudimos buscar por ubicación.');
    } finally {
      setIsLoading(false);
    }
  }, [filters.category, updateFilters]);

  // Verificar si los filtros están vacíos
  const isFiltersEmpty = !filters.searchQuery && 
                        !filters.businessName && 
                        !filters.category && 
                        filters.tags.length === 0 && 
                        !filters.hasActiveCoupon && 
                        filters.minRating === 0 && 
                        filters.priceRange.length === 0 &&
                        !filters.location.latitude;

  // Verificar si hay filtros activos
  const hasActiveFilters = !isFiltersEmpty;

  // Inicializar permisos de ubicación al montar
  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  // Auto-búsqueda cuando cambian ciertos filtros críticos
  useEffect(() => {
    if (filters.hasActiveCoupon && results.length === 0) {
      // Auto-buscar cuando se activa el filtro de cupones
      searchWithActiveCoupons(filters.category);
    }
  }, [filters.hasActiveCoupon, filters.category]); // Evitar dependencias circulares

  return {
    // Estado de filtros
    filters,
    updateFilters,
    resetFilters,
    
    // Estado de búsqueda
    isLoading,
    results,
    totalCount,
    hasMore,
    
    // Funciones de búsqueda
    performSearch,
    loadMore,
    clearResults,
    
    // Búsquedas específicas
    searchByTags,
    searchByBusinessName,
    searchWithActiveCoupons,
    searchByLocation,
    
    // Utilidades
    getCurrentLocation,
    isFiltersEmpty,
    hasActiveFilters,
    
    // Estado de ubicación
    userLocation,
    locationPermission,
  };
}