# 🚀 Documentación API - Festech MVP

## 📋 Información General

**Base URL:** `https://tu-proyecto.supabase.co`  
**Tipo:** REST API + GraphQL + Realtime  
**Autenticación:** JWT Tokens (Supabase Auth)  
**Formato:** JSON  
**Versión:** 1.0.0  

---

## 🔐 Autenticación

### Sistema de Auth
Festech utiliza el sistema de autenticación de Supabase con JWT tokens.

### Headers Requeridos
```http
Authorization: Bearer {jwt_token}
apikey: {supabase_anon_key}
Content-Type: application/json
```

### Flujo de Autenticación

#### 1. Registro de Usuario
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "data": {
    "full_name": "Juan Pérez",
    "user_type": "client"
  }
}
```

**Respuesta:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "user_metadata": {
      "full_name": "Juan Pérez",
      "user_type": "client"
    }
  }
}
```

**Flujo Automático:** Al registrarse, se ejecutan automáticamente:
1. Inserción en `profiles`
2. Creación de `wallet` con 50 coins
3. Registro de transacción de bienvenida

#### 2. Login
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

#### 3. Refresh Token
```http
POST /auth/v1/token?grant_type=refresh_token
Content-Type: application/json

{
  "refresh_token": "..."
}
```

---

## 👤 Gestión de Perfiles

### Obtener Perfil Actual
```http
GET /rest/v1/profiles?id=eq.{user_id}&select=*
Authorization: Bearer {jwt_token}
```

**Respuesta:**
```json
{
  "id": "uuid",
  "email": "usuario@ejemplo.com",
  "full_name": "Juan Pérez",
  "user_type": "client",
  "phone": "+57 300 123 4567",
  "city": "Ibagué",
  "avatar_url": "https://...",
  "bio": "Amante de la aventura",
  "interests": ["gastronomia", "aventura"],
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Actualizar Perfil
```http
PATCH /rest/v1/profiles?id=eq.{user_id}
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "full_name": "Juan Pérez García",
  "bio": "Nueva biografía",
  "interests": ["gastronomia", "aventura", "cultura"]
}
```

---

## 🏢 API de Negocios

### Listar Negocios
```http
GET /rest/v1/businesses?select=*,owner:profiles(full_name,avatar_url)&is_active=eq.true&order=created_at.desc
```

**Parámetros de Query:**
- `category=eq.gastronomia` - Filtrar por categoría
- `rating_average=gte.4.0` - Filtrar por calificación mínima
- `limit=20` - Limitar resultados
- `offset=0` - Paginación

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "name": "Café Central Ibagué",
    "category": "gastronomia",
    "description": "El mejor café...",
    "phone": "+57 8 261 5555",
    "address": "Carrera 3 #12-45",
    "latitude": 4.4389,
    "longitude": -75.2322,
    "logo_url": "https://...",
    "rating_average": 4.5,
    "total_reviews": 23,
    "followers_count": 156,
    "price_range": "$$",
    "schedule": {
      "lunes": {"open": "06:00", "close": "20:00"}
    },
    "services": ["café de especialidad", "wifi gratis"],
    "owner": {
      "full_name": "María García",
      "avatar_url": "https://..."
    }
  }
]
```

### Búsqueda por Ubicación
```http
POST /rest/v1/rpc/search_businesses_by_location
Content-Type: application/json

{
  "user_lat": 4.4389,
  "user_lng": -75.2322,
  "radius_km": 5,
  "category_filter": "gastronomia",
  "limit_results": 20
}
```

### Crear Negocio
```http
POST /rest/v1/businesses
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "name": "Mi Restaurante",
  "category": "gastronomia",
  "description": "Descripción del negocio",
  "phone": "+57 300 123 4567",
  "address": "Dirección completa",
  "latitude": 4.4389,
  "longitude": -75.2322,
  "whatsapp": "+57 300 123 4567",
  "price_range": "$$",
  "schedule": {
    "lunes": {"open": "06:00", "close": "20:00"},
    "martes": {"open": "06:00", "close": "20:00"}
  },
  "services": ["servicio1", "servicio2"]
}
```

