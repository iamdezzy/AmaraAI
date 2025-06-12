import { supabase } from './supabase'

export interface TrialStatus {
  chatMessages: number
  voiceNotes: number
  isTrialExceeded: boolean
}

export interface UpdateTrialUsageParams {
  fingerprintId: string
  chatMessages: number
  voiceNotes: number
}

export interface InitializeTrialPlanParams {
  chosenPlan: 'monthly_trial' | 'yearly_trial'
  fingerprintId?: string
}

export class TrialService {
  // Generate device fingerprint (simple implementation)
  static generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx?.fillText('Amara fingerprint', 10, 10)
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|')
    
    // Simple hash function
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36)
  }

  // Get trial status for a device
  static async getTrialStatus(fingerprintId: string): Promise<TrialStatus | null> {
    try {
      const { data, error } = await supabase.functions.invoke('trial-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: new URLSearchParams({ fingerprintId })
      })

      if (error) throw error

      return data as TrialStatus
    } catch (error) {
      console.error('Error getting trial status:', error)
      return null
    }
  }

  // Update trial usage for a device
  static async updateTrialUsage(params: UpdateTrialUsageParams): Promise<{ isTrialExceeded: boolean } | null> {
    try {
      const { data, error } = await supabase.functions.invoke('update-trial-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })

      if (error) throw error

      return data as { isTrialExceeded: boolean }
    } catch (error) {
      console.error('Error updating trial usage:', error)
      return null
    }
  }

  // Initialize trial plan for authenticated user
  static async initializeTrialPlan(params: InitializeTrialPlanParams): Promise<any> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase.functions.invoke('initialize-trial-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(params)
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error initializing trial plan:', error)
      throw error
    }
  }

  // Get user profile
  static async getUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      return { success: true, profile: data }
    } catch (error) {
      console.error('Error getting user profile:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user profile'
      }
    }
  }

  // Update user profile
  static async updateUserProfile(updates: Partial<{
    current_plan: string
    trial_start_date: string
    trial_end_date: string
    is_active: boolean
  }>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      return { success: true, profile: data }
    } catch (error) {
      console.error('Error updating user profile:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user profile'
      }
    }
  }
}