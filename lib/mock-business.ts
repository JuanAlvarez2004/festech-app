import type { BusinessWithOwner, Profile } from '@/types';

// Mock business owners (propietarios de negocios)
const mockBusinessOwners: Profile[] = [
  {
    id: 'owner-1',
    email: 'carlos.rodriguez@cafedelcentro.com',
    full_name: 'Carlos Rodríguez',
    user_type: 'business',
    phone: '+57 301 234 5678',
    city: 'Medellín',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80',
    bio: 'Barista profesional con más de 10 años de experiencia. Fundador de Café del Centro.',
    interests: ['café', 'gastronomía', 'emprendimiento'],
    date_of_birth: '1985-03-15',
    created_at: '2023-01-10T10:00:00Z'
  },
  {
    id: 'owner-2',
    email: 'sofia.gonzalez@modaurbana.co',
    full_name: 'Sofía González',
    user_type: 'business',
    phone: '+57 300 987 6543',
    city: 'Medellín',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80',
    bio: 'Diseñadora de modas especializada en moda urbana y sostenible.',
    interests: ['moda', 'diseño', 'sostenibilidad'],
    date_of_birth: '1990-07-22',
    created_at: '2023-02-15T15:30:00Z'
  },
  {
    id: 'owner-3',
    email: 'miguel.torres@tecnosoluciones.com',
    full_name: 'Miguel Torres',
    user_type: 'business',
    phone: '+57 312 555 1234',
    city: 'Medellín',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80',
    bio: 'Ingeniero de sistemas especializado en reparación de dispositivos móviles y computadores.',
    interests: ['tecnología', 'reparaciones', 'innovación'],
    date_of_birth: '1988-11-08',
    created_at: '2023-03-01T09:15:00Z'
  },
  {
    id: 'owner-4',
    email: 'lucia.martinez@bellosabores.co',
    full_name: 'Lucía Martínez',
    user_type: 'business',
    phone: '+57 315 777 8888',
    city: 'Medellín',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80',
    bio: 'Chef especializada en cocina colombiana moderna. Propietaria de Bellos Sabores.',
    interests: ['gastronomía', 'cocina colombiana', 'innovación culinaria'],
    date_of_birth: '1987-05-14',
    created_at: '2023-01-20T14:20:00Z'
  },
  {
    id: 'owner-5',
    email: 'andres.silva@fitnessplus.co',
    full_name: 'Andrés Silva',
    user_type: 'business',
    phone: '+57 318 444 9999',
    city: 'Medellín',
    avatar_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80',
    bio: 'Entrenador personal certificado con especialización en fitness funcional.',
    interests: ['fitness', 'entrenamiento', 'vida saludable'],
    date_of_birth: '1992-09-03',
    created_at: '2023-02-28T11:45:00Z'
  }
];

