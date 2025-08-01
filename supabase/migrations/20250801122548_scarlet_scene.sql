/*
  # Initial Schema for No Way Home App

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `home_country` (text)
      - `movie_genre` (text)
      - `wishlist_destinations` (text array)
      - `favorite_foods` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `booking_type` (text, enum: outbound/return/movie)
      - `from_location` (text, nullable)
      - `to_location` (text, nullable)
      - `departure_date` (timestamp, nullable)
      - `return_date` (timestamp, nullable)
      - `movie_title` (text, nullable)
      - `movie_genre` (text, nullable)
      - `movie_date` (timestamp, nullable)
      - `price` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  home_country text NOT NULL,
  movie_genre text NOT NULL,
  wishlist_destinations text[] NOT NULL DEFAULT '{}',
  favorite_foods text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  booking_type text NOT NULL CHECK (booking_type IN ('outbound', 'return', 'movie')),
  from_location text,
  to_location text,
  departure_date timestamptz,
  return_date timestamptz,
  movie_title text,
  movie_genre text,
  movie_date timestamptz,
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for bookings
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_type ON bookings(booking_type);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);