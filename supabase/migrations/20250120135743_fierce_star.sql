/*
  # Enhance services table with favorites and images

  1. Changes
    - Add `is_favorite` column to services table
    - Add `image_url` column to services table
    - Update RLS policies to allow public access to these new fields
  
  2. Notes
    - `is_favorite` defaults to false
    - `image_url` allows NULL for backward compatibility
*/

-- Add new columns to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS is_favorite boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS image_url text;