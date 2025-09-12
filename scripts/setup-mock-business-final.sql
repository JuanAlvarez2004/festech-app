-- Mock Business Setup for Development
-- Run this after create-tables.sql

-- Insert mock business for development
INSERT INTO businesses (
  id,
  owner_id,
  name,
  category,
  description,
  phone,
  address,
  latitude,
  longitude,
  full_address,
  neighborhood,
  logo_url,
  cover_image_url,
  whatsapp,
  price_range,
  schedule,
  social_media,
  services,
  rating_average,
  total_reviews,
  followers_count,
  is_active
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440000', -- Same as business ID for simplicity
  'Café Tolima',
  'gastronomia',
  'El mejor café de la región con vista a las montañas del Tolima',
  '+57 8 123 4567',
  'Carrera 3 # 12-34',
  4.4389,
  -75.2322,
  'Carrera 3 # 12-34, Centro, Ibagué, Tolima',
  'Centro',
  'https://via.placeholder.com/150',
  'https://via.placeholder.com/400x200',
  '+57 300 123 4567',
  '$$',
  '{"lunes": {"open": "06:00", "close": "20:00"}, "martes": {"open": "06:00", "close": "20:00"}, "miercoles": {"open": "06:00", "close": "20:00"}, "jueves": {"open": "06:00", "close": "20:00"}, "viernes": {"open": "06:00", "close": "22:00"}, "sabado": {"open": "07:00", "close": "22:00"}, "domingo": {"open": "08:00", "close": "18:00"}}',
  '{"instagram": "@cafetolima", "facebook": "CafeTolima"}',
  '{"Café especialidad", "Desayunos", "Postres", "WiFi gratis"}',
  4.5,
  25,
  150,
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description;

-- Insert mock profile for the business owner
INSERT INTO profiles (
  id,
  email,
  full_name,
  user_type,
  phone,
  city,
  avatar_url,
  bio,
  interests,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'cafe@tolima.com',
  'Café Tolima',
  'business',
  '+57 8 123 4567',
  'Ibagué',
  'https://via.placeholder.com/150',
  'Propietarios del mejor café de Ibagué',
  '{"gastronomia", "cafe", "turismo"}',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  user_type = EXCLUDED.user_type;