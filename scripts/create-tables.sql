-- Festech Database Setup Script
-- Run this in Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_follows ENABLE ROW LEVEL SECURITY;

-- Create videos table if not exists
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  file_size INTEGER,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_name VARCHAR(255),
  tags TEXT[] DEFAULT '{}',
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_videos_business ON videos(business_id);
CREATE INDEX IF NOT EXISTS idx_videos_created ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_active ON videos(is_active) WHERE is_active = true;

-- RLS Policies for videos
DROP POLICY IF EXISTS "Videos are publicly viewable" ON videos;
CREATE POLICY "Videos are publicly viewable" ON videos
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Business owners can manage their videos" ON videos;
CREATE POLICY "Business owners can manage their videos" ON videos
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_id FROM businesses WHERE id = videos.business_id
    )
  );

-- Create video_likes table if not exists
CREATE TABLE IF NOT EXISTS video_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(video_id, user_id)
);

-- RLS Policies for video_likes
DROP POLICY IF EXISTS "Anyone can view likes" ON video_likes;
CREATE POLICY "Anyone can view likes" ON video_likes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own likes" ON video_likes;
CREATE POLICY "Users can manage their own likes" ON video_likes
  FOR ALL USING (auth.uid() = user_id);

-- Function to update video likes count
CREATE OR REPLACE FUNCTION update_video_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE videos 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.video_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE videos 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.video_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for video likes
DROP TRIGGER IF EXISTS trigger_update_video_likes ON video_likes;
CREATE TRIGGER trigger_update_video_likes
  AFTER INSERT OR DELETE ON video_likes
  FOR EACH ROW EXECUTE FUNCTION update_video_likes_count();