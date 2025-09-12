import { IconSymbol } from '@/components/ui/icon-symbol';
import Input from '@/components/ui/Input';
import SearchFilters from '@/components/ui/SearchFilters';
import SearchResults from '@/components/ui/SearchResults';
import { BorderRadius, Spacing, Typography } from '@/constants/Design';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import type { VideoWithBusiness } from '@/types';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Estados locales
  const [showFilters, setShowFilters] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  
  // Hook de filtros y búsqueda
  const {
    filters,
    updateFilters,
    resetFilters,
    isLoading,
    results,
    totalCount,
    hasMore,
    performSearch,
    loadMore,
    clearResults,
    searchByTags,
    searchByBusinessName,
    searchWithActiveCoupons,
    getCurrentLocation,
    isFiltersEmpty,
    hasActiveFilters,
    userLocation,
  } = useSearchFilters();

  // Manejar búsqueda rápida
  const handleQuickSearch = async () => {
    if (!quickSearchQuery.trim()) {
      Alert.alert('Búsqueda vacía', 'Por favor ingresa algo para buscar.');
      return;
    }

    updateFilters({ searchQuery: quickSearchQuery });
    await performSearch();
  };

  // Manejar presión de video
  const handleVideoPress = (video: VideoWithBusiness) => {
    // TODO: Navegar a pantalla de video o abrir modal
    console.log('Video pressed:', video.id);
    Alert.alert('Video seleccionado', `Título: ${video.title}`);
  };

  // Manejar aplicación de filtros
  const handleApplyFilters = async () => {
    await performSearch();
  };

  // Manejar reset de filtros
  const handleResetFilters = () => {
    resetFilters();
    setQuickSearchQuery('');
  };

  // Manejar refresh
  const handleRefresh = async () => {
    if (hasActiveFilters) {
      await performSearch();
    } else {
      clearResults();
    }
  };

  // Quick actions para filtros populares
  const QuickFilterButtons = () => (
    <View style={styles.quickFiltersContainer}>
      <TouchableOpacity
        style={[
          styles.quickFilterButton,
          {
            backgroundColor: filters.hasActiveCoupon 
              ? Colors.warning 
              : colors.backgroundSecondary,
          },
        ]}
        onPress={() => searchWithActiveCoupons()}
      >
        <IconSymbol name="tag" size={16} color={filters.hasActiveCoupon ? Colors.white : colors.text} />
        <Text
          style={[
            styles.quickFilterText,
            {
              color: filters.hasActiveCoupon ? Colors.white : colors.text,
            },
          ]}
        >
          Con Cupones
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.quickFilterButton,
          {
            backgroundColor: userLocation.latitude 
              ? Colors.primary 
              : colors.backgroundSecondary,
          },
        ]}
        onPress={async () => {
          const success = await getCurrentLocation();
          if (success && userLocation.latitude && userLocation.longitude) {
            updateFilters({
              location: {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                radius: 5,
              },
            });
            await performSearch();
          }
        }}
      >
        <IconSymbol 
          name="location" 
          size={16} 
          color={userLocation.latitude ? Colors.white : colors.text} 
        />
        <Text
          style={[
            styles.quickFilterText,
            {
              color: userLocation.latitude ? Colors.white : colors.text,
            },
          ]}
        >
          Cerca de mí
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.quickFilterButton,
          { backgroundColor: colors.backgroundSecondary },
        ]}
        onPress={() => searchByTags(['delicioso'])}
      >
        <Text style={[styles.quickFilterText, { color: colors.text }]}>
          #delicioso
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.quickFilterButton,
          { backgroundColor: colors.backgroundSecondary },
        ]}
        onPress={() => searchByTags(['aventura'])}
      >
        <Text style={[styles.quickFilterText, { color: colors.text }]}>
          #aventura
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Resumen de filtros activos
  const ActiveFiltersHeader = () => {
    if (!hasActiveFilters) return null;

    return (
      <View style={[styles.activeFiltersHeader, { backgroundColor: colors.backgroundSecondary }]}>
        <Text style={[styles.activeFiltersText, { color: colors.text }]}>
          {totalCount} resultado{totalCount !== 1 ? 's' : ''} encontrado{totalCount !== 1 ? 's' : ''}
        </Text>
        <TouchableOpacity onPress={handleResetFilters} style={styles.clearFiltersButton}>
          <Text style={[styles.clearFiltersText, { color: Colors.primary }]}>
            Limpiar filtros
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Explorar
        </Text>
        
        <TouchableOpacity
          onPress={() => setShowFilters(true)}
          style={[
            styles.filtersButton,
            {
              backgroundColor: hasActiveFilters ? Colors.primary : colors.backgroundSecondary,
            },
          ]}
        >
          <IconSymbol 
            name="magnifyingglass" 
            size={20} 
            color={hasActiveFilters ? Colors.white : colors.text} 
          />
          {hasActiveFilters && <View style={styles.filtersBadge} />}
        </TouchableOpacity>
      </View>

      {/* Búsqueda rápida */}
      <View style={styles.quickSearchContainer}>
        <View style={styles.searchInputContainer}>
          <Input
            placeholder="Buscar videos, negocios, tags..."
            value={quickSearchQuery}
            onChangeText={setQuickSearchQuery}
            leftIcon="magnifyingglass"
            rightIcon={quickSearchQuery ? "arrowshape.turn.up.right" : undefined}
            onRightIconPress={quickSearchQuery ? handleQuickSearch : undefined}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Filtros rápidos */}
      <QuickFilterButtons />

      {/* Header de filtros activos */}
      <ActiveFiltersHeader />

      {/* Resultados */}
      <SearchResults
        videos={results}
        isLoading={isLoading}
        hasMore={hasMore}
        onVideoPress={handleVideoPress}
        onLoadMore={loadMore}
        onRefresh={handleRefresh}
        emptyStateMessage={
          hasActiveFilters 
            ? 'No se encontraron videos con estos filtros'
            : 'Usa los filtros para buscar videos específicos'
        }
      />

      {/* Modal de filtros */}
      <SearchFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={updateFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
  },
  filtersButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filtersBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warning,
  },
  quickSearchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  quickFiltersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  quickFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  quickFilterText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  activeFiltersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  activeFiltersText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  clearFiltersButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  clearFiltersText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
});
