import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  user_id: string
  current_plan: 'freemium' | 'monthly_trial' | 'yearly_trial' | 'monthly_paid' | 'yearly_paid'
  trial_start_date?: string
  trial_end_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DeviceTrial {
  fingerprint_id: string
  chat_messages_used: number
  voice_notes_used: number
  is_trial_exceeded: boolean
  last_accessed_at: string
  converted_to_user_id?: string
  created_at: string
}

// Auth types
export interface SignUpData {
  email: string
  password: string
}

export interface SignInData {
  email: string
  password: string
}