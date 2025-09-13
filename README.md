# 🌿 Lambari - Descubre el Tolima

![Lambari Banner](https://img.shields.io/badge/Hackathon-Festech%202025-2A9D8F?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-54.0-000020?style=flat&logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)

## 🎯 ¿Qué es Lambari?

**Lambari** es una palabra de la lengua pijao que significa **"mirar"** - y esa es exactamente la filosofía de nuestra aplicación: invitarte a **mirar, descubrir y explorar** los tesoros ocultos del Tolima, Colombia.

Desarrollada para la **Hackathon Festech 2025**, Lambari es una aplicación móvil estilo TikTok que conecta viajeros y locales con los mejores lugares turísticos, hoteles, restaurantes y experiencias auténticas del departamento del Tolima, utilizando el poder del video vertical, la gamificación y la comunidad.

## 🏆 MVP - Hackathon Festech 2025

Este es un **MVP (Minimum Viable Product)** diseñado específicamente para demostrar el potencial de una plataforma de descubrimiento turístico innovadora en el Tolima, combinando tecnología moderna con la riqueza cultural y natural de la región.

## ✨ Características Principales

### 🎥 Feed de Descubrimiento Estilo TikTok
- **Videos Verticales**: Scroll infinito de contenido inmersivo de lugares turísticos
- **Reproducción Automática**: Videos optimizados con `expo-video` para mejor rendimiento
- **Interacciones Sociales**: Sistema de likes, comentarios y compartir contenido
- **Navegación Fluida**: Experiencia similar a TikTok con transiciones suaves

### � Descubrimiento de Destinos Turísticos
- **Hoteles y Hospedajes**: Descubre alojamientos únicos con videos auténticos
- **Restaurantes y Gastronomía**: Explora la diversidad culinaria del Tolima
- **Aventuras y Experiencias**: Encuentra actividades emocionantes y tours
- **Cultura Local**: Conecta con la historia y tradiciones pijaos
- **Naturaleza**: Descubre paisajes, parques y espacios naturales

### 🪙 Sistema de Gamificación con Coins
- **Gana Coins por Actividad**: Interactúa y recibe recompensas
  - 50 coins por registro inicial
  - 5 coins por seguir un negocio
  - 15 coins por dejar reseñas
  - 10 coins por crear planes de viaje
  - 5 coins por iniciar conversaciones
- **Canjea por Cupones**: Usa coins para obtener descuentos reales
- **Sistema de Transacciones**: Historial completo de earnings y gastos

### 💬 Chat en Tiempo Real
- **Comunicación Directa**: Contacta hoteles y restaurantes instantáneamente
- **Contexto Inteligente**: Conversaciones iniciadas desde videos específicos
- **Notificaciones**: Recibe respuestas en tiempo real
- **Soporte Multimedia**: Envío de mensajes de texto optimizado

### 🗺️ Planes de Viaje Colaborativos
- **Crea Itinerarios**: Diseña planes personalizados de visita
- **Comparte Experiencias**: Publica tus rutas para otros viajeros
- **Explora Planes Populares**: Descubre itinerarios creados por la comunidad
- **Estimaciones de Tiempo y Presupuesto**: Planifica mejor tus viajes

### 🔍 Búsqueda y Filtros Avanzados
- **Filtros por Categoría**: Gastronomía, hospedaje, aventura, cultura, etc.
- **Búsqueda por Ubicación**: Encuentra lugares cercanos con GPS
- **Filtros por Precio**: Rangos desde $ hasta $$$$
- **Tags Personalizados**: Sistema flexible de etiquetado
- **Solo con Cupones**: Filtra contenido con ofertas activas

### ⭐ Sistema de Reseñas y Calificaciones
- **Calificaciones de 1-5 estrellas**: Sistema robusto de evaluación
- **Reseñas Verificadas**: Comentarios auténticos de visitantes
- **Respuestas de Negocios**: Diálogo directo con establecimientos
- **Promedio Automático**: Cálculo dinámico de ratings

### 📍 Geolocalización Inteligente
- **Descubrimiento por Proximidad**: Encuentra lugares cercanos
- **Mapas Integrados**: Visualización de ubicaciones
- **Radio de Búsqueda**: Personaliza distancia de exploración
- **Coordenadas Precisas**: Información exacta de ubicaciones

## 🔄 Estado del Desarrollo

### ✅ Funcionalidades Implementadas y Funcionales

#### 🎬 Sistema de Videos
- [x] **VideoCard Component**: Reproducción estilo TikTok con `expo-video`
- [x] **Controles Interactivos**: Like, compartir, comentar, seguir perfil
- [x] **Información Contextual**: Business info, ubicación, tags, descripciones
- [x] **Navegación a Detalles**: Links a perfiles de negocio
- [x] **Scroll Infinito**: Feed optimizado con paginación
- [x] **Reproducción Automática**: Videos se reproducen al estar visibles

#### 🏗️ Arquitectura y Backend
- [x] **Supabase Integrado**: Base de datos PostgreSQL con Row Level Security
- [x] **Sistema de Autenticación**: Registro y login completo con contextos
- [x] **Base de Datos Completa**: 15+ tablas con relaciones complejas
- [x] **Triggers Automáticos**: 20+ triggers para automatización
- [x] **APIs Robustas**: Endpoints para todas las funcionalidades

#### 🎮 Sistema de Coins Funcional
- [x] **Wallet System**: Billeteras individuales por usuario
- [x] **Transacciones Automáticas**: Coins otorgados por actividades
- [x] **Historial Completo**: Tracking de earnings y gastos
- [x] **Compra de Cupones**: Sistema funcional de canje
- [x] **Prevención de Duplicados**: Anti-cheat en recompensas

#### 💬 Chat en Tiempo Real
- [x] **Conversaciones**: Sistema completo cliente-negocio
- [x] **Mensajes Instantáneos**: WebSockets con Supabase Realtime
- [x] **Contexto Automático**: Conversaciones desde videos específicos
- [x] **UI Optimizada**: Interfaz nativa con ChatInput component

#### 🔍 Búsqueda y Filtros
- [x] **SearchFilters Component**: Modal completo con 10+ filtros
- [x] **Filtros por Categoría**: 7 categorías principales implementadas
- [x] **Geolocalización**: Búsqueda por radio y ubicación
- [x] **Tags Dinámicos**: Sistema flexible de etiquetado
- [x] **Filtros de Precio**: Rangos de $ a $$$$
- [x] **Solo Cupones Activos**: Filtro por ofertas disponibles

#### 📱 UI/UX Completa
- [x] **Navegación por Tabs**: 5 pestañas principales funcionales
- [x] **Componentes Reutilizables**: Button, Input, Card, Loading
- [x] **Tema Consistente**: Paleta de colores del Tolima
- [x] **Estados de Carga**: Loading states en toda la app
- [x] **Gestión de Errores**: Error handling robusto

#### 🗺️ Planes de Viaje
- [x] **UserPlans System**: Creación y gestión de itinerarios
- [x] **Plan Items**: Componentes ordenados de planes
- [x] **Sistema Social**: Likes en planes con recompensas
- [x] **Estimaciones**: Tiempo y presupuesto por plan

### 🚧 En Desarrollo / Por Implementar

#### 📱 Pantallas Finales
- [ ] **Pantallas de Auth**: Login/Register UI (lógica completa)
- [ ] **Business Detail**: Perfil completo de negocio
- [ ] **User Profile**: Perfil completo de usuario
- [ ] **Chat Interface**: Lista de conversaciones
- [ ] **Plans Explorer**: Navegación de planes públicos

#### 🎥 Contenido
- [ ] **Videos Reales**: Contenido grabado en el Tolima
- [ ] **Datos de Demo**: Negocios reales del Tolima
- [ ] **Integración con Maps**: Visualización geográfica
- [ ] **Upload de Videos**: Funcionalidad para crear contenido

#### 🔔 Funcionalidades Adicionales
- [ ] **Push Notifications**: Notificaciones en tiempo real
- [ ] **Compartir Externo**: Integración con redes sociales
- [ ] **Modo Offline**: Caché de contenido básico
- [ ] **Analytics**: Métricas de uso y engagement

## 🏗️ Arquitectura Técnica

### Backend (Supabase + PostgreSQL)

#### 📊 Base de Datos Completa
- **15+ Tablas Relacionales**: Diseño escalable para marketplace turístico
- **Row Level Security**: Seguridad a nivel de fila implementada
- **20+ Triggers Automáticos**: Automatización completa de recompensas y cálculos
- **APIs Generadas**: Endpoints RESTful automáticos
- **Realtime Subscriptions**: WebSockets para chat en vivo

#### 🔧 Funciones Serverless
```sql
-- Ejemplos de funciones implementadas
- purchase_coupon(): Compra completa de cupones
- create_conversation_with_context(): Chat inteligente
- get_videos_with_active_coupons(): Búsqueda avanzada
- reward_activity_coins(): Sistema de recompensas
- cleanup_incomplete_users(): Mantenimiento automático
```

#### 🛡️ Seguridad y Validación
- **JWT Authentication**: Autenticación robusta con Supabase Auth
- **Políticas RLS**: Acceso controlado a datos por usuario
- **Validaciones de Integridad**: Constraints y checks en base de datos
- **Prevención de Duplicados**: Lógica anti-cheat en recompensas

### Frontend (React Native + Expo)

#### 📱 Tecnologías Principales
- **Expo SDK 54**: Framework moderno para desarrollo móvil
- **React Native 0.81**: Performance nativa optimizada  
- **TypeScript**: Type safety completo en toda la aplicación
- **Expo Router**: Navegación basada en archivos
- **Expo Video**: Nueva API para reproducción optimizada

#### 🎨 UI/UX Components
```typescript
// Componentes principales implementados
- VideoCard: Reproductor estilo TikTok
- SearchFilters: Modal con 10+ filtros
- ChatInput: Input optimizado para messaging  
- Button: 5 variantes con estados
- Input: Validación y estados integrados
- Loading: Estados de carga consistentes
```

#### 🔄 Gestión de Estado
- **React Context**: AuthContext para usuario global
- **Custom Hooks**: useChat, useVideos, useAuth, etc.
- **Local State**: useState para componentes específicos
- **Optimistic Updates**: UX fluida en likes y interacciones

#### 🛠️ Herramientas de Desarrollo
- **ESLint & Prettier**: Código limpio y consistente
- **TypeScript**: Tipado estático para mayor robustez
- **Expo Dev Tools**: Debugging y testing integrado

## � Filosofía "Lambari" - Inspiración Pijao

### 🎨 Identidad Visual
Inspirada en la naturaleza y cultura del Tolima:

- **🌿 Verde montaña profundo**: `#2A9D8F` (Primario) - Representa las montañas y biodiversidad
- **⚫ Gris volcán oscuro**: `#264653` (Secundario) - Evoca la imponencia del Nevado del Tolima
- **☀️ Beige cálido**: `#E9C46A` (Acento) - Refleja la calidez de la gente tolimense

### 🏛️ Conexión Cultural
La palabra **Lambari** en lengua pijao significa "mirar", reflejando:
- **Mirar hacia adelante**: Innovación tecnológica para el turismo
- **Mirar con respeto**: Valoración del patrimonio cultural pijao
- **Mirar con propósito**: Descubrimiento consciente y sostenible
- **Mirar juntos**: Comunidad colaborativa de viajeros y locales

## 📁 Estructura del Proyecto

```
lambari-app/ (festech-app)
├── app/                      # 🏠 Pantallas principales con Expo Router
│   ├── (tabs)/              # 📱 Navegación principal (5 tabs)
│   │   ├── index.tsx        # 🎬 Feed de videos estilo TikTok
│   │   ├── explore.tsx      # 🔍 Explorar con filtros avanzados
│   │   ├── create.tsx       # ➕ Crear contenido y planes
│   │   ├── inbox.tsx        # 💬 Chat y mensajes
│   │   └── clientProfile.tsx# 👤 Perfil de usuario
│   ├── auth/                # 🔐 Autenticación
│   │   ├── login.tsx        # 🚪 Inicio de sesión
│   │   └── register.tsx     # 📝 Registro de usuario
│   ├── businessDetail.tsx   # 🏨 Detalle de negocio/hotel
│   └── _layout.tsx          # 🎨 Layout global con tema
├── components/               # 🧩 Componentes reutilizables
│   ├── ui/                  # 🎛️ Componentes base del UI
│   │   ├── VideoCard.tsx    # 🎥 Card principal estilo TikTok
│   │   ├── SearchFilters.tsx# 🔍 Modal de filtros avanzados
│   │   ├── ChatInput.tsx    # 💬 Input de chat optimizado
│   │   ├── ChatHeader.tsx   # 📋 Header de conversaciones
│   │   ├── Button.tsx       # 🔘 Botón con 5 variantes
│   │   ├── Input.tsx        # ⌨️ Input con validación
│   │   ├── Card.tsx         # 📄 Tarjeta genérica
│   │   └── Loading.tsx      # ⏳ Estados de carga
│   └── VideoUpload.tsx      # 📤 Subida de videos
├── contexts/                 # 🧠 Gestión de estado global
│   └── AuthContext.tsx      # 🔑 Contexto de autenticación
├── hooks/                    # 🎣 Custom hooks para lógica
│   ├── useChat.ts           # 💬 Chat en tiempo real
│   ├── useVideos.ts         # 🎬 Gestión de videos
│   ├── useAuth.ts           # 🔐 Autenticación
│   ├── useConversations.ts  # 💬 Lista de conversaciones
│   ├── useSearchFilters.ts  # 🔍 Filtros de búsqueda
│   └── useVideoUpload.ts    # 📤 Subida de contenido
├── lib/                      # 📚 Librerías y configuraciones
│   ├── supabase.ts          # 🗄️ Cliente de Supabase
│   ├── videos-api.ts        # 🎥 APIs de videos
│   ├── business-api.ts      # 🏢 APIs de negocios
│   └── search-api.ts        # 🔍 APIs de búsqueda
├── types/                    # 📝 Tipos de TypeScript
│   ├── database.ts          # 🗄️ Tipos de base de datos
│   ├── app.ts               # 📱 Tipos de aplicación
│   └── index.ts             # 📦 Exportaciones
├── constants/                # 🎯 Constantes globales
│   ├── theme.ts             # 🎨 Paleta de colores Tolima
│   └── Design.ts            # 📏 Tipografía y espaciado
└── screens/                  # 📺 Pantallas adicionales
    └── auth/                # 🔐 Pantallas de autenticación
        ├── LoginScreen.tsx  # 🚪 Pantalla de login
        ├── RegisterScreen.tsx# 📝 Pantalla de registro
        └── WelcomeScreen.tsx# 👋 Pantalla de bienvenida
```

### 🎯 Navegación Principal (Tabs)

1. **🏠 index.tsx** - Feed Principal
   - Videos estilo TikTok con scroll infinito
   - Interacciones: like, compartir, comentar
   - Navegación a detalles de negocio

2. **🔍 explore.tsx** - Explorar
   - Búsqueda avanzada con filtros
   - Categorías: Hoteles, Restaurantes, Aventura, etc.
   - Mapa de ubicaciones

3. **➕ create.tsx** - Crear
   - Subir videos promocionales
   - Crear planes de viaje
   - Herramientas de edición

4. **💬 inbox.tsx** - Mensajes
   - Chat en tiempo real con negocios
   - Lista de conversaciones
   - Notificaciones

5. **👤 clientProfile.tsx** - Perfil
   - Información personal
   - Wallet y coins
   - Historial de actividad

## � Configuración y Desarrollo

### 🔧 Configuración Inicial

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/JuanAlvarez2004/festech-app.git
cd festech-app
```

#### 2. Instalar Dependencias
```bash
npm install
# o con yarn
yarn install
```

#### 3. Variables de Entorno
Crea un archivo `.env` en la raíz:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 4. Ejecutar la Aplicación
```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar en iOS Simulator
npm run ios

# Ejecutar en Android Emulator  
npm run android

# Ejecutar en navegador web
npm run web
```

### 📱 Testing en Dispositivos

#### Expo Go (Recomendado para desarrollo)
1. Instala Expo Go desde App Store/Google Play
2. Escanea el QR code que aparece en terminal
3. La app se cargará directamente en tu dispositivo

#### Build de Producción
```bash
# Build para Android
npx eas build --platform android

# Build para iOS
npx eas build --platform ios
```

### 🗄️ Configuración de Supabase

#### Base de Datos
- PostgreSQL con Row Level Security habilitado
- 15+ tablas con relaciones complejas
- 20+ triggers automáticos para recompensas
- Funciones serverless para lógica de negocio

#### Autenticación
- Email/Password authentication
- Perfiles automáticos con triggers
- Wallet system con coins de bienvenida

#### Realtime
- Chat en vivo con WebSockets
- Subscripciones a mensajes nuevos
- Actualizaciones en tiempo real de likes y comentarios
npm run android

# Web
npm run web
```

## 📱 Funcionalidades Implementadas

### ✅ Completadas

- [x] Sistema de colores global inspirado en el Tolima
- [x] Configuración de Supabase con autenticación
- [x] Tipos TypeScript para toda la base de datos
- [x] Navegación estilo TikTok con 5 tabs
- [x] Componentes UI reutilizables (Button, Input, VideoCard, etc.)
- [x] Context de autenticación con React
- [x] Feed principal con videos verticales
- [x] Configuración de permisos para cámara y ubicación

### 🚧 En Desarrollo

- [ ] Pantallas de login/registro
- [ ] Integración completa con Supabase
- [ ] Sistema de likes y comentarios
- [ ] Chat en tiempo real
- [ ] Búsqueda y filtros de negocios
- [ ] Sistema de coins y cupones
- [ ] Perfil de usuario y negocio
- [ ] Carga y reproducción de videos reales

## 🏗️ Arquitectura de Componentes

### VideoCard Component
Componente principal para mostrar videos estilo TikTok:
- Reproducción automática cuando está visible
- Controles de like, compartir y comentar
- Información del negocio overlay
- Navegación a perfil de negocio

### Button Component
Botón reutilizable con múltiples variantes:
- `primary`, `secondary`, `outline`, `ghost`, `gradient`
- Tamaños: `sm`, `md`, `lg`
- Estados de loading y disabled
- Soporte para iconos

### Input Component
Input con validación y estados:
- Labels y mensajes de error
- Iconos izquierdo y derecho
- Soporte para passwords
- Validación en tiempo real

## 🎮 Sistema de Gamificación Detallado

### 💰 Economía de Coins

#### 🎯 Formas de Ganar Coins
| Actividad | Coins | Frecuencia | Propósito |
|-----------|-------|------------|-----------|
| 🎉 **Registro** | 50 coins | Una vez | Bienvenida y prueba inicial |
| 👥 **Seguir Negocio** | 5 coins | Por negocio único | Fomentar descubrimiento |
| ⭐ **Escribir Reseña** | 15 coins | Por reseña | Incentivar feedback |
| 💬 **Iniciar Chat** | 5 coins | Por negocio único | Promover comunicación |
| 🗺️ **Crear Plan** | 10 coins | Por plan creado | Contenido generado por usuarios |
| ❤️ **Plan Recibe Like** | 5 coins | Primer like únicamente | Recompensar creadores |

#### 💸 Formas de Gastar Coins
- **🎫 Cupones de Descuento**: Costo variable según negocio
- **🌟 Funciones Premium**: Destacar contenido (futuro)
- **🎁 Intercambio por Productos**: Marketplace de rewards (futuro)

#### 🛡️ Prevención de Abuso
- **Anti-duplicate Logic**: Previene múltiples recompensas por la misma acción
- **Verificación de Actividad**: Transacciones trackeadas individualmente
- **Límites Temporales**: Cooldowns en ciertas acciones (implementable)

### 🎫 Sistema de Cupones

#### 📋 Tipos de Descuentos
- **Porcentual**: 10%, 20%, 50% de descuento
- **Fijo**: $5,000, $10,000 pesos de descuento
- **2x1**: Promociones especiales
- **Combo**: Descuentos en paquetes

#### 🔄 Flujo de Compra
1. Usuario ve video con cupón activo
2. Utiliza coins para "comprar" el cupón
3. Recibe código único (ej: "LAM2024ABC")
4. Presenta código en el negocio físico
5. Negocio valida y aplica descuento

#### ⏰ Gestión de Vencimiento
- Cupones con fecha de expiración
- Límite de usos por cupón
- Estados: Activo → Usado → Expirado

## 🎯 Estrategia para Hackathon Festech

### 🏆 Propuesta de Valor Única

#### 🌍 Enfoque Regional Especializado
- **Mercado Objetivo**: Tolima como destino turístico emergente
- **Diferenciación**: Primera app de video-turismo específica para el departamento
- **Oportunidad**: Aprovechar el crecimiento del turismo post-pandemia

#### 💡 Innovación Tecnológica
- **Video-First Experience**: Contenido auténtico vs. fotos estáticas
- **Gamificación Real**: Coins convertibles en beneficios tangibles  
- **IA de Personalización**: Algoritmos para descubrimiento relevante
- **Comunidad Activa**: UGC (User Generated Content) con planes de viaje

### 📈 Escalabilidad y Modelo de Negocio

#### 💰 Fuentes de Ingresos
1. **Comisiones por Cupones**: 10-15% por cupón canjeado
2. **Premium Business**: Subscripciones para destacar contenido
3. **Publicidad Nativa**: Posts patrocinados integrados al feed
4. **Affiliate Marketing**: Comisiones por bookings de hoteles
5. **Data Insights**: Analytics de turismo para gobiernos locales

#### 🚀 Plan de Escalamiento
- **Fase 1**: MVP en Tolima (Hackathon)
- **Fase 2**: Expansión a Eje Cafetero (6 meses)
- **Fase 3**: Cobertura nacional de destinos emergentes (1 año)
- **Fase 4**: Expansión LATAM (2 años)

### 🎯 KPIs y Métricas de Éxito

#### 📱 Engagement Metrics
- **Tiempo promedio por sesión**: Target >5 minutos
- **Videos vistos por usuario**: Target >10 videos/sesión
- **Tasa de interacción**: Target >8% (likes, comentarios, shares)
- **Retención D7**: Target >40%

#### 💼 Business Metrics  
- **Cupones canjeados/mes**: Validación de monetización
- **Negocios activos**: Adopción del lado de la oferta
- **Revenue per User**: Monetización efectiva
- **Net Promoter Score**: Satisfacción y viralidad

### 🏅 Ventajas Competitivas

#### 🎬 vs. TikTok/Instagram
- **Hiperlocalización**: Contenido 100% relevante para turistas
- **Conversión Directa**: De video a experiencia real inmediata
- **Comunidad Especializada**: Usuarios con intención de viaje

#### 🗺️ vs. TripAdvisor/Google
- **Contenido Fresco**: Videos actualizados vs. reseñas antigas
- **Experiencia Inmersiva**: Ver antes de ir vs. solo leer
- **Interacción Real-time**: Chat directo vs. formularios

#### 🏨 vs. Booking/Airbnb
- **Descubrimiento Serendípico**: Encuentra lo inesperado
- **Context Social**: Recomendaciones de comunidad local
- **Experiencias Completas**: No solo hospedaje, todo el ecosistema

### 🛠️ Aspectos Técnicos Innovadores

#### 🔧 Arquitectura Escalable
- **Serverless Backend**: Costos optimizados por uso real
- **CDN Global**: Videos cargados rápidamente desde cualquier ubicación
- **Real-time Everything**: Experiencia fluida y responsiva
- **Mobile-First**: Optimizado para el dispositivo principal de uso

#### 🤖 Tecnología IA/ML (Futuro)
- **Recomendaciones Personalizadas**: Algoritmo basado en preferencias
- **Computer Vision**: Reconocimiento automático de lugares en videos
- **NLP para Reviews**: Análisis de sentimiento en reseñas
- **Predicción de Demanda**: Optimización de precios dinámicos

### 📊 Plan de Implementación Post-Hackathon

#### 🎯 Próximos 30 días
- [ ] Completar UI de autenticación
- [ ] Grabar contenido real del Tolima
- [ ] Onboarding de 10 negocios piloto
- [ ] Beta testing con 50 usuarios

#### 🎯 Próximos 90 días  
- [ ] Launch público en Ibagué
- [ ] 100+ videos de contenido
- [ ] 50+ negocios registrados
- [ ] Sistema de notificaciones push
- [ ] Métricas de analytics implementadas

#### 🎯 Próximos 6 meses
- [ ] Expansión a municipios del Tolima
- [ ] 1,000+ usuarios activos mensuales
- [ ] Partnership con Gobernación del Tolima
- [ ] Modelo de ingresos validado
- [ ] Ronda de financiación seed

## � Documentación Técnica

### 🗄️ Base de Datos (PostgreSQL + Supabase)

La aplicación utiliza una arquitectura de base de datos robusta con 15+ tablas interconectadas:

#### 🔗 Entidades Principales
- **`profiles`** - Perfiles de usuarios (clientes/negocios)
- **`businesses`** - Información detallada de establecimientos
- **`videos`** - Contenido principal con metadatos
- **`video_likes`** - Sistema de interacciones sociales
- **`conversations`** - Sesiones de chat cliente-negocio
- **`messages`** - Mensajes individuales en tiempo real
- **`wallets`** - Billeteras digitales de coins
- **`coin_transactions`** - Historial completo de transacciones
- **`coupons`** - Ofertas y promociones
- **`user_coupons`** - Cupones adquiridos por usuarios
- **`user_plans`** - Planes de viaje creados por usuarios
- **`plan_items`** - Componentes individuales de planes
- **`business_reviews`** - Sistema de calificaciones
- **`user_follows`** - Relaciones sociales usuario-negocio

#### ⚡ Triggers y Automatización
- **20+ Triggers PostgreSQL** para automatización completa
- **Recompensas automáticas** de coins por actividades
- **Cálculos en tiempo real** de ratings y estadísticas
- **Validaciones de integridad** y prevención de duplicados

Ver documentación completa en [`SUPABASE_INFRASTRUCTURE.md`](./SUPABASE_INFRASTRUCTURE.md)

### 🔒 Seguridad y Políticas

#### 🛡️ Row Level Security (RLS)
- Políticas de acceso granular por tabla
- Usuarios solo ven sus propios datos privados
- Validación automática de permisos

#### 🔐 Autenticación
- JWT tokens con Supabase Auth
- Refresh tokens automáticos
- Logout seguro con invalidación de sesiones

### 📖 Referencias y Enlaces

- **[Documentación de Supabase](https://supabase.com/docs)**
- **[Expo SDK 54 Docs](https://docs.expo.dev/)**  
- **[React Native 0.81](https://reactnative.dev/docs/getting-started)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**
- **[Expo Video API](https://docs.expo.dev/versions/latest/sdk/video/)**

## 🤝 Equipo y Contribuciones

### 👨‍💻 Desarrollador Principal
- **Juan Álvarez** - Full Stack Developer
- GitHub: [@JuanAlvarez2004](https://github.com/JuanAlvarez2004)
- LinkedIn: [Juan David Álvarez](https://linkedin.com/in/juan-david-alvarez)

### 🌟 Cómo Contribuir

1. **Fork el proyecto**
```bash
git fork https://github.com/JuanAlvarez2004/festech-app.git
```

2. **Crear rama para feature**
```bash
git checkout -b feature/nueva-funcionalidad
```

3. **Commit con mensaje descriptivo**
```bash
git commit -m "feat: agrega sistema de notificaciones push"
```

4. **Push y crear Pull Request**
```bash
git push origin feature/nueva-funcionalidad
```

### 🐛 Reportar Issues
- Usa GitHub Issues para bugs y sugerencias
- Incluye screenshots y logs si es posible
- Especifica dispositivo y versión de OS

### 💡 Ideas de Contribución
- **🎨 UI/UX**: Mejoras en diseño y usabilidad
- **🚀 Performance**: Optimizaciones de rendimiento
- **🔧 Features**: Nuevas funcionalidades
- **📱 Plataformas**: Soporte para más dispositivos
- **🌍 i18n**: Traducción a otros idiomas

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. 

```
MIT License

Copyright (c) 2025 Juan David Álvarez - Lambari (Festech Hackathon)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Contacto

### 📧 Información del Proyecto
- **Proyecto**: Lambari - Descubre el Tolima
- **Email**: juanalvarez.dev2004@gmail.com  
- **Demo**: [Expo App](https://expo.dev/@juanalvarez2004/festech-app)
- **Hackathon**: Festech 2025

### 🌐 Links Importantes
- **GitHub Repository**: https://github.com/JuanAlvarez2004/festech-app
- **Documentación Técnica**: [SUPABASE_INFRASTRUCTURE.md](./SUPABASE_INFRASTRUCTURE.md)
- **Supabase Dashboard**: [Panel de Administración](https://supabase.com/dashboard)

---

<div align="center">

### 🌿 **"Lambari - Mirar hacia el futuro del turismo en el Tolima"** 🌿

**Hecho con ❤️ para la Hackathon Festech 2025**

**Colombia 🇨🇴 • Tolima • Innovación Tecnológica**

![Tolima](https://img.shields.io/badge/Orgullosamente-Tolimense-2A9D8F?style=for-the-badge)
![Hackathon](https://img.shields.io/badge/Hackathon-Festech%202025-E9C46A?style=for-the-badge)

</div>