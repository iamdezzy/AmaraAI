/*
  # Initial Amara Database Schema

  1. New Tables
    - `user_profiles`
      - `user_id` (uuid, primary key, foreign key to auth.users)
      - `current_plan` (text, enum: freemium, monthly_trial, yearly_trial, monthly_paid, yearly_paid)
      - `trial_start_date` (timestamp)
      - `trial_end_date` (timestamp)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `device_trials`
      - `fingerprint_id` (text, primary key)
      - `chat_messages_used` (integer, default 0)
      - `voice_notes_used` (integer, default 0)
      - `is_trial_exceeded` (boolean, default false)
      - `last_accessed_at` (timestamp)
      - `converted_to_user_id` (uuid, nullable, foreign key to auth.users)
      - `created_at` (timestamp)
    
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable, foreign key to auth.users)
      - `started_at` (timestamp)
      - `ended_at` (timestamp, nullable)
      - `is_anonymous` (boolean)
      - `anonymous_message_count` (smallint, default 0)
      - `anonymous_voice_count` (smallint, default 0)
    
    - `messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key to chat_sessions)
      - `sender` (text, 'user' or 'amara')
      - `content` (text)
      - `message_type` (text, 'text' or 'voice')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for anonymous users to access device trials

  3. Functions
    - Create trigger function for updating updated_at timestamps
    - Create trigger function for creating user profiles on signup
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create user profile creation trigger function
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, current_plan)
  VALUES (NEW.id, 'freemium');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  is_anonymous boolean NOT NULL,
  anonymous_message_count smallint DEFAULT 0,
  anonymous_voice_count smallint DEFAULT 0
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id),
  sender text NOT NULL,
  content text NOT NULL,
  message_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
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

-- Create RLS policies for device_trials
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

-- Create RLS policies for chat_sessions
CREATE POLICY "Users can read own sessions"
  ON chat_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous users can read anonymous sessions"
  ON chat_sessions
  FOR SELECT
  TO anon
  USING (is_anonymous = true);

CREATE POLICY "Users can insert own sessions"
  ON chat_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can insert anonymous sessions"
  ON chat_sessions
  FOR INSERT
  TO anon
  WITH CHECK (is_anonymous = true);

-- Create RLS policies for messages
CREATE POLICY "Users can read messages from own sessions"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anonymous users can read messages from anonymous sessions"
  ON messages
  FOR SELECT
  TO anon
  USING (
    session_id IN (
      SELECT id FROM chat_sessions WHERE is_anonymous = true
    )
  );

CREATE POLICY "Users can insert messages to own sessions"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anonymous users can insert messages to anonymous sessions"
  ON messages
  FOR INSERT
  TO anon
  WITH CHECK (
    session_id IN (
      SELECT id FROM chat_sessions WHERE is_anonymous = true
    )
  );

-- Create triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER create_user_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_device_trials_fingerprint ON device_trials(fingerprint_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);