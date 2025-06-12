import { createClient } from '@supabase/supabase-js'

// Retrieve keys from environment variables with fallback for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL_HERE'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE'

// Runtime check to alert developers if keys are missing
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL_HERE') {
  console.error('Supabase client failed to initialize: VITE_SUPABASE_URL is missing. Please check your environment variables or direct assignments.')
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
  console.error('Supabase client failed to initialize: VITE_SUPABASE_ANON_KEY is missing. Please check your environment variables or direct assignments.')
}

// Only log in development mode and only non-sensitive info
if (import.meta.env.DEV) {
  console.log('Supabase client initializing...')
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