---

## 🎬 API de Videos

### Feed Principal (TikTok Style) 
```http
GET /rest/v1/videos?select=*,business:businesses(name,logo_url,category),coupon:coupons(id,title,discount_type,discount_value,coin_price,expires_at),likes:video_likes(count)&is_active=eq.true&order=has_active_coupon.desc,created_at.desc&limit=20
```

**Parámetros adicionales:**
- `has_active_coupon=eq.true` - Solo videos con cupones activos
- `coupon_id=not.is.null` - Videos que tienen cupón asociado

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "title": "El mejor café de Ibagué ☕",
    "description": "Ven y disfruta...",
    "video_url": "https://storage.supabase.co/...",
    "thumbnail_url": "https://storage.supabase.co/...",
    "duration": 25,
    "tags": ["cafe", "ibague", "especialidad"],
    "coupon_id": "uuid", // 🆕 ID del cupón asociado
    "has_active_coupon": true, // 🆕 Indica si tiene cupón activo
    "location_lat": 4.4389,
    "location_lng": -75.2322,
    "location_name": "Café Central Ibagué",
    "views_count": 1250,
    "likes_count": 89,
    "created_at": "2024-01-15T10:30:00Z",
    "business": {
      "name": "Café Central Ibagué",
      "logo_url": "https://...",
      "category": "gastronomia"
    },
    "coupon": { // 🆕 Información del cupón
      "id": "uuid",
      "title": "20% OFF en Café",
      "discount_type": "percentage",
      "discount_value": 20.00,
      "coin_price": 50,
      "expires_at": "2024-02-15T23:59:59Z"
    }
  }
]
```

### Subir Video
```http
POST /rest/v1/videos
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "business_id": "uuid",
  "title": "Título del video",
  "description": "Descripción con #hashtags",
  "video_url": "https://storage.supabase.co/...",
  "thumbnail_url": "https://storage.supabase.co/...",
  "duration": 30,
  "tags": ["tag1", "tag2", "tag3"],
  "location_lat": 4.4389,
  "location_lng": -75.2322,
  "location_name": "Nombre del lugar",
  "coupon_id": "uuid" // 🆕 OPCIONAL: Cupón asociado al video
}
```

### Filtrar Videos con Cupones Activos 🆕
```http
GET /rest/v1/videos?select=*,business:businesses(name,logo_url),coupon:coupons(*)&has_active_coupon=eq.true&order=created_at.desc&limit=20
```

### Asociar/Desasociar Cupón a Video 🆕
```http
PATCH /rest/v1/videos?id=eq.{video_id}
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "coupon_id": "uuid" // o null para desasociar
}
```

**Validación:** Solo el propietario del negocio puede asociar sus propios cupones a sus videos.

### Incrementar Views
```http
POST /rest/v1/rpc/increment_video_views
Content-Type: application/json

{
  "video_id": "uuid"
}
```

### Filtrar Videos por Categoría y Cupones 🆕
```http
GET /rest/v1/videos?select=*,business:businesses(name,category),coupon:coupons(*)&business.category=eq.gastronomia&has_active_coupon=eq.true&order=likes_count.desc&limit=15
```

### Feed Optimizado con Priorización de Cupones 🆕
```http
GET /rest/v1/rpc/get_prioritized_feed
Content-Type: application/json

