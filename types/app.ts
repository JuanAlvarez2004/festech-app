import {
    Business,
    BusinessCategory,
    BusinessReview,
    Conversation,
    Coupon,
    Message,
    PlanItem,
    PriceRange,
    Profile,
    UserCoupon,
    UserPlan,
    UserType,
    Video
} from './database';

// Tipos para la navegación
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  VideoDetail: { videoId: string };
  BusinessDetail: { businessId: string };
  Profile: { userId?: string };
  Chat: { conversationId: string };
  CreateVideo: undefined;
  EditProfile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Create: undefined;
  Inbox: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Tipos para componentes
export interface VideoWithBusiness extends Video {
  business: Business;
  liked?: boolean;
  likesCount?: number;
}

export interface BusinessWithOwner extends Business {
  owner: Profile;
  followed?: boolean;
}

export interface ConversationWithDetails extends Conversation {
  client: Profile;
  business: Business;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface MessageWithSender extends Message {
  sender: Profile;
}

export interface ReviewWithUser extends BusinessReview {
  user: Profile;
}

export interface CouponWithBusiness extends Coupon {
  business: Business;
}

export interface UserCouponWithDetails extends UserCoupon {
  coupon: CouponWithBusiness;
}

export interface PlanWithDetails extends UserPlan {
  creator: Profile;
  items: PlanItemWithBusiness[];
  liked?: boolean;
}

export interface PlanItemWithBusiness extends PlanItem {
  business: Business;
}

// Tipos para el estado de la aplicación
export interface AuthState {
  user: Profile | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

// Tipos para formularios
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  userType: UserType;
  phone?: string;
  interests?: BusinessCategory[];
}

export interface CreateVideoForm {
  title: string;
  description: string;
  tags: string[];
  locationName?: string;
}

export interface CreateBusinessForm {
  name: string;
  category: BusinessCategory;
  description: string;
  phone: string;
  address: string;
  whatsapp?: string;
  priceRange: PriceRange;
  services: string[];
}

// Tipos para APIs
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  page: number;
  total?: number;
}

export interface SearchFilters {
  category?: BusinessCategory;
  priceRange?: PriceRange[];
  rating?: number;
  distance?: number;
  tags?: string[];
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

// Tipos para notificaciones
export type NotificationType = 'like' | 'follow' | 'comment' | 'message' | 'coupon' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

// Tipos para analytics
export interface VideoAnalytics {
  views: number;
  likes: number;
  shares: number;
  watchTime: number;
  engagement: number;
}

export interface BusinessAnalytics {
  totalViews: number;
  totalLikes: number;
  newFollowers: number;
  conversationsStarted: number;
  averageRating: number;
  totalReviews: number;
}

// Tipos para configuración
export interface AppConfig {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
}