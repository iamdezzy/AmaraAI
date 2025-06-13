/*
  # Extended Amara Database Schema - Chat Sessions and Messages

  1. New Tables (extending existing schema)
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
    - Enable RLS on new tables
    - Add policies for authenticated and anonymous users

  Note: This migration assumes user_profiles and device_trials tables already exist
*/

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

-- Enable Row Level Security on new tables
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

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

-- Create indexes for performance on new tables
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);