{
  "user_lat": 4.4389,
  "user_lng": -75.2322,
  "radius_km": 10,
  "user_interests": ["gastronomia", "aventura"],
  "followed_businesses": ["uuid1", "uuid2"],
  "limit_results": 20
}
```

**Algoritmo del Feed:**
1. **Videos con cupones activos** (prioridad máxima) 🆕
2. Videos de negocios seguidos
3. Videos locales (por geolocalización)
4. Videos por intereses del usuario
5. Videos con mayor engagement
6. Videos más recientes

---

## ❤️ API de Interacciones

### Like/Unlike Video
```http
POST /rest/v1/video_likes
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "video_id": "uuid",
  "user_id": "uuid"
}
```

**Para Unlike:**
```http
DELETE /rest/v1/video_likes?video_id=eq.{uuid}&user_id=eq.{uuid}
Authorization: Bearer {jwt_token}
```

**Resultado Automático:** Se actualiza `videos.likes_count` por trigger

### Seguir/Dejar de Seguir Negocio
```http
POST /rest/v1/user_follows
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "follower_id": "uuid",
  "business_id": "uuid"
}
```

**Resultado Automático:** 
- Se actualiza `businesses.followers_count`
- Se otorgan 5 coins al usuario

### Videos Favoritos

#### Agregar a Favoritos
```http
POST /rest/v1/user_favorites
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "user_id": "uuid",
  "video_id": "uuid",
  "folder_name": "Mis Restaurantes"
}
```

#### Listar Favoritos por Carpeta
```http
GET /rest/v1/user_favorites?select=*,video:videos(*)&user_id=eq.{uuid}&folder_name=eq.General
```

---

## ⭐ API de Calificaciones

### Dejar Reseña
```http
POST /rest/v1/business_reviews
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "business_id": "uuid",
  "user_id": "uuid",
  "rating": 5,
  "comment": "Excelente servicio y comida deliciosa...",
  "visit_verified": true
}
```

**Resultado Automático:**
- Se actualiza `businesses.rating_average` y `total_reviews`
- Se otorgan 15 coins al usuario

### Listar Reseñas de un Negocio
```http
GET /rest/v1/business_reviews?select=*,user:profiles(full_name,avatar_url)&business_id=eq.{uuid}&order=created_at.desc
```

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "rating": 5,
    "comment": "Excelente servicio...",
    "visit_verified": true,
    "business_response": "Gracias por tu reseña",
    "created_at": "2024-01-15T10:30:00Z",
    "user": {
      "full_name": "Juan Pérez",
      "avatar_url": "https://..."
    }
  }
]
```

---

## 💬 API de Chat en Tiempo Real

### Crear/Obtener Conversación 
```http
POST /rest/v1/conversations
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "client_id": "uuid",
  "business_id": "uuid",
  "video_id": "uuid", // 🆕 OPCIONAL: Video desde el cual se inicia el chat
  "coupon_context_id": "uuid" // 🆕 OPCIONAL: Cupón de contexto (se obtiene automáticamente del video)
}
```

**Resultado Automático:** 
- Se otorgan 5 coins por iniciar chat (primera vez por negocio)
- Si el video tiene cupón, se guarda el contexto automáticamente

### Listar Conversaciones
```http
GET /rest/v1/conversations?select=*,client:profiles!client_id(full_name,avatar_url),business:businesses(name,logo_url),video:videos(title,thumbnail_url),coupon_context:coupons(title,discount_type,discount_value)&or=(client_id.eq.{user_id},business_id.in.(select_business_ids))&order=last_message_at.desc
```

**Respuesta con contexto de cupón:**
```json
[
  {
    "id": "uuid",
    "last_message_at": "2024-01-20T15:45:00Z",
    "client": {
      "full_name": "Juan Pérez",
      "avatar_url": "https://..."
    },
    "business": {
      "name": "Café Central Ibagué",
      "logo_url": "https://..."
    },
    "video": { // 🆕 Video de origen del chat
      "title": "El mejor café de Ibagué ☕",
      "thumbnail_url": "https://..."
    },
    "coupon_context": { // 🆕 Cupón asociado al video
      "title": "20% OFF en Café",
      "discount_type": "percentage",
      "discount_value": 20.00
    }
  }
]
```

### Enviar Mensaje
```http
POST /rest/v1/messages
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "conversation_id": "uuid",
  "sender_id": "uuid",
  "content": "Hola, ¿tienen disponibilidad para mañana?"
}
```

