import { BorderRadius, Spacing, Typography } from '@/constants/Design';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { IconSymbol } from './icon-symbol';
import Input from './Input';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

interface SearchFiltersProps {
  visible: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const CATEGORIES = [
  { id: 'gastronomia', name: 'Gastronomía', icon: '🍕' },
  { id: 'hospedaje', name: 'Hospedaje', icon: '🏨' },
  { id: 'aventura', name: 'Aventura', icon: '🎯' },
  { id: 'cultura', name: 'Cultura', icon: '🏛️' },
  { id: 'compras', name: 'Compras', icon: '🛍️' },
  { id: 'vida_nocturna', name: 'Vida Nocturna', icon: '🌙' },
  { id: 'naturaleza', name: 'Naturaleza', icon: '🌿' },
];

const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'];
const POPULAR_TAGS = ['delicioso', 'aventura', 'familia', 'romantic', 'extremo', 'tradicional', 'moderno', 'económico'];

export default function SearchFilters({
  visible,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
}: SearchFiltersProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [customTag, setCustomTag] = useState('');

  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleCategory = (categoryId: string) => {
    updateFilters({
      category: filters.category === categoryId ? '' : categoryId,
    });
  };

  const togglePriceRange = (price: string) => {
    const newPriceRange = filters.priceRange.includes(price)
      ? filters.priceRange.filter(p => p !== price)
      : [...filters.priceRange, price];
    updateFilters({ priceRange: newPriceRange });
  };

  const addTag = (tag: string) => {
    if (tag && !filters.tags.includes(tag)) {
      updateFilters({ tags: [...filters.tags, tag] });
    }
    setCustomTag('');
  };

  const removeTag = (tagToRemove: string) => {
    updateFilters({
      tags: filters.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters();
    onClose();
  };

  const handleResetFilters = () => {
    onResetFilters();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="chevron.right" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Filtros de Búsqueda
          </Text>
          <TouchableOpacity onPress={handleResetFilters} style={styles.resetButton}>
            <Text style={[styles.resetText, { color: Colors.primary }]}>
              Limpiar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Búsqueda General */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Búsqueda General
            </Text>
            <Input
              placeholder="Buscar videos, negocios..."
              value={filters.searchQuery}
              onChangeText={(text) => updateFilters({ searchQuery: text })}
              leftIcon="magnifyingglass"
            />
          </View>

          {/* Búsqueda por Negocio */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Nombre del Negocio
            </Text>
            <Input
              placeholder="Ej: Café Central, Restaurante..."
              value={filters.businessName}
              onChangeText={(text) => updateFilters({ businessName: text })}
              leftIcon="building.2"
            />
          </View>

          {/* Cupones Activos */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Solo Videos con Cupones Activos
            </Text>
            <View style={[styles.switchContainer, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.switchInfo}>
                <Text style={[styles.switchLabel, { color: colors.text }]}>
                  Videos con descuentos disponibles
                </Text>
                <Text style={[styles.switchDescription, { color: colors.textSecondary }]}>
                  Mostrar solo videos que tengan cupones activos para usar
                </Text>
              </View>
              <Switch
                value={filters.hasActiveCoupon}
                onValueChange={(value) => updateFilters({ hasActiveCoupon: value })}
                trackColor={{ false: colors.border, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
          </View>

          {/* Categorías */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Categoría
            </Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: filters.category === category.id
                        ? Colors.primary
                        : colors.backgroundSecondary,
                      borderColor: filters.category === category.id
                        ? Colors.primary
                        : colors.border,
                    },
                  ]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color: filters.category === category.id
                          ? Colors.white
                          : colors.text,
                      },
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Tags
            </Text>
            <Input
              placeholder="Agregar tag personalizado..."
              value={customTag}
              onChangeText={setCustomTag}
              rightIcon="plus"
              onRightIconPress={() => addTag(customTag)}
              leftIcon="tag"
            />
            
            {/* Tags populares */}
            <Text style={[styles.subsectionTitle, { color: colors.textSecondary }]}>
              Tags Populares
            </Text>
            <View style={styles.tagsContainer}>
              {POPULAR_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    {
                      backgroundColor: filters.tags.includes(tag)
                        ? Colors.primary
                        : colors.backgroundSecondary,
                      borderColor: filters.tags.includes(tag)
                        ? Colors.primary
                        : colors.border,
                    },
                  ]}
                  onPress={() => filters.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color: filters.tags.includes(tag)
                          ? Colors.white
                          : colors.text,
                      },
                    ]}
                  >
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tags seleccionados */}
            {filters.tags.length > 0 && (
              <>
                <Text style={[styles.subsectionTitle, { color: colors.textSecondary }]}>
                  Tags Seleccionados
                </Text>
                <View style={styles.selectedTagsContainer}>
                  {filters.tags.map((tag, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.selectedTag, { backgroundColor: Colors.primary }]}
                      onPress={() => removeTag(tag)}
                    >
                      <Text style={styles.selectedTagText}>#{tag}</Text>
                      <IconSymbol name="plus" size={12} color={Colors.white} />
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>

          {/* Calificación Mínima */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Calificación Mínima
            </Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    {
                      backgroundColor: filters.minRating >= rating
                        ? Colors.warning
                        : colors.backgroundSecondary,
                    },
                  ]}
                  onPress={() => updateFilters({ minRating: rating })}
                >
                  <IconSymbol
                    name="heart.fill"
                    size={20}
                    color={filters.minRating >= rating ? Colors.white : colors.icon}
                  />
                </TouchableOpacity>
              ))}
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {filters.minRating === 0 ? 'Cualquiera' : `${filters.minRating}+ estrellas`}
              </Text>
            </View>
          </View>

          {/* Rango de Precios */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Rango de Precios
            </Text>
            <View style={styles.priceRangeContainer}>
              {PRICE_RANGES.map((price) => (
                <TouchableOpacity
                  key={price}
                  style={[
                    styles.priceButton,
                    {
                      backgroundColor: filters.priceRange.includes(price)
                        ? Colors.success
                        : colors.backgroundSecondary,
                      borderColor: filters.priceRange.includes(price)
                        ? Colors.success
                        : colors.border,
                    },
                  ]}
                  onPress={() => togglePriceRange(price)}
                >
                  <Text
                    style={[
                      styles.priceText,
                      {
                        color: filters.priceRange.includes(price)
                          ? Colors.white
                          : colors.text,
                      },
                    ]}
                  >
                    {price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ubicación */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Radio de Búsqueda
            </Text>
            <View style={styles.locationContainer}>
              <TouchableOpacity
                style={[styles.locationButton, { backgroundColor: colors.backgroundSecondary }]}
                onPress={() => {
                  // TODO: Implementar obtención de ubicación actual
                  console.log('Obtener ubicación actual');
                }}
              >
                <IconSymbol name="location" size={20} color={Colors.primary} />
                <Text style={[styles.locationButtonText, { color: colors.text }]}>
                  Usar mi ubicación actual
                </Text>
              </TouchableOpacity>
              
              <Input
                placeholder="Radio en kilómetros (ej: 5)"
                value={filters.location.radius?.toString() || ''}
                onChangeText={(text) => {
                  const radius = parseFloat(text) || undefined;
                  updateFilters({
                    location: { ...filters.location, radius },
                  });
                }}
                keyboardType="numeric"
                leftIcon="circle"
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: Colors.primary }]}
            onPress={handleApplyFilters}
          >
            <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
  closeButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
  },
  resetButton: {
    padding: Spacing.sm,
  },
  resetText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    marginBottom: Spacing.md,
  },
  subsectionTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  switchInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  switchLabel: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.medium,
    marginBottom: Spacing.xs,
  },
  switchDescription: {
    fontSize: Typography.size.sm,
    lineHeight: Typography.lineHeight.relaxed * Typography.size.sm,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  categoryText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tagButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  tagText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  selectedTagText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    marginLeft: Spacing.md,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priceButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  priceText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
  },
  locationContainer: {
    gap: Spacing.md,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  locationButtonText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.medium,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  applyButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
  },
});