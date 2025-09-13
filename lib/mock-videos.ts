import type { VideoWithBusiness } from '@/types';

/**
 * Mock data que refleja la estructura real de Supabase
 * basado en la documentación de infraestructura
 */
export const MOCK_VIDEOS_REALISTIC: VideoWithBusiness[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    business_id: 'b1e5c8a2-7f91-4d3e-b234-1a2b3c4d5e6f',
    title: 'El mejor café de especialidad en Ibagué ☕✨',
    description: '¡Ven a probar nuestro café de origen único! Recién tostado todas las mañanas con granos selectos del Quindío. Una experiencia sensorial única en el corazón de Ibagué. #café #ibagué #especialidad #origen',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail_url: 'https://picsum.photos/400/600?random=1',
    duration: 25,
    file_size: 12458960,
    location_lat: 4.4389,
    location_lng: -75.2322,
    location_name: 'Centro Histórico de Ibagué',
    tags: ['café', 'ibagué', 'especialidad', 'origen', 'tostado'],
    views_count: 1250,
    likes_count: 89,
    has_active_coupon: false,
    is_active: true,
    created_at: '2024-01-15T10:30:00.000Z',
    business: {
      id: 'b1e5c8a2-7f91-4d3e-b234-1a2b3c4d5e6f',
      owner_id: '550e8400-e29b-41d4-a716-446655440001',
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
        'lunes': { open: '07:00', close: '19:00' },
        'martes': { open: '07:00', close: '19:00' },
        'miercoles': { open: '07:00', close: '19:00' },
        'jueves': { open: '07:00', close: '19:00' },
        'viernes': { open: '07:00', close: '20:00' },
        'sabado': { open: '08:00', close: '20:00' },
        'domingo': { open: '08:00', close: '18:00' }
      },
      social_media: {
        instagram: '@cafecentral_ibague',
        facebook: 'Café Central Ibagué',
        tiktok: '@cafecentral'
      },
      services: ['Café de especialidad', 'Postres artesanales', 'WiFi gratis', 'Eventos privados'],
      price_range: '$$',
      is_active: true,
      rating_average: 4.5,
      total_reviews: 23,
      followers_count: 156,
      created_at: '2024-01-01T00:00:00.000Z'
    },
    liked: false,
    likesCount: 89
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    business_id: 'c2f5d8b3-8g92-5e4f-c345-2b3c4d5e6f7g',
    title: 'Aventura extrema en las montañas del Tolima 🏔️🚵‍♂️',
    description: 'Vive la adrenalina al máximo con nuestros deportes extremos. Rappel, escalada en roca y mountain bike en paisajes únicos del Tolima. ¡Una experiencia que nunca olvidarás! #aventura #extremo #tolima #rappel #escalada',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_url: 'https://picsum.photos/400/600?random=2',
    duration: 30,
    file_size: 18759340,
    location_lat: 4.5000,
    location_lng: -75.3000,
    location_name: 'Cordillera Central - Tolima',
    tags: ['aventura', 'extremo', 'tolima', 'rappel', 'escalada', 'mountain bike'],
    views_count: 2100,
    likes_count: 156,
    has_active_coupon: true,
    is_active: true,
    created_at: '2024-01-14T15:45:00.000Z',
    business: {
      id: 'c2f5d8b3-8g92-5e4f-c345-2b3c4d5e6f7g',
      owner_id: '661f9511-f30c-52e5-b827-557766551002',
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
        'lunes': { open: '06:00', close: '18:00' },
        'martes': { open: '06:00', close: '18:00' },
        'miercoles': { open: '06:00', close: '18:00' },
        'jueves': { open: '06:00', close: '18:00' },
        'viernes': { open: '06:00', close: '18:00' },
        'sabado': { open: '05:00', close: '19:00' },
        'domingo': { open: '05:00', close: '19:00' }
      },
      social_media: {
        instagram: '@aventurastolima',
        facebook: 'Aventuras Extremas Tolima',
        youtube: 'Aventuras Tolima'
      },
      services: ['Rappel', 'Escalada en roca', 'Mountain bike', 'Senderismo', 'Camping', 'Transporte incluido'],
      price_range: '$$$',
      is_active: true,
      rating_average: 4.8,
      total_reviews: 45,
      followers_count: 320,
      created_at: '2024-01-01T00:00:00.000Z'
    },
    coupon: {
      id: 'd5e6f7g8-h9i0-1234-5678-901234567890',
      business_id: 'c2f5d8b3-8g92-5e4f-c345-2b3c4d5e6f7g',
      title: '20% OFF en aventura extrema',
      description: 'Descuento especial del 20% en cualquier paquete de aventura extrema. Válido hasta fin de mes.',
      discount_type: 'percentage',
      discount_value: 20,
      coin_price: 25,
      max_uses: 50,
      current_uses: 12,
      is_active: true,
      expires_at: '2024-02-29T23:59:59.000Z',
      created_at: '2024-01-10T08:00:00.000Z'
    },
    liked: true,
    likesCount: 156
  },
  {
    id: 'z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4',
    business_id: 'e4h7k1n4-q8t1-7w5z-g567-4c5d6e7f8g9h',
    title: 'Gastronomía tradicional tolimense 🍛🌶️',
    description: 'Descubre los sabores auténticos del Tolima en nuestro restaurante familiar. Lechona, tamales, viudo de pescado y mucho más. Recetas tradicionales de generación en generación. #tolima #gastronomia #tradicional #lechona',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_url: 'https://picsum.photos/400/600?random=3',
    duration: 22,
    file_size: 11234567,
    location_lat: 4.4350,
    location_lng: -75.2280,
    location_name: 'Plaza de Bolívar, Ibagué',
    tags: ['tolima', 'gastronomia', 'tradicional', 'lechona', 'tamales', 'viudo'],
    views_count: 890,
    likes_count: 67,
    has_active_coupon: false,
    is_active: true,
    created_at: '2024-01-13T12:20:00.000Z',
    business: {
      id: 'e4h7k1n4-q8t1-7w5z-g567-4c5d6e7f8g9h',
      owner_id: '772g0622-g41d-63f6-c938-668877662003',
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
        'lunes': { open: '11:00', close: '21:00' },
        'martes': { open: '11:00', close: '21:00' },
        'miercoles': { open: '11:00', close: '21:00' },
        'jueves': { open: '11:00', close: '21:00' },
        'viernes': { open: '11:00', close: '22:00' },
        'sabado': { open: '10:00', close: '22:00' },
        'domingo': { open: '10:00', close: '20:00' }
      },
      social_media: {
        instagram: '@cocina_abuela_ibague',
        facebook: 'La Cocina de la Abuela'
      },
      services: ['Comida tradicional', 'Eventos familiares', 'Domicilios', 'Desayunos típicos'],
      price_range: '$',
      is_active: true,
      rating_average: 4.3,
      total_reviews: 78,
      followers_count: 234,
      created_at: '2024-01-01T00:00:00.000Z'
    },
    liked: false,
    likesCount: 67
  },
  {
    id: 'm5n6o7p8-q9r0-s1t2-u3v4-w5x6y7z8a9b0',
    business_id: 'f5i8l2o5-r9u2-8x6a-h678-5d6e7f8g9h0i',
    title: 'Hospedaje boutique con vista panorámica 🏨🌄',
    description: 'Disfruta de una experiencia única en nuestro hotel boutique con vista panorámica a la cordillera. Habitaciones elegantes, spa y la mejor ubicación de Ibagué. #hospedaje #boutique #ibague #spa #cordillera',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail_url: 'https://picsum.photos/400/600?random=4',
    duration: 35,
    file_size: 22845671,
    location_lat: 4.4420,
    location_lng: -75.2350,
    location_name: 'Zona Rosa de Ibagué',
    tags: ['hospedaje', 'boutique', 'ibague', 'spa', 'cordillera', 'lujo'],
    views_count: 1567,
    likes_count: 112,
    has_active_coupon: true,
    is_active: true,
    created_at: '2024-01-12T09:15:00.000Z',
    business: {
      id: 'f5i8l2o5-r9u2-8x6a-h678-5d6e7f8g9h0i',
      owner_id: '883h1733-h52e-74g7-d049-779988773004',
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
        'lunes': { open: '00:00', close: '23:59' },
        'martes': { open: '00:00', close: '23:59' },
        'miercoles': { open: '00:00', close: '23:59' },
        'jueves': { open: '00:00', close: '23:59' },
        'viernes': { open: '00:00', close: '23:59' },
        'sabado': { open: '00:00', close: '23:59' },
        'domingo': { open: '00:00', close: '23:59' }
      },
      social_media: {
        instagram: '@miradorandes_hotel',
        facebook: 'Hotel Mirador de los Andes',
        website: 'www.miradorandes.com'
      },
      services: ['Habitaciones de lujo', 'Spa completo', 'Restaurante gourmet', 'Eventos empresariales', 'WiFi premium'],
      price_range: '$$$$',
      is_active: true,
      rating_average: 4.7,
      total_reviews: 89,
      followers_count: 445,
      created_at: '2024-01-01T00:00:00.000Z'
    },
    coupon: {
      id: 'h7i8j9k0-l1m2-3456-7890-123456789012',
      business_id: 'f5i8l2o5-r9u2-8x6a-h678-5d6e7f8g9h0i',
      title: '15% OFF en hospedaje',
      description: 'Descuento del 15% en estancia mínima de 2 noches. Incluye desayuno continental.',
      discount_type: 'percentage',
      discount_value: 15,
      coin_price: 30,
      max_uses: 30,
      current_uses: 8,
      is_active: true,
      expires_at: '2024-03-31T23:59:59.000Z',
      created_at: '2024-01-08T14:30:00.000Z'
    },
    liked: false,
    likesCount: 112
  },
  {
    id: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
    business_id: 'g6j9m3p6-s0v3-9y7b-i789-6e7f8g9h0i1j',
    title: 'Arte y cultura en el corazón de Ibagué 🎨🏛️',
    description: 'Explora nuestra galería de arte local y talleres culturales. Exposiciones permanentes de artistas tolimenses y actividades para toda la familia. #arte #cultura #ibague #exposicion #talleres',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail_url: 'https://picsum.photos/400/600?random=5',
    duration: 28,
    file_size: 16789234,
    location_lat: 4.4380,
    location_lng: -75.2310,
    location_name: 'Centro Cultural de Ibagué',
    tags: ['arte', 'cultura', 'ibague', 'exposicion', 'talleres', 'familia'],
    views_count: 723,
    likes_count: 54,
    has_active_coupon: false,
    is_active: true,
    created_at: '2024-01-11T16:45:00.000Z',
    business: {
      id: 'g6j9m3p6-s0v3-9y7b-i789-6e7f8g9h0i1j',
      owner_id: '994i2844-i63f-85h8-e150-880099884005',
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
        'lunes': { open: '09:00', close: '18:00' },
        'martes': { open: '09:00', close: '18:00' },
        'miercoles': { open: '09:00', close: '18:00' },
        'jueves': { open: '09:00', close: '18:00' },
        'viernes': { open: '09:00', close: '19:00' },
        'sabado': { open: '10:00', close: '19:00' },
        'domingo': { open: '10:00', close: '17:00' }
      },
      social_media: {
        instagram: '@arte_tolimense',
        facebook: 'Galería Arte Tolimense',
        twitter: '@ArteTolimaGal'
      },
      services: ['Exposiciones', 'Talleres de arte', 'Eventos culturales', 'Venta de arte local'],
      price_range: '$$',
      is_active: true,
      rating_average: 4.2,
      total_reviews: 34,
      followers_count: 167,
      created_at: '2024-01-01T00:00:00.000Z'
    },
    liked: true,
    likesCount: 54
  }
];

/**
 * Función auxiliar para obtener mock data de videos
 * Simula la respuesta de la API real
 */
export const getMockVideos = (page: number = 1, limit: number = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const videos = MOCK_VIDEOS_REALISTIC.slice(startIndex, endIndex);
  
  return {
    data: videos,
    hasMore: endIndex < MOCK_VIDEOS_REALISTIC.length,
    page,
    total: MOCK_VIDEOS_REALISTIC.length
  };
};

/**
 * Función para simular un delay de red
 */
export const simulateNetworkDelay = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};