// Mock businesses con información completa
export const MOCK_BUSINESSES: BusinessWithOwner[] = [
  {
    id: 'b1e5c8a2-7f91-4d3e-b234-1a2b3c4d5e6f',
    owner_id: 'owner-1',
    name: 'Café Central Ibagué',
    category: 'gastronomia',
    description: 'El mejor café de especialidad de Ibagué. Granos selectos, tostado artesanal y ambiente acogedor en el centro histórico.',
    phone: '+57 312 456 7890',
    address: 'Carrera 3 # 12-45',
    full_address: 'Carrera 3 # 12-45, Centro, Ibagué, Tolima',
    neighborhood: 'Centro',
    latitude: 4.4389,
    longitude: -75.2322,
    logo_url: 'https://picsum.photos/100/100?random=1',
    cover_image_url: 'https://picsum.photos/800/400?random=1',
    whatsapp: '+57 312 456 7890',
    schedule: {
      'monday': { open: '07:00', close: '19:00', isOpen: true },
      'tuesday': { open: '07:00', close: '19:00', isOpen: true },
      'wednesday': { open: '07:00', close: '19:00', isOpen: true },
      'thursday': { open: '07:00', close: '19:00', isOpen: true },
      'friday': { open: '07:00', close: '20:00', isOpen: true },
      'saturday': { open: '08:00', close: '20:00', isOpen: true },
      'sunday': { open: '08:00', close: '18:00', isOpen: true }
    },
    social_media: {
      instagram: '@cafecentral_ibague',
      facebook: 'Café Central Ibagué',
      tiktok: '@cafecentral'
    },
    services: ['Café de especialidad', 'Tostado artesanal', 'Desayunos', 'WiFi gratis', 'Ambiente acogedor'],
    price_range: '$$' as const,
    is_active: true,
    rating_average: 4.5,
    total_reviews: 23,
    followers_count: 156,
    created_at: '2024-01-10T10:00:00Z',
    owner: mockBusinessOwners[0]
  },
  {
    id: 'c2f5d8b3-8g92-5e4f-c345-2b3c4d5e6f7g',
    owner_id: 'owner-2',
    name: 'Aventuras Extremas Tolima',
    category: 'aventura',
    description: 'Operador turístico especializado en deportes extremos y aventura en el Tolima. Más de 10 años de experiencia.',
    phone: '+57 315 123 4567',
    address: 'Km 5 Vía al Cañón del Combeima',
    full_address: 'Km 5 Vía al Cañón del Combeima, Ibagué, Tolima',
    neighborhood: 'Combeima',
    latitude: 4.5000,
    longitude: -75.3000,
    logo_url: 'https://picsum.photos/100/100?random=2',
    cover_image_url: 'https://picsum.photos/800/400?random=2',
    whatsapp: '+57 315 123 4567',
    schedule: {
      'monday': { open: '06:00', close: '18:00', isOpen: true },
      'tuesday': { open: '06:00', close: '18:00', isOpen: true },
      'wednesday': { open: '06:00', close: '18:00', isOpen: true },
      'thursday': { open: '06:00', close: '18:00', isOpen: true },
      'friday': { open: '06:00', close: '18:00', isOpen: true },
      'saturday': { open: '05:00', close: '19:00', isOpen: true },
      'sunday': { open: '05:00', close: '19:00', isOpen: true }
    },
    social_media: {
      instagram: '@aventurastolima',
      facebook: 'Aventuras Extremas Tolima',
      youtube: 'Aventuras Tolima'
    },
    services: ['Rappel', 'Escalada en roca', 'Mountain bike', 'Senderismo', 'Camping', 'Transporte incluido'],
    price_range: '$$$' as const,
    is_active: true,
    rating_average: 4.8,
    total_reviews: 45,
    followers_count: 320,
    created_at: '2024-01-15T15:30:00Z',
    owner: mockBusinessOwners[1]
  },
  {
    id: 'e4h7k1n4-q8t1-7w5z-g567-4c5d6e7f8g9h',
    owner_id: 'owner-3',
    name: 'La Cocina de la Abuela',
    category: 'gastronomia',
    description: 'Restaurante familiar especializado en comida tradicional tolimense. Más de 30 años sirviendo los mejores sabores.',
    phone: '+57 310 987 6543',
    address: 'Calle 15 # 4-67',
    full_address: 'Calle 15 # 4-67, Centro, Ibagué, Tolima',
    neighborhood: 'Centro',
    latitude: 4.4350,
    longitude: -75.2280,
    logo_url: 'https://picsum.photos/100/100?random=3',
    cover_image_url: 'https://picsum.photos/800/400?random=3',
    whatsapp: '+57 310 987 6543',
    schedule: {
      'monday': { open: '11:00', close: '21:00', isOpen: true },
      'tuesday': { open: '11:00', close: '21:00', isOpen: true },
      'wednesday': { open: '11:00', close: '21:00', isOpen: true },
      'thursday': { open: '11:00', close: '21:00', isOpen: true },
      'friday': { open: '11:00', close: '22:00', isOpen: true },
      'saturday': { open: '10:00', close: '22:00', isOpen: true },
      'sunday': { open: '10:00', close: '20:00', isOpen: true }
    },
    social_media: {
      instagram: '@cocina_abuela_ibague',
      facebook: 'La Cocina de la Abuela'
    },
    services: ['Comida tradicional', 'Eventos familiares', 'Domicilios', 'Desayunos típicos'],
    price_range: '$' as const,
    is_active: true,
    rating_average: 4.3,
    total_reviews: 78,
    followers_count: 234,
    created_at: '2024-03-01T09:15:00Z',
    owner: mockBusinessOwners[2]
  },
  {
    id: 'f5i8l2o5-r9u2-8x6a-h678-5d6e7f8g9h0i',
    owner_id: 'owner-4',
    name: 'Hotel Mirador de los Andes',
    category: 'hospedaje',
    description: 'Hotel boutique de lujo con vista panorámica a la cordillera. Ubicado en la zona rosa de Ibagué.',
    phone: '+57 318 567 8901',
    address: 'Carrera 5 # 18-90',
    full_address: 'Carrera 5 # 18-90, Zona Rosa, Ibagué, Tolima',
    neighborhood: 'Zona Rosa',
    latitude: 4.4420,
    longitude: -75.2350,
    logo_url: 'https://picsum.photos/100/100?random=4',
    cover_image_url: 'https://picsum.photos/800/400?random=4',
    whatsapp: '+57 318 567 8901',
    schedule: {
      'monday': { open: '00:00', close: '23:59', isOpen: true },
      'tuesday': { open: '00:00', close: '23:59', isOpen: true },
      'wednesday': { open: '00:00', close: '23:59', isOpen: true },
      'thursday': { open: '00:00', close: '23:59', isOpen: true },
      'friday': { open: '00:00', close: '23:59', isOpen: true },
      'saturday': { open: '00:00', close: '23:59', isOpen: true },
      'sunday': { open: '00:00', close: '23:59', isOpen: true }
    },
    social_media: {
      instagram: '@miradorandes_hotel',
      facebook: 'Hotel Mirador de los Andes',
      website: 'www.miradorandes.com'
    },
    services: ['Habitaciones de lujo', 'Spa completo', 'Restaurante gourmet', 'Eventos empresariales', 'WiFi premium'],
    price_range: '$$$$' as const,
    is_active: true,
    rating_average: 4.7,
    total_reviews: 89,
    followers_count: 445,
    created_at: '2024-01-20T14:20:00Z',
    owner: mockBusinessOwners[3]
  },
  {
    id: 'g6j9m3p6-s0v3-9y7b-i789-6e7f8g9h0i1j',
    owner_id: 'owner-5',
    name: 'Galería Arte Tolimense',
    category: 'cultura',
    description: 'Espacio cultural dedicado a promover el arte y la cultura tolimense. Galería, talleres y eventos culturales.',
    phone: '+57 314 678 9012',
    address: 'Carrera 4 # 14-23',
    full_address: 'Carrera 4 # 14-23, Centro Cultural, Ibagué, Tolima',
    neighborhood: 'Centro Cultural',
    latitude: 4.4380,
    longitude: -75.2310,
    logo_url: 'https://picsum.photos/100/100?random=5',
    cover_image_url: 'https://picsum.photos/800/400?random=5',
    whatsapp: '+57 314 678 9012',
    schedule: {
      'monday': { open: '09:00', close: '18:00', isOpen: true },
      'tuesday': { open: '09:00', close: '18:00', isOpen: true },
      'wednesday': { open: '09:00', close: '18:00', isOpen: true },
      'thursday': { open: '09:00', close: '18:00', isOpen: true },
      'friday': { open: '09:00', close: '19:00', isOpen: true },
      'saturday': { open: '10:00', close: '19:00', isOpen: true },
      'sunday': { open: '10:00', close: '17:00', isOpen: true }
    },
    social_media: {
      instagram: '@arte_tolimense',
      facebook: 'Galería Arte Tolimense',
      twitter: '@ArteTolimaGal'
    },
    services: ['Exposiciones', 'Talleres de arte', 'Eventos culturales', 'Venta de arte local'],
    price_range: '$$' as const,
    is_active: true,
    rating_average: 4.2,
    total_reviews: 34,
    followers_count: 167,
    created_at: '2024-02-28T11:45:00Z',
    owner: mockBusinessOwners[4]
  }
];

