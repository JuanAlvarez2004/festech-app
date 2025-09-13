# Supabase Infrastructure Documentation

## Database Schema Overview

This project uses Supabase with a PostgreSQL database. The schema is designed around a multi-sided marketplace connecting users, businesses, content (videos), and a coin-based reward system.

### Core Entity Relationships
```
auth.users (Supabase Auth)
    ↓ (1:1)
profiles (User Profile Data)
    ↓ (1:1)
wallets (Coin Balances)
    ↓ (1:many)
coin_transactions (Transaction History)

profiles → businesses (User can own business)
businesses → videos (Business creates content)
videos → coupons (Videos can have promotional offers)
```

## Detailed Table Documentation

### **1. Authentication & User Management**

#### `profiles` - User Profile Information
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, FK to auth.users(id) | User identifier from Supabase Auth |
| `email` | VARCHAR | NOT NULL | User's email address |
| `full_name` | VARCHAR | NOT NULL | User's display name |
| `user_type` | VARCHAR | NOT NULL, CHECK ('client', 'business') | User role in the platform |
| `phone` | VARCHAR | NULLABLE | Contact phone number |
| `city` | VARCHAR | DEFAULT 'Ibagué' | User's city location |
| `avatar_url` | TEXT | NULLABLE | Profile picture URL |
| `bio` | TEXT | NULLABLE | User biography/description |
| `interests` | TEXT[] | DEFAULT '{}' | Array of user interests/categories |
| `date_of_birth` | DATE | NULLABLE | User's birth date |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |

**Business Logic:**
- Central user entity linking to all other user-related tables
- `user_type` determines access to business features vs client features
- `interests` array used for content recommendation algorithms
- Foreign key to Supabase's `auth.users` ensures authentication integration

#### `wallets` - User Coin Balances
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Wallet identifier |
| `user_id` | UUID | UNIQUE, FK to profiles(id) | Owner of the wallet |
| `balance` | INTEGER | DEFAULT 50 | Current coin balance |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Wallet creation date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last balance update |

**Business Logic:**
- One wallet per user (UNIQUE constraint on user_id)
- New users start with 50 coins welcome bonus
- Balance updated via triggers when transactions occur
- All monetary values in integer coins (no decimal currencies)

#### `coin_transactions` - Transaction History
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Transaction identifier |
| `user_id` | UUID | FK to profiles(id) | User involved in transaction |
| `amount` | INTEGER | NOT NULL | Coin amount (positive number) |
| `type` | VARCHAR | CHECK ('earn', 'spend') | Transaction direction |
| `description` | TEXT | NULLABLE | Human-readable transaction reason |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Transaction timestamp |

**Business Logic:**
- Immutable transaction log for auditing and user history
- `amount` always positive, `type` indicates direction
- `description` used for duplicate prevention in reward system
- Linked to wallet via triggers for balance updates

### **2. Business & Location Entities**

#### `business_categories` - Business Classification
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | VARCHAR | PRIMARY KEY | Category identifier |
| `name` | VARCHAR | NOT NULL | Display name for category |
| `icon` | VARCHAR | NOT NULL | Icon identifier for UI |
| `description` | TEXT | NULLABLE | Category description |

**Business Logic:**
- Master data for business categorization
- Used for filtering and search functionality
- Icon field for consistent UI representation

#### `businesses` - Business Profiles
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Business identifier |
| `owner_id` | UUID | FK to profiles(id) | Business owner/manager |
| `name` | VARCHAR | NOT NULL | Business name |
| `category` | VARCHAR | FK to business_categories(id) | Business type |
| `description` | TEXT | NULLABLE | Business description |
| `phone` | VARCHAR | NULLABLE | Contact phone |
| `address` | TEXT | NULLABLE | Street address |
| `full_address` | TEXT | NULLABLE | Complete formatted address |
| `neighborhood` | VARCHAR | NULLABLE | Area/district name |
| `latitude` | NUMERIC | NULLABLE | GPS latitude coordinate |
| `longitude` | NUMERIC | NULLABLE | GPS longitude coordinate |
| `logo_url` | TEXT | NULLABLE | Business logo image |
| `cover_image_url` | TEXT | NULLABLE | Cover/banner image |
| `whatsapp` | VARCHAR | NULLABLE | WhatsApp contact number |
| `schedule` | JSONB | DEFAULT '{}' | Operating hours structure |
| `social_media` | JSONB | DEFAULT '{}' | Social media links |
| `services` | TEXT[] | DEFAULT '{}' | Array of services offered |
| `price_range` | VARCHAR | CHECK ('$', '$$', '$$$', '$$$$') | Price category indicator |
| `is_active` | BOOLEAN | DEFAULT TRUE | Business visibility status |
| `rating_average` | NUMERIC | DEFAULT 0 | Calculated average rating |
| `total_reviews` | INTEGER | DEFAULT 0 | Count of reviews received |
| `followers_count` | INTEGER | DEFAULT 0 | Count of followers |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Business registration date |

