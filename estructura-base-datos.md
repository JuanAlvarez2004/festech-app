# 📊 Estructura de Base de Datos - Festech MVP

## 🎯 Resumen Arquitectónico

Esta documentación describe la estructura completa de la base de datos del MVP Festech, un sistema para descubrimiento de negocios locales estilo TikTok con gamificación y chat en tiempo real.

**Tecnología:** PostgreSQL con Supabase  
**Seguridad:** Row Level Security (RLS) habilitado  
**Tiempo Real:** WebSockets para chat y notificaciones  
**Storage:** Buckets para videos, imágenes y archivos  

---

## 📋 Índice de Tablas

### 🔑 Autenticación y Perfiles
- [profiles](#profiles) - Perfiles de usuarios
- [auth.users](#authusers) - Usuarios (Supabase automático)

### 🏢 Negocios y Contenido  
- [businesses](#businesses) - Negocios registrados
- [business_categories](#business_categories) - Categorías de negocio
- [videos](#videos) - Videos de contenido
- [video_tags](#video_tags) - Tags de videos

### ⭐ Interacciones Sociales
- [video_likes](#video_likes) - Likes en videos
- [user_follows](#user_follows) - Seguimiento de negocios
- [user_favorites](#user_favorites) - Videos favoritos
- [business_reviews](#business_reviews) - Calificaciones y reseñas

### 💬 Chat y Comunicación
- [conversations](#conversations) - Conversaciones cliente-negocio
- [messages](#messages) - Mensajes del chat

### 🪙 Sistema de Coins
- [wallets](#wallets) - Billeteras de usuarios
- [coin_transactions](#coin_transactions) - Historial de transacciones

### 🎁 Sistema de Cupones
- [coupons](#coupons) - Cupones disponibles
- [user_coupons](#user_coupons) - Cupones comprados

### 📋 Planes Personalizados
- [user_plans](#user_plans) - Planes creados por usuarios
- [plan_items](#plan_items) - Items de cada plan
- [plan_likes](#plan_likes) - Likes en planes

---

## 🔗 Diagrama de Relaciones

```
auth.users (Supabase)
    ↓ (1:1)
profiles
    ↓ (1:N)
    ├── businesses ← owner_id
    │   ├── videos ← business_id
    │   │   ├── video_likes ← video_id
    │   │   ├── video_tags ← video_id
    │   │   └── user_favorites ← video_id
    │   ├── business_reviews ← business_id
    │   ├── user_follows ← business_id
    │   ├── coupons ← business_id
    │   └── conversations ← business_id
    ├── wallets ← user_id
    │   └── coin_transactions ← user_id
    ├── user_coupons ← user_id
    ├── user_plans ← creator_id
    │   ├── plan_items ← plan_id
    │   └── plan_likes ← plan_id
    └── messages ← sender_id
```

---

## 📊 Estructura de Tablas

### auth.users
**Función:** Tabla automática de Supabase para autenticación  
**Tipo:** Sistema (no modificable)

```sql
-- Estructura automática de Supabase
{
  id: UUID,
  email: string,
  encrypted_password: string,
  email_confirmed_at: timestamp,
  created_at: timestamp,
  updated_at: timestamp
}
```

### profiles
**Función:** Perfiles extendidos de usuarios (clientes y empresas)  
**Relación:** 1:1 con auth.users  
**RLS:** Habilitado ✅

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('client', 'business')),
  phone VARCHAR(20),
  city VARCHAR(100) DEFAULT 'Ibagué',
  avatar_url TEXT,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Campos Clave:**
- `user_type`: Diferencia entre clientes y empresarios
- `interests`: Array de categorías preferidas
- `city`: Localización base del usuario

**Políticas RLS:**
- Users can view own profile
- Users can update own profile

### business_categories
**Función:** Categorías predefinidas para clasificar negocios  
**Tipo:** Catálogo de referencia

```sql
CREATE TABLE business_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  description TEXT
);
```

**Categorías Disponibles:**
- 🍕 gastronomia
- 🏨 hospedaje  
- 🎯 aventura
- 🏛️ cultura
- 🛍️ compras
- 🌙 vida_nocturna
- 🌿 naturaleza

### businesses
**Función:** Negocios registrados en la plataforma  
**Relación:** N:1 con profiles (owner_id)  
**RLS:** Habilitado ✅

```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  phone VARCHAR(20),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  full_address TEXT,
  neighborhood VARCHAR(100),
  logo_url TEXT,
  cover_image_url TEXT,
  whatsapp VARCHAR(20),
  price_range VARCHAR(20) CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
  schedule JSONB DEFAULT '{}',
  social_media JSONB DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  rating_average DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Campos Clave:**
- `latitude/longitude`: Coordenadas GPS para localización
- `schedule`: Horarios en formato JSON
- `rating_average`: Calculado automáticamente por triggers
- `followers_count`: Actualizado por triggers

**Estructura JSON schedule:**
```json
{
  "lunes": {"open": "06:00", "close": "20:00"},
  "martes": {"open": "06:00", "close": "20:00"},
  "cerrado": ["domingo"]
}
```

**Políticas RLS:**
- Anyone can view active businesses
- Owners can manage their business

**Índices:**
- `idx_businesses_category` - Búsquedas por categoría
- `idx_businesses_location` - Búsquedas geoespaciales

### videos
**Función:** Videos de contenido subidos por negocios  
**Relación:** N:1 con businesses  
**RLS:** Habilitado ✅

```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- segundos
  file_size INTEGER, -- bytes
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_name VARCHAR(255),
  tags TEXT[] DEFAULT '{}',
  coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL, -- 🆕 CUPÓN ASOCIADO
  has_active_coupon BOOLEAN GENERATED ALWAYS AS (
    coupon_id IS NOT NULL AND 
    EXISTS (SELECT 1 FROM coupons WHERE id = coupon_id AND is_active = true AND (expires_at IS NULL OR expires_at > NOW()))
  ) STORED, -- 🆕 CAMPO CALCULADO AUTOMÁTICO
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Campos Clave:**
- `video_url`: URL del archivo en Supabase Storage
- `likes_count`: Actualizado automáticamente por triggers
- `tags`: Tags para búsqueda y filtros
- `coupon_id`: Referencia opcional a cupón asociado 🆕
- `has_active_coupon`: Campo calculado que indica si el video tiene cupón activo 🆕

**Políticas RLS:**
- Anyone can view active videos
- Business owners can manage their videos
- Business owners can only associate their own coupons 🆕

**Índices:**
- `idx_videos_business` - Videos por negocio
- `idx_videos_created` - Orden cronológico para feed
- `idx_videos_location` - Búsquedas por ubicación
- `idx_videos_coupon` - Videos con cupones asociados 🆕
- `idx_videos_active_coupon` - Videos con cupones activos 🆕

### video_tags
**Función:** Tags individuales para videos (búsqueda avanzada)  
**Relación:** N:N entre videos y tags  
**RLS:** Habilitado ✅

```sql
CREATE TABLE video_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(video_id, tag)
);
```

**Políticas RLS:**
- Anyone can view tags
- Business owners can manage video tags

### video_likes
**Función:** Likes de usuarios en videos  
**Relación:** N:N entre profiles y videos  
**RLS:** Habilitado ✅

```sql
CREATE TABLE video_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(video_id, user_id)
);
```

**Trigger:** Actualiza automáticamente `videos.likes_count`

### user_follows
**Función:** Seguimiento de usuarios a negocios  
**Relación:** N:N entre profiles y businesses  
**RLS:** Habilitado ✅

```sql
CREATE TABLE user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, business_id)
);
```

**Trigger:** 
- Actualiza `businesses.followers_count`
- Otorga 5 coins al seguir un negocio

### user_favorites
**Función:** Videos guardados como favoritos  
**Relación:** N:N entre profiles y videos  
**RLS:** Habilitado ✅

```sql
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  folder_name VARCHAR(100) DEFAULT 'General',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);
```

**Características:**
- Organización por carpetas
- Un video puede estar en múltiples carpetas

### business_reviews
**Función:** Calificaciones y reseñas de negocios  
**Relación:** N:N entre profiles y businesses  
**RLS:** Habilitado ✅

```sql
CREATE TABLE business_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  visit_verified BOOLEAN DEFAULT false,
  business_response TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_id, user_id)
);
```

**Triggers:**
- Actualiza `businesses.rating_average` y `total_reviews`
- Otorga 15 coins por dejar reseña

### conversations
**Función:** Conversaciones entre clientes y negocios  
**Relación:** N:1 con profiles y businesses  
**RLS:** Habilitado ✅

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL, -- 🆕 VIDEO DE ORIGEN
  coupon_context_id UUID REFERENCES coupons(id) ON DELETE SET NULL, -- 🆕 CUPÓN DE CONTEXTO
  last_message_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(client_id, business_id)
);
```

**Trigger:** Otorga 5 coins por iniciar chat (una vez por negocio)

### messages
**Función:** Mensajes individuales del chat  
**Relación:** N:1 con conversations y profiles  
**RLS:** Habilitado ✅  
**Realtime:** Habilitado 🔴

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Trigger:** Actualiza `conversations.last_message_at`

### wallets
**Función:** Billeteras de coins de usuarios  
**Relación:** 1:1 con profiles  
**RLS:** Habilitado ✅

```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 50, -- coins de bienvenida
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
```

**Trigger:** Se crea automáticamente al registrar usuario

### coin_transactions
**Función:** Historial de transacciones de coins  
**Relación:** N:1 con profiles  
**RLS:** Habilitado ✅

```sql
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('earn', 'spend')),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Tipos de Transacciones:**
- `earn`: Ganar coins (registro, actividades, etc.)
- `spend`: Gastar coins (comprar cupones)

### coupons
**Función:** Cupones disponibles para compra  
**Relación:** N:1 con businesses  
**RLS:** Habilitado ✅

```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  coin_price INTEGER NOT NULL,
  max_uses INTEGER DEFAULT 100,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Tipos de Descuento:**
- `percentage`: Porcentaje (ej: 20%)
- `fixed`: Monto fijo (ej: $10,000)

### user_coupons
**Función:** Cupones comprados por usuarios  
**Relación:** N:1 con coupons y profiles  
**RLS:** Habilitado ✅

```sql
CREATE TABLE user_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  purchased_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);
```

**Estados del Cupón:**
- `active`: Disponible para usar
- `used`: Ya utilizado
- `expired`: Vencido

### user_plans
**Función:** Planes personalizados creados por usuarios  
**Relación:** N:1 con profiles  
**RLS:** Habilitado ✅

```sql
CREATE TABLE user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  estimated_duration INTEGER, -- minutos
  estimated_budget DECIMAL(10,2),
  is_public BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Trigger:** Otorga 10 coins por crear plan

### plan_items
**Función:** Items individuales de cada plan  
**Relación:** N:1 con user_plans y businesses  
**RLS:** Habilitado ✅

```sql
CREATE TABLE plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES user_plans(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  estimated_time INTEGER, -- minutos
  estimated_start_time TIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### plan_likes
**Función:** Likes en planes de usuarios  
**Relación:** N:N entre profiles y user_plans  
**RLS:** Habilitado ✅

```sql
CREATE TABLE plan_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES user_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(plan_id, user_id)
);
```

**Trigger:** 
- Actualiza `user_plans.likes_count`
- Otorga 5 coins al creador del plan

---

## ⚡ Flujo de Datos y Triggers

### Trigger de Creación de Usuario
```
auth.users INSERT 
    ↓
profiles INSERT (on_profile_created)
    ↓
wallets INSERT (50 coins bienvenida)
    ↓
coin_transactions INSERT (registro)
```

### Trigger de Likes en Videos
```
video_likes INSERT/DELETE
    ↓
update_video_likes()
    ↓
videos.likes_count ±1
```

### Trigger de Follows
```
user_follows INSERT/DELETE
    ↓
update_followers_count()
    ↓
businesses.followers_count ±1
    + reward_activity_coins() (5 coins)
```

### Trigger de Chat
```
conversations INSERT
    ↓
reward_chat_coins()
    ↓
wallets.balance +5 (primera vez por negocio)
```

### Trigger de Mensajes
```
messages INSERT
    ↓
update_conversation_activity()
    ↓
conversations.last_message_at = NOW()
```

### Trigger de Reseñas
```
business_reviews INSERT/UPDATE/DELETE
    ↓
update_business_rating()
    ↓
businesses.rating_average = AVG(rating)
businesses.total_reviews = COUNT(*)
    + reward_review_coins() (15 coins)
```

---

## 🔒 Seguridad RLS

### Patrones de Políticas

**Auto-Administración:**
```sql
-- El usuario solo puede ver/editar sus propios datos
FOR ALL USING (auth.uid() = user_id)
```

**Contenido Público:**
```sql
-- Cualquiera puede ver contenido activo
FOR SELECT USING (is_active = true)
```

**Propietarios de Negocio:**
```sql
-- Solo el dueño puede editar su negocio
FOR ALL USING (auth.uid() = owner_id)
```

**Contenido de Negocio:**
```sql
-- Solo el dueño puede editar videos de su negocio
FOR ALL USING (
  auth.uid() IN (
    SELECT owner_id FROM businesses 
    WHERE id = videos.business_id
  )
)
```

---

## 📊 Storage Buckets

### Estructura de Archivos

```
videos/
├── business_id/
│   ├── video_id.mp4
│   └── video_id.jpg (thumbnail)

avatars/
├── user_id.jpg

business-logos/
├── business_id.jpg

business-covers/
├── business_id.jpg

thumbnails/
├── video_id.jpg
```

### Políticas de Storage
- **Subida**: Solo usuarios autenticados
- **Lectura**: Público para todos los buckets
- **Eliminación**: Solo el propietario

---

## 🔄 Realtime Subscriptions

### Tablas con Realtime Habilitado:
- `messages` - Chat en tiempo real
- `conversations` - Estado de conversaciones
- `video_likes` - Likes instantáneos
- `user_follows` - Seguimientos en vivo
- `business_reviews` - Nuevas reseñas
- `plan_likes` - Likes en planes

### Uso en Frontend:
```javascript
// Suscribirse a mensajes de una conversación
supabase
  .channel('conversation:123')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => console.log(payload)
  )
  .subscribe()
```

---

## 📈 Funciones Helper

### calculate_distance()
Calcula distancia entre dos puntos GPS usando fórmula Haversine.

```sql
SELECT calculate_distance(4.4389, -75.2322, 4.4400, -75.2300) as km;
```

### reward_activity_coins()
Sistema unificado para otorgar coins por actividades.

```sql
SELECT reward_activity_coins(user_id, 'follow_business', 5, 'Seguir Café X');
```

### purchase_coupon()
Función atómica para comprar cupones con validaciones.

```sql
SELECT purchase_coupon(coupon_id, user_id);
-- Retorna: {"success": true, "code": "CPN1234", "new_balance": 95}
```

---

## 🎯 Optimizaciones de Performance

### Índices Críticos
- Geoespaciales para búsquedas por ubicación
- Compuestos para feed de videos (created_at + is_active)
- Tags para búsqueda de contenido
- Foreign keys para relaciones

### Paginación Recomendada
- Feed de videos: 20 items por página
- Mensajes de chat: 50 mensajes por carga
- Búsquedas: 15 resultados por página

### Caché Sugerido
- Categorías de negocios (estático)
- Configuración de coins (poco cambia)
- Lista de tags populares

---

## 🔧 Mantenimiento

### Limpieza Automática Recomendada
- Videos inactivos > 6 meses
- Conversaciones sin actividad > 1 año
- Cupones vencidos > 3 meses
- Transacciones de coins > 2 años

### Monitoreo Importante
- Crecimiento de tabla `messages`
- Uso de Storage buckets
- Performance de queries geoespaciales
- Balances negativos en wallets (no deberían existir)

---

Esta estructura proporciona una base sólida y escalable para el MVP Festech, con todas las funcionalidades requeridas implementadas de manera eficiente y segura.