import { createClient } from '@supabase/supabase-js'

// Debug environment variables
console.log('Environment check:')
console.log('VITE_SUPABASE_URL from env:', import.meta.env.VITE_SUPABASE_URL)
console.log('VITE_SUPABASE_ANON_KEY from env:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing')

// Retrieve keys from environment variables with fallback for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hwdmxfbkswNzptqniilb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZG14ZmJrc3duenB0cW5paWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NDEyMjksImV4cCI6MjA2NTMxNzIyOX0.ELRI4hTbsvhYKfbgXNSQ5Te8XZRYIiBNQagKPc3HZtM'

console.log('Final configuration:')
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing')

// Runtime check to alert developers if keys are missing
if (!supabaseUrl) {
  console.error('❌ Supabase URL is missing!')
}

if (!supabaseAnonKey) {
  console.error('❌ Supabase anon key is missing!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test function to check auth connection
export const testAuth = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log('Auth test result:', { data, error })
    return { data, error }
  } catch (err) {
    console.error('Auth test failed:', err)
    return { data: null, error: err }
  }
}

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