**Business Logic:**
- One business per owner (though owner can be linked to multiple if needed)
- Location data (lat/lng) used for proximity searches
- `rating_average` and `total_reviews` updated via triggers
- `followers_count` maintained via triggers
- `schedule` and `social_media` stored as flexible JSON objects
- `is_active` allows soft deletion/suspension

#### `business_reviews` - Customer Reviews
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Review identifier |
| `business_id` | UUID | FK to businesses(id) | Reviewed business |
| `user_id` | UUID | FK to profiles(id) | Review author |
| `rating` | INTEGER | CHECK (1 <= rating <= 5) | Star rating (1-5) |
| `comment` | TEXT | NULLABLE | Written review text |
| `visit_verified` | BOOLEAN | DEFAULT FALSE | Whether visit was verified |
| `business_response` | TEXT | NULLABLE | Business reply to review |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Review submission date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last review update |

**Business Logic:**
- Users can review businesses they've interacted with
- Rating scale 1-5 enforced by CHECK constraint
- `visit_verified` for future verification features
- Business can respond to reviews
- Triggers automatically update business rating aggregates
- Awards 15 coins to reviewer

### **3. Content & Media**

#### `videos` - Video Content
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Video identifier |
| `business_id` | UUID | FK to businesses(id) | Content creator business |
| `title` | VARCHAR | NOT NULL | Video title |
| `description` | TEXT | NULLABLE | Video description |
| `video_url` | TEXT | NOT NULL | Video file URL |
| `thumbnail_url` | TEXT | NULLABLE | Video thumbnail image |
| `duration` | INTEGER | NULLABLE | Video length in seconds |
| `file_size` | INTEGER | NULLABLE | Video file size in bytes |
| `location_lat` | NUMERIC | NULLABLE | Video location latitude |
| `location_lng` | NUMERIC | NULLABLE | Video location longitude |
| `location_name` | VARCHAR | NULLABLE | Human-readable location |
| `tags` | TEXT[] | DEFAULT '{}' | Searchable tags array |
| `views_count` | INTEGER | DEFAULT 0 | View counter |
| `likes_count` | INTEGER | DEFAULT 0 | Like counter (via triggers) |
| `coupon_id` | UUID | FK to coupons(id), NULLABLE | Associated promotional coupon |
| `has_active_coupon` | BOOLEAN | DEFAULT FALSE | Computed coupon status |
| `is_active` | BOOLEAN | DEFAULT TRUE | Video visibility |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Upload timestamp |

**Business Logic:**
- Businesses create video content to showcase offerings
- Location data enables geographic content discovery
- `likes_count` updated via triggers from `video_likes` table
- `has_active_coupon` computed field updated when coupon status changes
- Tags array enables flexible content categorization
- Can be linked to promotional coupons for marketing

#### `video_likes` - Video Engagement
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Like record identifier |
| `video_id` | UUID | FK to videos(id) | Liked video |
| `user_id` | UUID | FK to profiles(id) | User who liked |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Like timestamp |

**Business Logic:**
- Many-to-many relationship between users and videos
- Unique constraint should be on (video_id, user_id) to prevent duplicate likes
- Triggers update video like counts automatically

#### `video_tags` - Additional Video Tagging
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Tag record identifier |
| `video_id` | UUID | FK to videos(id) | Tagged video |
| `tag` | VARCHAR | NOT NULL | Tag text |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Tag creation date |

**Business Logic:**
- Supplements the tags array in videos table
- Allows for more complex tag management and analytics
- Enables tag-based search and categorization

