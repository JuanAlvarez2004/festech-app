# 🌿 Festech -## 🔄 Actualizaciones Recientes

### v1.1.1 - Corrección de Props Deprecadas
- ✅ **Removida prop deprecada**: `allowsFullscreen` reemplazada por configuración moderna
- ✅ **Sin warnings**: Aplicación limpia sin advertencias de deprecación
- ✅ **API actualizada**: Uso correcto de `expo-video` props

### v1.1.0 - Migración a Expo Video
- ✅ **Migrado de expo-av a expo-video**: La aplicación ahora usa las nuevas APIs recomendadas
- ✅ **Mejor rendimiento de video**: Reproducción más eficiente y estable
- ✅ **API moderna**: Uso de `useVideoPlayer` hook para mejor control
- ✅ **Compatibilidad futura**: Preparado para Expo SDK 54+re los Mejores Negocios del Tolima

Una aplicación móvil estilo TikTok para descubrir negocios locales en el Tolima, Colombia. Con videos auténticos, gamificación con sistema de coins, chat en tiempo real y experiencias únicas conectando usuarios con emprendedores locales.

## 🎯 Características Principales

- **📱 Feed Estilo TikTok**: Videos verticales con scroll infinito
- **🏢 Descubrimiento de Negocios**: Encuentra restaurantes, hospedajes, aventuras y más
- **🪙 Sistema de Coins**: Gana coins por interacciones y canjéalos por cupones
- **💬 Chat en Tiempo Real**: Comunícate directamente con los negocios
- **⭐ Sistema de Reseñas**: Califica y comenta sobre tus experiencias
- **📍 Geolocalización**: Encuentra negocios cercanos a tu ubicación
- **🎨 Diseño Moderno**: Interfaz amigable inspirada en la naturaleza del Tolima

## � Actualizaciones Recientes

### v1.1.0 - Migración a Expo Video
- ✅ **Migrado de expo-av a expo-video**: La aplicación ahora usa las nuevas APIs recomendadas
- ✅ **Mejor rendimiento de video**: Reproducción más eficiente y estable
- ✅ **API moderna**: Uso de `useVideoPlayer` hook para mejor control
- ✅ **Compatibilidad futura**: Preparado para Expo SDK 54+

## �🚀 Tecnologías Utilizadas

### Frontend
- **React Native** con Expo SDK
- **TypeScript** para type safety
- **Expo Router** para navegación
- **React Navigation** para navegación avanzada
- **Expo Video** para reproducción de videos (nueva API)
- **Expo Audio** para funcionalidades de audio
- **Expo Image** para optimización de imágenes
- **React Native Reanimated** para animaciones

### Backend
- **Supabase** como Backend-as-a-Service
- **PostgreSQL** como base de datos
- **Row Level Security (RLS)** para seguridad
- **Realtime** para chat en vivo
- **Storage** para videos e imágenes

### Herramientas de Desarrollo
- **ESLint** para linting
- **Prettier** para formateo de código
- **TypeScript** para tipado estático

## 🎨 Paleta de Colores

Inspirada en la naturaleza del Tolima:

- **🌿 Verde montaña profundo**: `#2A9D8F` (Primario)
- **⚫ Gris volcán oscuro**: `#264653` (Secundario)  
- **☀️ Beige cálido**: `#E9C46A` (Acento)

## 📁 Estructura del Proyecto

```
festech-app/
├── app/                    # Pantallas con Expo Router
│   ├── (tabs)/            # Navegación de tabs
│   │   ├── index.tsx      # Feed principal
│   │   ├── explore.tsx    # Explorar negocios
│   │   ├── create.tsx     # Crear contenido
│   │   ├── inbox.tsx      # Mensajes
│   │   └── profile.tsx    # Perfil de usuario
│   └── _layout.tsx        # Layout principal
├── components/             # Componentes reutilizables
│   ├── ui/                # Componentes base
│   │   ├── Button.tsx     # Botón personalizado
│   │   ├── Input.tsx      # Input con validación
│   │   ├── VideoCard.tsx  # Tarjeta de video TikTok-style
│   │   ├── Card.tsx       # Tarjeta genérica
│   │   └── Loading.tsx    # Componente de carga
│   └── ...
├── constants/              # Constantes globales
│   ├── theme.ts           # Paleta de colores
│   └── Design.ts          # Tipografía y espaciado
├── contexts/               # Contextos de React
│   └── AuthContext.tsx    # Gestión de autenticación
├── hooks/                  # Custom hooks
├── lib/                    # Librerías y configuraciones
│   └── supabase.ts        # Cliente de Supabase
├── types/                  # Tipos de TypeScript
│   ├── database.ts        # Tipos de base de datos
│   ├── app.ts             # Tipos de aplicación
│   └── index.ts           # Exportaciones
└── screens/                # Pantallas adicionales
    └── auth/              # Pantallas de autenticación
```

## 🛠️ Configuración del Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/festech-app.git
cd festech-app
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Ejecutar la Aplicación

```bash
# Desarrollo
npm start

# iOS
npm run ios

# Android
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

## 🎮 Sistema de Gamificación

El sistema de coins incentiva la participación:

### Ganar Coins
- **+50 coins**: Registro inicial
- **+5 coins**: Seguir un negocio
- **+15 coins**: Dejar una reseña
- **+5 coins**: Iniciar chat con negocio
- **+10 coins**: Crear un plan personalizado
- **+5 coins**: Recibir like en plan creado

### Gastar Coins
- **Cupones**: Descuentos en negocios locales
- **Promociones**: Acceso a ofertas especiales

## 📊 Base de Datos

La aplicación utiliza una base de datos PostgreSQL en Supabase con las siguientes tablas principales:

- **profiles**: Perfiles de usuarios y empresarios
- **businesses**: Negocios registrados
- **videos**: Videos de contenido
- **video_likes**: Sistema de likes
- **conversations**: Conversaciones de chat
- **messages**: Mensajes individuales
- **wallets**: Billeteras de coins
- **coupons**: Cupones disponibles

Ver documentación completa en `documentacion-api.md` y `estructura-base-datos.md`.

## 🔒 Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- **JWT Authentication** con Supabase
- **Políticas de acceso** basadas en roles de usuario
- **Validación de datos** en frontend y backend

## 📱 Compatibilidad

- **iOS**: 13.0+
- **Android**: API level 21+ (Android 5.0+)
- **Web**: Navegadores modernos

## 🚀 Próximos Pasos

1. **Implementar autenticación completa**
   - Pantallas de login/registro
   - Recuperación de contraseña
   - Validación de email

2. **Conectar con Supabase**
   - APIs de videos
   - Sistema de chat
   - Notificaciones push

3. **Funcionalidades avanzadas**
   - Geolocalización
   - Filtros de búsqueda
   - Analytics de videos

4. **Testing y optimización**
   - Tests unitarios
   - Tests de integración
   - Optimización de performance

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Proyecto**: Festech
- **Email**: contacto@festech.app
- **Website**: https://festech.app

---

**Hecho con ❤️ para el Tolima, Colombia 🇨🇴**