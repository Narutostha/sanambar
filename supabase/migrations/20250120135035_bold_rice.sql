/*
  # Add location settings table

  1. New Tables
    - `location_settings`
      - `id` (uuid, primary key)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `zip` (text)
      - `phone` (text)
      - `email` (text)
      - `hours` (jsonb)
      - `map_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `location_settings` table
    - Add policies for public read access
    - Add policies for authenticated users to manage settings
*/

CREATE TABLE IF NOT EXISTS location_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  hours jsonb NOT NULL DEFAULT '{
    "monday": {"open": "9:00", "close": "20:00"},
    "tuesday": {"open": "9:00", "close": "20:00"},
    "wednesday": {"open": "9:00", "close": "20:00"},
    "thursday": {"open": "9:00", "close": "20:00"},
    "friday": {"open": "9:00", "close": "20:00"},
    "saturday": {"open": "9:00", "close": "18:00"},
    "sunday": {"open": "10:00", "close": "16:00"}
  }'::jsonb,
  map_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE location_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read location_settings"
  ON location_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users manage location_settings"
  ON location_settings
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default location
INSERT INTO location_settings (
  address,
  city,
  state,
  zip,
  phone,
  email,
  map_url
) VALUES (
  '123 Barber Street',
  'New York',
  'NY',
  '10001',
  '(555) 123-4567',
  'contact@emprorbarbers.com',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.982661845023!2d-73.99021502426847!3d40.74463497138451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1710901234567!5m2!1sen!2sus'
);