#### `user_favorites` - Saved Videos
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Favorite record identifier |
| `user_id` | UUID | FK to profiles(id) | User who favorited |
| `video_id` | UUID | FK to videos(id) | Favorited video |
| `folder_name` | VARCHAR | DEFAULT 'General' | Organization folder |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Favorite timestamp |

**Business Logic:**
- Users can save videos for later viewing
- Folder system for organizing favorites
- Many-to-many relationship with organization features

### **4. Social & Community Features**

#### `user_follows` - Business Following
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Follow relationship identifier |
| `follower_id` | UUID | FK to profiles(id) | User following |
| `business_id` | UUID | FK to businesses(id) | Business being followed |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Follow date |

**Business Logic:**
- Users can follow businesses for updates
- Triggers update business follower counts
- Awards 5 coins for following (one-time per business)
- Enables notification and recommendation systems

#### `user_plans` - User-Generated Travel Plans
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Plan identifier |
| `creator_id` | UUID | FK to profiles(id) | Plan author |
| `title` | VARCHAR | NOT NULL | Plan title |
| `description` | TEXT | NULLABLE | Plan description |
| `estimated_duration` | INTEGER | NULLABLE | Duration in minutes |
| `estimated_budget` | NUMERIC | NULLABLE | Budget estimate |
| `is_public` | BOOLEAN | DEFAULT FALSE | Visibility setting |
| `likes_count` | INTEGER | DEFAULT 0 | Like count (via triggers) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Plan creation date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last modification date |

**Business Logic:**
- Users create shareable travel/activity plans
- Can be public or private
- Awards 10 coins for plan creation
- Enables community-driven content

#### `plan_items` - Plan Components
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Plan item identifier |
| `plan_id` | UUID | FK to user_plans(id) | Parent plan |
| `business_id` | UUID | FK to businesses(id) | Business in plan |
| `order_index` | INTEGER | NOT NULL | Sequence order |
| `estimated_time` | INTEGER | NULLABLE | Time to spend (minutes) |
| `estimated_start_time` | TIME | NULLABLE | Suggested start time |
| `notes` | TEXT | NULLABLE | User notes for this stop |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Item creation date |

**Business Logic:**
- Ordered list of businesses in a plan
- Enables detailed itinerary creation
- Links plans to businesses for discovery
- Time estimates help users plan their day

#### `plan_likes` - Plan Engagement
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Like record identifier |
| `plan_id` | UUID | FK to user_plans(id) | Liked plan |
| `user_id` | UUID | FK to profiles(id) | User who liked |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Like timestamp |

**Business Logic:**
- Users can like others' plans
- Triggers update plan like counts
- Awards 5 coins to plan creator (first like only)
- Enables social discovery of good plans

### **5. Promotional & Coupon System**

#### `coupons` - Business Promotions
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Coupon identifier |
| `business_id` | UUID | FK to businesses(id) | Issuing business |
| `title` | VARCHAR | NOT NULL | Coupon title |
| `description` | TEXT | NULLABLE | Offer description |
| `discount_type` | VARCHAR | CHECK ('percentage', 'fixed') | Discount calculation method |
| `discount_value` | NUMERIC | NOT NULL | Discount amount/percentage |
| `coin_price` | INTEGER | NOT NULL | Cost in coins to purchase |
| `max_uses` | INTEGER | DEFAULT 100 | Maximum redemptions allowed |
| `current_uses` | INTEGER | DEFAULT 0 | Current redemption count |
| `is_active` | BOOLEAN | DEFAULT TRUE | Coupon availability |
| `expires_at` | TIMESTAMP | NULLABLE | Expiration date/time |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Coupon creation date |

**Business Logic:**
- Businesses create promotional offers
- Users purchase with coins
- `discount_type` determines if `discount_value` is percentage or fixed amount
- Usage tracking prevents over-redemption
- Expiration and active status control availability
- Triggers update related video coupon status

#### `user_coupons` - Purchased Coupons
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | User coupon identifier |
| `coupon_id` | UUID | FK to coupons(id) | Original coupon offer |
| `user_id` | UUID | FK to profiles(id) | Coupon owner |
| `code` | VARCHAR | UNIQUE, NOT NULL | Unique redemption code |
| `status` | VARCHAR | CHECK ('active', 'used', 'expired') | Coupon state |
| `purchased_at` | TIMESTAMP | DEFAULT NOW() | Purchase timestamp |
| `used_at` | TIMESTAMP | NULLABLE | Redemption timestamp |

