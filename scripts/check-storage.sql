-- Storage Buckets Setup for Festech
-- Run this in Supabase SQL Editor

-- Create videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  52428800, -- 50MB limit
  '{"video/mp4", "video/quicktime", "video/x-msvideo"}'
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create thumbnails bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'thumbnails',
  'thumbnails',
  true,
  5242880, -- 5MB limit
  '{"image/jpeg", "image/png", "image/webp"}'
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for videos bucket
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
CREATE POLICY "Authenticated users can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'videos' AND 
    auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Videos are publicly accessible" ON storage.objects;
CREATE POLICY "Videos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;
CREATE POLICY "Users can delete their own videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'videos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for thumbnails bucket
DROP POLICY IF EXISTS "Authenticated users can upload thumbnails" ON storage.objects;
CREATE POLICY "Authenticated users can upload thumbnails" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'thumbnails' AND 
    auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Thumbnails are publicly accessible" ON storage.objects;
CREATE POLICY "Thumbnails are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Users can delete their own thumbnails" ON storage.objects;
CREATE POLICY "Users can delete their own thumbnails" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'thumbnails' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );