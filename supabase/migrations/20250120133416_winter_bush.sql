/*
  # Initial Schema Setup

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `title` (text)
      - `price` (numeric)
      - `duration` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `appointments`
      - `id` (uuid, primary key)
      - `service_id` (uuid, foreign key to services)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `date` (date)
      - `time` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to perform CRUD operations
    - Add policies for public users to read services and create appointments
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  price numeric NOT NULL,
  duration text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policies for services
CREATE POLICY "Allow public read services" 
  ON services
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users full access to services"
  ON services
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for appointments
CREATE POLICY "Allow public to create appointments"
  ON appointments
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to appointments"
  ON appointments
  TO authenticated
  USING (true)
  WITH CHECK (true);