**Business Logic:**
- Represents purchased/owned coupons
- Unique codes generated for each purchase
- Status tracking for redemption management
- Links back to original coupon for details

### **6. Communication System**

#### `conversations` - Chat Sessions
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Conversation identifier |
| `client_id` | UUID | FK to profiles(id) | Client participant |
| `business_id` | UUID | FK to businesses(id) | Business participant |
| `video_id` | UUID | FK to videos(id), NULLABLE | Contextual video |
| `coupon_context_id` | UUID | FK to coupons(id), NULLABLE | Contextual coupon |
| `last_message_at` | TIMESTAMP | DEFAULT NOW() | Last activity timestamp |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Conversation start date |

**Business Logic:**
- Direct messaging between clients and businesses
- Can be initiated from video or coupon context
- `last_message_at` updated via triggers for sorting
- Awards 5 coins for starting conversation (one-time per business)
- Context fields enable automated relevant messaging

#### `messages` - Chat Messages
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Message identifier |
| `conversation_id` | UUID | FK to conversations(id) | Parent conversation |
| `sender_id` | UUID | FK to profiles(id) | Message author |
| `content` | TEXT | NOT NULL | Message text content |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Message timestamp |

**Business Logic:**
- Individual messages within conversations
- Sender can be either client or business owner
- Triggers update conversation activity timestamp
- Content is plain text (rich media can be added later)

### **Table Relationships Summary**

#### Primary Relationships:
- `auth.users` ↔ `profiles` (1:1) - Authentication to profile data
- `profiles` ↔ `wallets` (1:1) - User to coin wallet
- `profiles` ↔ `businesses` (1:many) - Users can own businesses
- `businesses` ↔ `videos` (1:many) - Business content creation
- `videos` ↔ `coupons` (many:1) - Promotional video linking
- `profiles` ↔ `conversations` ↔ `businesses` (many:many) - Communication

#### Secondary Relationships:
- `profiles` ↔ `user_follows` ↔ `businesses` (many:many) - Social following
- `profiles` ↔ `video_likes` ↔ `videos` (many:many) - Content engagement
- `profiles` ↔ `plan_likes` ↔ `user_plans` (many:many) - Plan engagement
- `user_plans` ↔ `plan_items` ↔ `businesses` (many:many) - Plan composition

#### Data Integrity Features:
- Foreign key constraints ensure referential integrity
- CHECK constraints validate enum values and ranges
- UNIQUE constraints prevent duplicate relationships
- DEFAULT values provide sensible fallbacks
- Triggers maintain calculated fields and derived data

## Triggers & Functions

Supabase supports PostgreSQL triggers and functions for automation. Below are the main triggers and their associated functions:

### Complete Trigger Documentation

#### 1. **User Management Triggers**

##### `auto_confirm_user` - TRIGGER on `auth.users`
- **Function**: Automatically sets `email_confirmed_at` timestamp
- **When**: Before INSERT/UPDATE
- **Purpose**: Auto-confirms user emails on registration
- **Usage**: Automatic - no API call needed
- **Business Logic**: Ensures all new users are marked as confirmed

##### `handle_new_user` - TRIGGER on `auth.users`
- **Function**: Complete user setup process
- **When**: AFTER INSERT
- **Purpose**: Creates profile, wallet, and initial coin transaction for new users
- **Coins Awarded**: 50 welcome coins for clients
- **Business Logic**: 
  - Creates profile from `raw_user_meta_data`
  - Creates wallet only for client users (not business users)
  - Records welcome bonus transaction
  - Handles user_type differentiation
- **Error Handling**: Includes exception handling with logging

##### `create_user_wallet` - TRIGGER on `profiles`
- **Function**: Creates wallet and welcome transaction
- **When**: AFTER INSERT
- **Purpose**: Backup wallet creation if `handle_new_user` fails
- **Coins Awarded**: 50 welcome coins
- **Business Logic**: Simple wallet creation with transaction record

#### 2. **Business & Follow System Triggers**

##### `on_follow_change` - TRIGGER on `user_follows`
- **Function**: `update_followers_count`
- **When**: AFTER INSERT/DELETE
- **Purpose**: Maintains follower count and rewards following
- **Coins Awarded**: 5 coins for following a business
- **Business Logic**:
  - INSERT: Increments business follower count + rewards coins
  - DELETE: Decrements business follower count
  - Prevents duplicate coin rewards for same business