**Resultado Automático:** Se actualiza `conversations.last_message_at`

### Suscripción Realtime para Chat
```javascript
const channel = supabase
  .channel('conversation:' + conversationId)
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      console.log('Nuevo mensaje:', payload.new)
    }
  )
  .subscribe()
```

### Listar Mensajes de Conversación
```http
GET /rest/v1/messages?select=*,sender:profiles(full_name,avatar_url)&conversation_id=eq.{uuid}&order=created_at.asc&limit=50
```

---

## 🪙 API del Sistema de Coins

### Obtener Wallet
```http
GET /rest/v1/wallets?select=*&user_id=eq.{uuid}
```

**Respuesta:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "balance": 125,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T15:45:00Z"
}
```

### Historial de Transacciones
```http
GET /rest/v1/coin_transactions?select=*&user_id=eq.{uuid}&order=created_at.desc&limit=50
```

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "amount": 15,
    "type": "earn",
    "description": "Reseña en Café Central Ibagué",
    "created_at": "2024-01-20T15:45:00Z"
  },
  {
    "id": "uuid",
    "amount": 50,
    "type": "spend",
    "description": "Compra de cupón: 20% OFF en Café",
    "created_at": "2024-01-19T12:30:00Z"
  }
]
```

### Otorgar Coins (Función Helper)
```http
POST /rest/v1/rpc/reward_activity_coins
Content-Type: application/json

{
  "user_uuid": "uuid",
  "activity_type": "follow_business",
  "coins_amount": 5,
  "description_text": "Seguir a Café Central"
}
```

---

## 🎁 API de Cupones

### Listar Cupones Disponibles
```http
GET /rest/v1/coupons?select=*,business:businesses(name,logo_url,category)&is_active=eq.true&expires_at=gte.now()&order=created_at.desc
```

**Filtros disponibles:**
- `business_id=eq.{uuid}` - Cupones de un negocio específico
- `coin_price=lte.100` - Cupones hasta 100 coins
- `discount_type=eq.percentage` - Solo descuentos porcentuales

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "title": "20% OFF en Café de Especialidad",
    "description": "Descuento del 20% en cualquier bebida...",
    "discount_type": "percentage",
    "discount_value": 20.00,
    "coin_price": 50,
    "max_uses": 100,
    "current_uses": 23,
    "expires_at": "2024-02-15T23:59:59Z",
    "business": {
      "name": "Café Central Ibagué",
      "logo_url": "https://...",
      "category": "gastronomia"
    }
  }
]
```

### Comprar Cupón
```http
POST /rest/v1/rpc/purchase_coupon
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "coupon_uuid": "uuid",
  "user_uuid": "uuid"
}
```

**Respuesta:**
```json
{
  "success": true,
  "code": "CPN1234",
  "new_balance": 95,
  "message": "Cupón comprado exitosamente"
}
```

**Resultado Automático:**
- Se descuentan coins del wallet
- Se registra transacción de spend
- Se genera código único
- Se incrementa `coupons.current_uses`

### Listar Cupones del Usuario
```http
GET /rest/v1/user_coupons?select=*,coupon:coupons(*,business:businesses(name,logo_url))&user_id=eq.{uuid}&status=eq.active&order=purchased_at.desc
```

### Validar/Usar Cupón (Para negocios)
```http
PATCH /rest/v1/user_coupons?code=eq.{code}&status=eq.active
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "status": "used",
  "used_at": "2024-01-20T15:45:00Z"
}
```

---

## 📋 API de Planes Personalizados

### Crear Plan
```http
POST /rest/v1/user_plans
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "creator_id": "uuid",
  "title": "Día Perfecto en Ibagué",
  "description": "Un día completo disfrutando...",
  "estimated_duration": 480,
  "estimated_budget": 150000.00,
  "is_public": true
}
```

**Resultado Automático:** Se otorgan 10 coins por crear plan

### Agregar Items al Plan
```http
POST /rest/v1/plan_items
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "plan_id": "uuid",
  "business_id": "uuid",
  "order_index": 1,
  "estimated_time": 90,
  "estimated_start_time": "08:00",
  "notes": "Desayuno para empezar el día"
}
```

### Listar Planes Públicos
```http
GET /rest/v1/user_plans?select=*,creator:profiles(full_name,avatar_url),items:plan_items(*,business:businesses(name,logo_url,category))&is_public=eq.true&order=likes_count.desc,created_at.desc&limit=20
```

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "title": "Día Perfecto en Ibagué",
    "description": "Un día completo...",
    "estimated_duration": 480,
    "estimated_budget": 150000.00,
    "likes_count": 23,
    "created_at": "2024-01-15T10:30:00Z",
    "creator": {
      "full_name": "Juan Pérez",
      "avatar_url": "https://..."
    },
    "items": [
      {
        "order_index": 1,
        "estimated_time": 90,
        "estimated_start_time": "08:00",
        "notes": "Desayuno para empezar el día",
        "business": {
          "name": "Café Central Ibagué",
          "logo_url": "https://...",
          "category": "gastronomia"
        }
      }
    ]
  }
]
```

### Like/Unlike Plan
```http
POST /rest/v1/plan_likes
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "plan_id": "uuid",
  "user_id": "uuid"
}
```

**Resultado Automático:**
- Se actualiza `user_plans.likes_count`
- Se otorgan 5 coins al creador del plan

---

## 🔍 API de Búsqueda y Filtros

### Búsqueda Global
```http
POST /rest/v1/rpc/global_search
Content-Type: application/json

{
  "search_term": "café",
  "search_type": "all", // "businesses", "videos", "plans"
  "user_lat": 4.4389,
  "user_lng": -75.2322,
  "radius_km": 10,
  "limit_results": 20
}
```

### Filtros Avanzados para Videos
```http
GET /rest/v1/videos?select=*,business:businesses(name,category)&and=(is_active.eq.true,tags.cs.{aventura,extremo})&business.category=eq.aventura&order=likes_count.desc&limit=20
```

### Buscar por Categoría y Ubicación
```http
POST /rest/v1/rpc/search_by_category_location
Content-Type: application/json

{
  "category": "gastronomia",
  "user_lat": 4.4389,
  "user_lng": -75.2322,
  "radius_km": 5,
  "min_rating": 4.0,
  "price_range": ["$", "$$"],
  "limit_results": 15
}
```

---

## 📱 API de Storage

### Subir Archivo
```http
POST /storage/v1/object/{bucket_name}/{file_path}
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

{file_data}
```

**Buckets Disponibles:**
- `videos` - Archivos de video (.mp4)
- `thumbnails` - Miniaturas de videos (.jpg)
- `avatars` - Fotos de perfil (.jpg, .png)
- `business-logos` - Logos de negocios (.jpg, .png)
- `business-covers` - Portadas de negocios (.jpg, .png)

**Ejemplo de Subida de Video:**
```http
POST /storage/v1/object/videos/business_123/video_456.mp4
Authorization: Bearer {jwt_token}
Content-Type: video/mp4
```

### Obtener URL Pública
```http
GET /storage/v1/object/public/{bucket_name}/{file_path}
```

### Eliminar Archivo
```http
DELETE /storage/v1/object/{bucket_name}/{file_path}
Authorization: Bearer {jwt_token}
```

---

## 📊 API de Analytics y Métricas

