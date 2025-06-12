import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

interface InitializeTrialPlanRequest {
  chosenPlan: 'monthly_trial' | 'yearly_trial'
  fingerprintId?: string
}

interface InitializeTrialPlanResponse {
  success: boolean
  trialEndDate: string
  plan: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify user session
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const requestBody: InitializeTrialPlanRequest = await req.json()
    const { chosenPlan, fingerprintId } = requestBody

    if (!chosenPlan || !['monthly_trial', 'yearly_trial'].includes(chosenPlan)) {
      return new Response(
        JSON.stringify({ error: 'Invalid chosen plan. Must be monthly_trial or yearly_trial.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Calculate trial dates
    const trialStartDate = new Date()
    const trialEndDate = new Date(trialStartDate.getTime() + (7 * 24 * 60 * 60 * 1000)) // 7 days from now

    // Update user profile with trial plan
    const { data: updatedProfile, error: updateError } = await supabaseClient
      .from('user_profiles')
      .update({
        current_plan: chosenPlan,
        trial_start_date: trialStartDate.toISOString(),
        trial_end_date: trialEndDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // If fingerprintId is provided, link the device trial to this user
    if (fingerprintId) {
      const { error: linkError } = await supabaseClient
        .from('device_trials')
        .update({
          converted_to_user_id: user.id
        })
        .eq('fingerprint_id', fingerprintId)

      // Don't throw error if device trial doesn't exist - user might not have used anonymous trial
      if (linkError && linkError.code !== 'PGRST116') {
        console.warn('Failed to link device trial to user:', linkError)
      }
    }

    const response: InitializeTrialPlanResponse = {
      success: true,
      trialEndDate: trialEndDate.toISOString(),
      plan: chosenPlan
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in initialize-trial-plan function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})