##### `update_business_rating` - TRIGGER on `business_reviews`
- **Function**: Recalculates business rating and review count
- **When**: AFTER INSERT/UPDATE/DELETE
- **Purpose**: Maintains accurate business rating statistics
- **Business Logic**:
  - Calculates average rating from all reviews
  - Updates total review count
  - Handles review deletion properly

##### `reward_review_coins` - TRIGGER on `business_reviews`
- **Function**: Awards coins for leaving reviews
- **When**: AFTER INSERT
- **Coins Awarded**: 15 coins per review
- **Business Logic**: Rewards users for providing business feedback

#### 3. **Video & Content Triggers**

##### `update_video_likes` - TRIGGER on `video_likes`
- **Function**: Maintains video like counts
- **When**: AFTER INSERT/DELETE
- **Purpose**: Keeps accurate like statistics for videos
- **Business Logic**:
  - INSERT: Increments video like count
  - DELETE: Decrements video like count

##### `update_video_coupon_status` - TRIGGER on `videos`
- **Function**: Updates coupon status when video is modified
- **When**: BEFORE INSERT/UPDATE
- **Purpose**: Maintains accurate coupon availability on videos
- **Business Logic**: 
  - Checks if assigned coupon is active
  - Updates `has_active_coupon` field accordingly

##### `update_videos_on_coupon_change` - TRIGGER on `coupons`
- **Function**: Updates all related videos when coupon status changes
- **When**: AFTER UPDATE
- **Purpose**: Propagates coupon status changes to all associated videos
- **Business Logic**: Batch updates all videos using the modified coupon

##### `refresh_video_coupon_status` - TRIGGER on `coupons`
- **Function**: Alternative coupon status refresh
- **When**: AFTER UPDATE
- **Purpose**: Forces recalculation of video coupon status

#### 4. **Conversation & Messaging Triggers**

##### `on_conversation_created` - TRIGGER on `conversations`
- **Function**: `reward_chat_coins`
- **When**: AFTER INSERT
- **Purpose**: Rewards users for initiating business conversations
- **Coins Awarded**: 5 coins (one-time per business)
- **Business Logic**: Prevents multiple rewards for same business conversation

##### `on_conversation_with_coupon` - TRIGGER on `conversations`
- **Function**: `send_coupon_context_message`
- **When**: AFTER INSERT
- **Purpose**: Automatically sends contextual message about coupons
- **Business Logic**:
  - Only triggers if conversation has `coupon_context_id`
  - Creates formatted message about the coupon
  - Inserts automatic message from client to business

##### `on_message_sent` - TRIGGER on `messages`
- **Function**: `update_conversation_activity`
- **When**: AFTER INSERT
- **Purpose**: Updates conversation timestamp for sorting/filtering
- **Business Logic**: Sets `last_message_at` to current message timestamp

#### 5. **User Plans & Social Features Triggers**

##### `on_plan_created` - TRIGGER on `user_plans`
- **Function**: `reward_plan_creation`
- **When**: AFTER INSERT
- **Purpose**: Rewards users for creating travel/activity plans
- **Coins Awarded**: 10 coins per plan
- **Business Logic**: Encourages user-generated content

##### `update_plan_likes` - TRIGGER on `plan_likes`
- **Function**: Manages plan like counts and rewards
- **When**: AFTER INSERT/DELETE
- **Purpose**: Maintains like statistics and rewards plan creators
- **Coins Awarded**: 5 coins to plan creator (first like only)
- **Business Logic**:
  - INSERT: Increments like count + rewards creator
  - DELETE: Decrements like count
  - Prevents multiple rewards for same plan

### Utility Functions (Called by Triggers)

#### `reward_activity_coins(user_uuid, activity_type, coins_amount, description_text)`
- **Purpose**: Central coin reward system
- **Parameters**: User ID, activity type, coin amount, description
- **Business Logic**: 
  - Prevents duplicate rewards for same activity
  - Updates wallet balance
  - Records transaction with description
- **Supported Activities**: 'follow_business', 'create_plan', 'leave_review', 'plan_liked'

#### `calculate_distance(lat1, lng1, lat2, lng2)`
- **Purpose**: Calculates distance between coordinates using Haversine formula
- **Returns**: Distance in kilometers
- **Usage**: Location-based video filtering and recommendations

