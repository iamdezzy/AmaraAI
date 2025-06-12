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

      return {
        success: true,
        user: authData.user,
        session: authData.session
      }
    } catch (error) {
      console.error('Sign up error:', error)
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

      return {
        success: true,
        user: authData.user,
        session: authData.session
      }
    } catch (error) {
      console.error('Sign in error:', error)
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

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Google sign in error:', error)
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

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Apple sign in error:', error)
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

      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
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

      return { success: true }
    } catch (error) {
      console.error('Reset password error:', error)
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
      console.error('Get current user error:', error)
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
      console.error('Get current session error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get current session'
      }
    }
  }
}