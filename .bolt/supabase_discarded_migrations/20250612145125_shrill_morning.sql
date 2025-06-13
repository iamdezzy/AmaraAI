/*
  # Create user profiles and device trials tables

  1. New Tables
    - `user_profiles`
      - `user_id` (uuid, primary key, foreign key to auth.users.id)
      - `current_plan` (text: freemium, monthly_trial, yearly_trial, monthly_paid, yearly_paid)
      - `trial_start_date` (timestamp with time zone)
      - `trial_end_date` (timestamp with time zone)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
    
    - `device_trials`
      - `fingerprint_id` (text, primary key)
      - `chat_messages_used` (integer, default 0)
      - `voice_notes_used` (integer, default 0)
      - `is_trial_exceeded` (boolean, default false)
      - `last_accessed_at` (timestamp with time zone, default now())
      - `converted_to_user_id` (uuid, nullable, foreign key to auth.users.id)
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for anonymous users to access device trial data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (user_id, current_plan)
  VALUES (NEW.id, 'freemium');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_plan text NOT NULL DEFAULT 'freemium' CHECK (current_plan IN ('freemium', 'monthly_trial', 'yearly_trial', 'monthly_paid', 'yearly_paid')),
  trial_start_date timestamptz,
  trial_end_date timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create device_trials table
CREATE TABLE IF NOT EXISTS device_trials (
  fingerprint_id text PRIMARY KEY,
  chat_messages_used integer DEFAULT 0 CHECK (chat_messages_used >= 0),
  voice_notes_used integer DEFAULT 0 CHECK (voice_notes_used >= 0),
  is_trial_exceeded boolean DEFAULT false,
  last_accessed_at timestamptz DEFAULT now(),
  converted_to_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_trials ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for device_trials
CREATE POLICY "Anyone can read device trials by fingerprint"
  ON device_trials
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert device trials"
  ON device_trials
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update device trials by fingerprint"
  ON device_trials
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Create trigger for updated_at on user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_device_trials_fingerprint ON device_trials(fingerprint_id);