#### `is_coupon_active(coupon_uuid)`
- **Purpose**: Validates coupon status
- **Checks**: Active flag, expiration date, usage limits
- **Returns**: Boolean indicating if coupon is usable

#### `check_user_complete(user_uuid)`
- **Purpose**: Comprehensive user setup validation
- **Returns**: JSON object with completion status
- **Checks**: Auth user exists, email confirmed, profile exists, wallet exists

#### `cleanup_incomplete_users()`
- **Purpose**: Database maintenance function
- **Business Logic**:
  - Removes transactions from users without profiles
  - Removes wallets from users without profiles  
  - Removes auth users without profiles
- **Usage**: Manual cleanup or scheduled maintenance

#### `purchase_coupon(user_uuid, coupon_uuid)`
- **Purpose**: Complete coupon purchase transaction
- **Returns**: JSON with success status, code, and new balance
- **Business Logic**:
  - Validates coupon availability and price
  - Checks user balance
  - Generates unique coupon code
  - Updates wallet, creates transaction, creates user_coupon record
  - Updates coupon usage count

#### `get_videos_with_active_coupons(user_lat, user_lng, category_filter, radius_km, limit_results)`
- **Purpose**: Advanced video search with location and coupon filtering
- **Returns**: Videos with business info, coupon details, and calculated distance
- **Features**: Location radius filtering, category filtering, active coupon validation

#### `create_conversation_with_context(client_uuid, business_uuid, video_uuid)`
- **Purpose**: Smart conversation creation with video/coupon context
- **Returns**: Conversation ID
- **Business Logic**:
  - Extracts coupon from video if available
  - Creates or updates existing conversation
  - Sets appropriate context for automated messaging

#### `validate_video_coupon_ownership(video_uuid, coupon_uuid)`
- **Purpose**: Security validation for video-coupon relationships
- **Returns**: Boolean indicating if coupon belongs to video's business
- **Usage**: Prevents businesses from using other businesses' coupons

## API Endpoints & Usage Examples

### User Management Operations

#### Register New User
```typescript
// Automatic via Supabase Auth - triggers handle_new_user
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      full_name: 'John Doe',
      user_type: 'client', // or 'business'
      interests: 'food,tourism,entertainment'
    }
  }
})
// Results in: Profile creation + 50 welcome coins
```

#### Check User Completion Status
```typescript
// RPC call to check_user_complete function
const { data } = await supabase.rpc('check_user_complete', {
  user_uuid: 'user-id'
})
// Returns: { user_id, auth_user_exists, user_confirmed, profile_exists, wallet_exists, complete }
```

#### Cleanup Incomplete Users (Admin)
```typescript
// RPC call for database maintenance
const { data } = await supabase.rpc('cleanup_incomplete_users')
```

### Business & Social Operations

#### Follow/Unfollow Business
```typescript
// Follow - triggers update_followers_count + rewards 5 coins
const { data } = await supabase
  .from('user_follows')
  .insert({ follower_id: userId, business_id: businessId })

// Unfollow - triggers follower count decrement
const { data } = await supabase
  .from('user_follows')
  .delete()
  .eq('follower_id', userId)
  .eq('business_id', businessId)
```

#### Leave Business Review
```typescript
// Triggers update_business_rating + reward_review_coins (15 coins)
const { data } = await supabase
  .from('business_reviews')
  .insert({
    business_id: businessId,
    user_id: userId,
    rating: 5,
    comment: 'Great service!'
  })
```

### Video & Content Operations

#### Like/Unlike Video
```typescript
// Like - triggers update_video_likes
const { data } = await supabase
  .from('video_likes')
  .insert({ video_id: videoId, user_id: userId })

// Unlike - triggers like count decrement
const { data } = await supabase
  .from('video_likes')
  .delete()
  .eq('video_id', videoId)
  .eq('user_id', userId)
```

#### Get Videos with Active Coupons
```typescript
// RPC call with location and filtering
const { data } = await supabase.rpc('get_videos_with_active_coupons', {
  user_lat: 4.4389,
  user_lng: -75.2426,
  category_filter: 'restaurant', // optional
  radius_km: 10,
  limit_results: 20
})
// Returns: Videos with business info, coupon details, and distance
```