/**
 * Busca un negocio por ID en los datos mock
 */
export const getMockBusinessById = (businessId: string): BusinessWithOwner | null => {
  return MOCK_BUSINESSES.find(business => business.id === businessId) || null;
};

/**
 * Busca negocios por categoría en los datos mock
 */
export const getMockBusinessesByCategory = (category: string): BusinessWithOwner[] => {
  return MOCK_BUSINESSES.filter(business => 
    business.category.toLowerCase().includes(category.toLowerCase())
  );
};

/**
 * Busca negocios por texto en los datos mock
 */
export const searchMockBusinesses = (searchTerm: string): BusinessWithOwner[] => {
  const term = searchTerm.toLowerCase();
  return MOCK_BUSINESSES.filter(business => 
    business.name.toLowerCase().includes(term) ||
    (business.description && business.description.toLowerCase().includes(term)) ||
    business.category.toLowerCase().includes(term) ||
    (business.services && business.services.some(service => service.toLowerCase().includes(term)))
  );
};

/**
 * Obtiene estadísticas mock para un negocio
 */
export const getMockBusinessStats = (businessId: string) => {
  // Generar estadísticas realistas basadas en el ID del negocio
  const seed = businessId.charCodeAt(businessId.length - 1);
  const baseViews = 1000 + (seed * 100);
  const baseLikes = Math.floor(baseViews * 0.1);
  const baseFollowers = Math.floor(baseViews * 0.05);
  
  return {
    thisMonth: {
      views: baseViews + Math.floor(Math.random() * 500),
      likes: baseLikes + Math.floor(Math.random() * 50),
      newFollowers: Math.floor(Math.random() * 30) + 10,
      chatsStarted: Math.floor(Math.random() * 20) + 5,
      conversions: Math.floor(Math.random() * 5) + 2
    },
    lastMonth: {
      views: baseViews - 200 + Math.floor(Math.random() * 400),
      likes: baseLikes - 20 + Math.floor(Math.random() * 40),
      newFollowers: Math.floor(Math.random() * 25) + 8,
      chatsStarted: Math.floor(Math.random() * 15) + 3,
      conversions: Math.floor(Math.random() * 3) + 1
    },
    totalViews: baseViews * 12,
    totalLikes: baseLikes * 12,
    totalFollowers: baseFollowers,
    averageEngagement: 8.5 + (Math.random() * 3)
  };
};

/**
 * Simula el seguimiento/dejar de seguir un negocio
 */
let mockFollowedBusinesses: Set<string> = new Set();

export const toggleMockBusinessFollow = (businessId: string): boolean => {
  if (mockFollowedBusinesses.has(businessId)) {
    mockFollowedBusinesses.delete(businessId);
    return false; // dejó de seguir
  } else {
    mockFollowedBusinesses.add(businessId);
    return true; // ahora sigue
  }
};

export const isMockBusinessFollowed = (businessId: string): boolean => {
  return mockFollowedBusinesses.has(businessId);
};