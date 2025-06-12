import { supabase } from './supabase'
import type { SignUpData, SignInData } from './supabase'

export class AuthService {
  // Email/Password Sign Up
  static async signUpWithEmail(data: SignUpData) {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      // Only log success in development mode - NO sensitive data
      if (import.meta.env.DEV) {
        console.log('Sign up successful')
      }

      return {
        success: true,
        user: authData.user,
        session: authData.session
      }
    } catch (error) {
      // Only log error type, not sensitive details
      if (import.meta.env.DEV) {
        console.error('Sign up error type:', error instanceof Error ? error.name : 'Unknown error')
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign up failed'
      }
    }
  }

  // Email/Password Sign In
  static async signInWithEmail(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) throw error

      // Only log success in development mode - NO sensitive data
      if (import.meta.env.DEV) {
        console.log('Sign in successful')
      }

      return {
        success: true,
        user: authData.user,
        session: authData.session
      }
    } catch (error) {
      // Only log error type, not sensitive details
      if (import.meta.env.DEV) {
        console.error('Sign in error type:', error instanceof Error ? error.name : 'Unknown error')
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign in failed'
      }
    }
  }

  // Google OAuth Sign In
  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      if (import.meta.env.DEV) {
        console.log('Google OAuth initiated')
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Google sign in error type:', error instanceof Error ? error.name : 'Unknown error')
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google sign in failed'
      }
    }
  }

  // Apple OAuth Sign In
  static async signInWithApple() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      if (import.meta.env.DEV) {
        console.log('Apple OAuth initiated')
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Apple sign in error type:', error instanceof Error ? error.name : 'Unknown error')
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Apple sign in failed'
      }
    }
  }

  // Sign Out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      if (import.meta.env.DEV) {
        console.log('Sign out successful')
      }

      return { success: true }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Sign out error type:', error instanceof Error ? error.name : 'Unknown error')
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign out failed'
      }
    }
  }

  // Reset Password
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      if (import.meta.env.DEV) {
        console.log('Password reset email sent')
      }

      return { success: true }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Reset password error type:', error instanceof Error ? error.name : 'Unknown error')
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Reset password failed'
      }
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error

      return { success: true, user }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Get current user error type:', error instanceof Error ? error.name : 'Unknown error')
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get current user'
      }
    }
  }

  // Get current session
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error

      return { success: true, session }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Get current session error type:', error instanceof Error ? error.name : 'Unknown error')
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get current session'
      }
    }
  }
}