#### Create Video with Coupon
```typescript
// Create video - triggers update_video_coupon_status
const { data } = await supabase
  .from('videos')
  .insert({
    business_id: businessId,
    title: 'New Menu Special',
    video_url: 'https://...',
    coupon_id: couponId, // optional
    location_lat: 4.4389,
    location_lng: -75.2426
  })
```

### Conversation & Messaging

#### Start Conversation with Context
```typescript
// RPC call - triggers reward_chat_coins + send_coupon_context_message
const { data } = await supabase.rpc('create_conversation_with_context', {
  client_uuid: userId,
  business_uuid: businessId,
  video_uuid: videoId // optional - adds coupon context
})
// Results in: 5 coins + automatic context message if video has coupon
```

#### Send Message
```typescript
// Triggers update_conversation_activity
const { data } = await supabase
  .from('messages')
  .insert({
    conversation_id: conversationId,
    sender_id: userId,
    content: 'Hello, I have a question...'
  })
```

### User Plans & Social Features

#### Create User Plan
```typescript
// Triggers reward_plan_creation (10 coins)
const { data } = await supabase
  .from('user_plans')
  .insert({
    creator_id: userId,
    title: 'Perfect Weekend in Ibagué',
    description: 'A great itinerary for tourists',
    estimated_duration: 480, // minutes
    estimated_budget: 150000,
    is_public: true
  })
```

#### Like/Unlike Plan
```typescript
// Like - triggers update_plan_likes + rewards creator (5 coins, first time only)
const { data } = await supabase
  .from('plan_likes')
  .insert({ plan_id: planId, user_id: userId })

// Unlike - triggers like count decrement
const { data } = await supabase
  .from('plan_likes')
  .delete()
  .eq('plan_id', planId)
  .eq('user_id', userId)
```

### Coupon Operations

#### Purchase Coupon
```typescript
// RPC call - handles complete purchase transaction
const { data } = await supabase.rpc('purchase_coupon', {
  user_uuid: userId,
  coupon_uuid: couponId
})
// Returns: { success: true/false, code: 'CPN1234', new_balance: 45, error?: string }
```

#### Check Coupon Status
```typescript
// RPC call to validate coupon
const { data } = await supabase.rpc('is_coupon_active', {
  coupon_uuid: couponId
})
// Returns: boolean
```

#### Update Coupon
```typescript
// Triggers update_videos_on_coupon_change + refresh_video_coupon_status
const { data } = await supabase
  .from('coupons')
  .update({ 
    is_active: false,
    expires_at: new Date().toISOString()
  })
  .eq('id', couponId)
```

### Wallet & Transactions

#### Get User Wallet
```typescript
const { data } = await supabase
  .from('wallets')
  .select('*')
  .eq('user_id', userId)
  .single()
```

#### Get Transaction History
```typescript
const { data } = await supabase
  .from('coin_transactions')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

### Security & Validation

#### Validate Video-Coupon Ownership
```typescript
// RPC call for security validation
const { data } = await supabase.rpc('validate_video_coupon_ownership', {
  video_uuid: videoId,
  coupon_uuid: couponId
})
// Returns: boolean - true if coupon belongs to video's business
```

## Coin Economy System

### Coin Earning Opportunities
| Activity | Coins Awarded | Frequency | Trigger Function |
|----------|---------------|-----------|------------------|
| Registration | 50 coins | One-time | `handle_new_user` |
| Follow Business | 5 coins | Per business (first time) | `reward_activity_coins` |
| Leave Review | 15 coins | Per review | `reward_review_coins` |
| Start Chat | 5 coins | Per business (first time) | `reward_chat_coins` |
| Create Plan | 10 coins | Per plan | `reward_plan_creation` |
| Plan Gets Liked | 5 coins | First like only | `update_plan_likes` |

### Coin Spending Opportunities
- **Purchase Coupons**: Variable cost based on coupon value
- **Custom Business Features**: Can be extended for premium features

### Coin Transaction Types
- `earn`: User receives coins
- `spend`: User spends coins

## Error Handling & Edge Cases

### Duplicate Prevention
- **Follow Rewards**: Prevented by checking existing `coin_transactions` with specific description
- **Chat Rewards**: Prevented by checking existing conversation history
- **Plan Like Rewards**: Prevented by checking existing like transactions

### Data Integrity
- **Coupon Purchase**: Validates user balance, coupon availability, and generates unique codes
- **User Creation**: Includes exception handling with detailed logging
- **Business Ratings**: Handles review deletion and updates appropriately

### Security Measures
- **Video-Coupon Validation**: Ensures coupons can only be used by their owning business
- **User Completion Checks**: Validates all required user setup steps
- **Transaction Validation**: Prevents negative balances and invalid operations

## Database Maintenance

### Cleanup Operations
- **Incomplete Users**: `cleanup_incomplete_users()` removes orphaned data
- **Expired Coupons**: Automatic status updates via triggers
- **Stale Conversations**: Activity tracking for conversation management

### Performance Optimizations
- **Indexed Foreign Keys**: All relationships properly indexed
- **Calculated Fields**: `has_active_coupon` field prevents repeated calculations
- **Batch Updates**: Video status updates handled efficiently

## Deployment & Migration

### Setting Up Triggers
```sql
-- Example trigger creation
CREATE TRIGGER on_user_follow 
  AFTER INSERT OR DELETE ON user_follows
  FOR EACH ROW EXECUTE FUNCTION update_followers_count();
