// Tipos de usuario
export type UserType = 'client' | 'business';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  phone?: string;
  city?: string;
  avatar_url?: string;
  bio?: string;
  interests?: string[];
  date_of_birth?: string;
  created_at: string;
}

export type ProfileInsert = Omit<Profile, 'id' | 'created_at'>;
export type ProfileUpdate = Partial<ProfileInsert>;

// Tipos de negocio
export type PriceRange = '$' | '$$' | '$$$' | '$$$$';
export type BusinessCategory = 'gastronomia' | 'hospedaje' | 'aventura' | 'cultura' | 'compras' | 'vida_nocturna' | 'naturaleza';

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  category: BusinessCategory;
  description?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  full_address?: string;
  neighborhood?: string;
  logo_url?: string;
  cover_image_url?: string;
  whatsapp?: string;
  price_range?: PriceRange;
  schedule?: Record<string, any>;
  social_media?: Record<string, any>;
  services?: string[];
  rating_average: number;
  total_reviews: number;
  followers_count: number;
  is_active: boolean;
  created_at: string;
}

export type BusinessInsert = Omit<Business, 'id' | 'rating_average' | 'total_reviews' | 'followers_count' | 'is_active' | 'created_at'>;
export type BusinessUpdate = Partial<BusinessInsert>;

// Tipos de video
export interface Video {
  id: string;
  business_id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
  file_size?: number;
  location_lat?: number;
  location_lng?: number;
  location_name?: string;
  tags?: string[];
  views_count: number;
  likes_count: number;
  is_active: boolean;
  created_at: string;
}

export type VideoInsert = Omit<Video, 'id' | 'views_count' | 'likes_count' | 'is_active' | 'created_at'>;
export type VideoUpdate = Partial<VideoInsert>;

// Tipos de likes
export interface VideoLike {
  id: string;
  video_id: string;
  user_id: string;
  created_at: string;
}

export type VideoLikeInsert = Omit<VideoLike, 'id' | 'created_at'>;
export type VideoLikeUpdate = Partial<VideoLikeInsert>;

// Tipos de seguimiento
export interface UserFollow {
  id: string;
  follower_id: string;
  business_id: string;
  created_at: string;
}

export type UserFollowInsert = Omit<UserFollow, 'id' | 'created_at'>;
export type UserFollowUpdate = Partial<UserFollowInsert>;

// Tipos de conversación
export interface Conversation {
  id: string;
  client_id: string;
  business_id: string;
  last_message_at: string;
  created_at: string;
}

export type ConversationInsert = Omit<Conversation, 'id' | 'last_message_at' | 'created_at'>;
export type ConversationUpdate = Partial<ConversationInsert>;

// Tipos de mensajes
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export type MessageInsert = Omit<Message, 'id' | 'created_at'>;
export type MessageUpdate = Partial<MessageInsert>;

// Tipos de wallet
export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export type WalletInsert = Omit<Wallet, 'id' | 'created_at' | 'updated_at'>;
export type WalletUpdate = Partial<WalletInsert>;

// Tipos de transacciones de coins
export type TransactionType = 'earn' | 'spend';

export interface CoinTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  description?: string;
  created_at: string;
}

export type CoinTransactionInsert = Omit<CoinTransaction, 'id' | 'created_at'>;
export type CoinTransactionUpdate = Partial<CoinTransactionInsert>;

// Tipos de cupones
export type DiscountType = 'percentage' | 'fixed';

export interface Coupon {
  id: string;
  business_id: string;
  title: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;
  coin_price: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export type CouponInsert = Omit<Coupon, 'id' | 'current_uses' | 'is_active' | 'created_at'>;
export type CouponUpdate = Partial<CouponInsert>;

// Tipos de cupones de usuario
export type CouponStatus = 'active' | 'used' | 'expired';

export interface UserCoupon {
  id: string;
  coupon_id: string;
  user_id: string;
  code: string;
  status: CouponStatus;
  purchased_at: string;
  used_at?: string;
}

export type UserCouponInsert = Omit<UserCoupon, 'id' | 'code' | 'status' | 'purchased_at' | 'used_at'>;
export type UserCouponUpdate = Partial<UserCouponInsert>;

// Tipos de reseñas
export interface BusinessReview {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  visit_verified: boolean;
  business_response?: string;
  created_at: string;
  updated_at: string;
}

export type BusinessReviewInsert = Omit<BusinessReview, 'id' | 'business_response' | 'created_at' | 'updated_at'>;
export type BusinessReviewUpdate = Partial<BusinessReviewInsert>;

// Tipos de planes de usuario
export interface UserPlan {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  estimated_duration?: number;
  estimated_budget?: number;
  is_public: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export type UserPlanInsert = Omit<UserPlan, 'id' | 'likes_count' | 'created_at' | 'updated_at'>;
export type UserPlanUpdate = Partial<UserPlanInsert>;

// Tipos de items de planes
export interface PlanItem {
  id: string;
  plan_id: string;
  business_id: string;
  order_index: number;
  estimated_time?: number;
  estimated_start_time?: string;
  notes?: string;
  created_at: string;
}

export type PlanItemInsert = Omit<PlanItem, 'id' | 'created_at'>;
export type PlanItemUpdate = Partial<PlanItemInsert>;

// Tipos base de Supabase Database
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      businesses: {
        Row: Business;
        Insert: BusinessInsert;
        Update: BusinessUpdate;
      };
      videos: {
        Row: Video;
        Insert: VideoInsert;
        Update: VideoUpdate;
      };
      video_likes: {
        Row: VideoLike;
        Insert: VideoLikeInsert;
        Update: VideoLikeUpdate;
      };
      user_follows: {
        Row: UserFollow;
        Insert: UserFollowInsert;
        Update: UserFollowUpdate;
      };
      conversations: {
        Row: Conversation;
        Insert: ConversationInsert;
        Update: ConversationUpdate;
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: MessageUpdate;
      };
      wallets: {
        Row: Wallet;
        Insert: WalletInsert;
        Update: WalletUpdate;
      };
      coin_transactions: {
        Row: CoinTransaction;
        Insert: CoinTransactionInsert;
        Update: CoinTransactionUpdate;
      };
      coupons: {
        Row: Coupon;
        Insert: CouponInsert;
        Update: CouponUpdate;
      };
      user_coupons: {
        Row: UserCoupon;
        Insert: UserCouponInsert;
        Update: UserCouponUpdate;
      };
      business_reviews: {
        Row: BusinessReview;
        Insert: BusinessReviewInsert;
        Update: BusinessReviewUpdate;
      };
      user_plans: {
        Row: UserPlan;
        Insert: UserPlanInsert;
        Update: UserPlanUpdate;
      };
      plan_items: {
        Row: PlanItem;
        Insert: PlanItemInsert;
        Update: PlanItemUpdate;
      };
    };
  };
}