### Métricas de Negocio
```http
GET /rest/v1/rpc/get_business_analytics
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "business_id": "uuid",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

**Respuesta:**
```json
{
  "total_views": 1250,
  "total_likes": 89,
  "new_followers": 15,
  "conversations_started": 8,
  "average_rating": 4.5,
  "total_reviews": 23,
  "videos_uploaded": 5
}
```

### Métricas de Usuario
```http
GET /rest/v1/rpc/get_user_analytics
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "user_id": "uuid"
}
```

---

## 🚨 Manejo de Errores

### Códigos de Estado HTTP

**200 OK** - Operación exitosa  
**201 Created** - Recurso creado  
**400 Bad Request** - Datos inválidos  
**401 Unauthorized** - Token inválido o expirado  
**403 Forbidden** - Sin permisos  
**404 Not Found** - Recurso no encontrado  
**409 Conflict** - Conflicto (ej: like duplicado)  
**422 Unprocessable Entity** - Error de validación  
**500 Internal Server Error** - Error del servidor  

### Estructura de Errores
```json
{
  "error": {
    "message": "Descripción del error",
    "details": "Detalles técnicos adicionales",
    "hint": "Sugerencia para resolver",
    "code": "ERROR_CODE"
  }
}
```

### Errores Comunes

#### Coins Insuficientes
```json
{
  "error": {
    "message": "Coins insuficientes",
    "details": "Balance actual: 25, requerido: 50",
    "hint": "Realiza más actividades para ganar coins",
    "code": "INSUFFICIENT_COINS"
  }
}
```

#### Cupón No Disponible
```json
{
  "error": {
    "message": "Cupón no disponible",
    "details": "El cupón ha alcanzado el límite de usos",
    "hint": "Busca otros cupones disponibles",
    "code": "COUPON_UNAVAILABLE"
  }
}
```

---

## 🔧 Rate Limiting

### Límites por Endpoint

**Auth endpoints:** 60 requests/hour  
**Upload videos:** 10 uploads/hour  
**Send messages:** 100 messages/hour  
**General API:** 1000 requests/hour  

### Headers de Rate Limit
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 856
X-RateLimit-Reset: 1642694400
```

---

## 🎯 Webhooks (Futuro)

### Eventos Disponibles
- `user.created` - Usuario registrado
- `business.created` - Negocio creado  
- `video.uploaded` - Video subido
- `coupon.purchased` - Cupón comprado
- `review.created` - Reseña creada

### Configuración de Webhook
```http
POST /rest/v1/webhooks
Content-Type: application/json
Authorization: Bearer {service_role_key}

{
  "url": "https://tu-servidor.com/webhook",
  "events": ["coupon.purchased", "review.created"],
  "secret": "webhook_secret_key"
}
```

---

## 📱 SDK y Librerías Recomendadas

### React Native
```bash
npm install @supabase/supabase-js
npm install react-native-async-storage
```

### Configuración Básica
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tu-proyecto.supabase.co'
const supabaseAnonKey = 'tu-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Ejemplo de Uso
```javascript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@ejemplo.com',
  password: 'password123'
})

// Obtener videos
const { data: videos } = await supabase
  .from('videos')
  .select(`
    *,
    business:businesses(name, logo_url, category)
  `)
  .eq('is_active', true)
  .order('created_at', { ascending: false })
  .limit(20)

// Chat en tiempo real
supabase
  .channel('conversation:123')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => setMessages(prev => [...prev, payload.new])
  )
  .subscribe()
```

---

## 🧪 Testing

### Datos de Prueba
Usa los datos de prueba proporcionados en `datos-prueba-supabase.md`

### Tokens de Testing
```bash
# Token de cliente
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Token de negocio  
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Endpoints de Testing
```http
GET /rest/v1/health
GET /rest/v1/ready
```

---

## 📈 Monitoreo y Logs

### Métricas Importantes
- Tiempo de respuesta de API
- Tasa de errores por endpoint
- Uso de Storage por bucket
- Conexiones activas de Realtime
- Balance total de coins en el sistema

### Logs de Supabase
Disponibles en Dashboard > Logs:
- API requests
- Database queries
- Auth events
- Storage uploads
- Realtime connections

---

Esta documentación proporciona una guía completa para interactuar con la API de Festech MVP, cubriendo todos los endpoints, flujos de datos y mejores prácticas para el desarrollo del frontend.