```

### Function Deployment
```sql
-- Example function creation
CREATE OR REPLACE FUNCTION reward_activity_coins(
  user_uuid UUID,
  activity_type TEXT,
  coins_amount INTEGER,
  description_text TEXT
) RETURNS BOOLEAN AS $$
-- Function body here
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Migration Best Practices
1. **Test in Staging**: Always test triggers and functions in development environment
2. **Backup Data**: Create backups before deploying trigger changes
3. **Gradual Rollout**: Deploy functions first, then enable triggers
4. **Monitor Performance**: Watch for slow queries after trigger deployment

## Monitoring & Debugging

### Useful Queries for Monitoring

#### Check Coin Transaction Patterns
```sql
SELECT 
  type,
  description,
  COUNT(*) as frequency,
  SUM(amount) as total_coins
FROM coin_transactions 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY type, description
ORDER BY frequency DESC;
```

#### Monitor User Registration Success
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as registrations,
  COUNT(CASE WHEN id IN (SELECT user_id FROM wallets) THEN 1 END) as with_wallet,
  COUNT(CASE WHEN id IN (SELECT id FROM profiles) THEN 1 END) as with_profile
FROM auth.users 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

#### Check Coupon Performance
```sql
SELECT 
  c.title,
  c.current_uses,
  c.max_uses,
  COUNT(uc.id) as purchases,
  AVG(ct.amount) as avg_coin_cost
FROM coupons c
LEFT JOIN user_coupons uc ON c.id = uc.coupon_id
LEFT JOIN coin_transactions ct ON ct.description LIKE '%cupón%'
WHERE c.is_active = true
GROUP BY c.id, c.title, c.current_uses, c.max_uses
ORDER BY purchases DESC;
```

### Common Issues & Solutions

#### Issue: Users Not Getting Welcome Coins
- **Check**: `handle_new_user` trigger is active
- **Solution**: Verify trigger exists and function has proper permissions

#### Issue: Duplicate Coin Rewards
- **Check**: Reward prevention logic in `reward_activity_coins`
- **Solution**: Ensure unique description patterns are used

#### Issue: Coupon Status Not Updating
- **Check**: `update_videos_on_coupon_change` trigger
- **Solution**: Verify trigger runs on coupon updates and affects correct videos

#### Issue: Conversation Context Not Working
- **Check**: `send_coupon_context_message` trigger and video-coupon relationships
- **Solution**: Ensure video has active coupon and proper foreign keys

## Best Practices

- Use Supabase's SQL editor for migrations and trigger setup.
- Document each function and trigger in your codebase for maintainability.
- Use RPC endpoints for custom business logic that can't be handled by simple table operations.
- Test triggers and functions in staging before deploying to production.
- Monitor coin economy balance and adjust rewards as needed.
- Implement proper error handling and logging in all functions.
- Use transactions for complex multi-table operations.
- Regular database maintenance and cleanup of orphaned data.

## References
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/plpgsql-trigger.html)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/plpgsql.html)

---

This guide summarizes your Supabase infrastructure, including database schema, triggers, functions, and example operations. For details on each function's implementation, refer to the `triggers.csv` file provided in your workspace.