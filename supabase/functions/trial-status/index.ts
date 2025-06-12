import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

interface TrialStatusResponse {
  chatMessages: number
  voiceNotes: number
  isTrialExceeded: boolean
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get fingerprint ID from query parameters
    const url = new URL(req.url)
    const fingerprintId = url.searchParams.get('fingerprintId')

    if (!fingerprintId) {
      return new Response(
        JSON.stringify({ error: 'fingerprintId is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if device trial record exists
    const { data: existingTrial, error: fetchError } = await supabaseClient
      .from('device_trials')
      .select('*')
      .eq('fingerprint_id', fingerprintId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    let trialData
    
    if (!existingTrial) {
      // Create new device trial record
      const { data: newTrial, error: insertError } = await supabaseClient
        .from('device_trials')
        .insert({
          fingerprint_id: fingerprintId,
          chat_messages_used: 0,
          voice_notes_used: 0,
          is_trial_exceeded: false,
          last_accessed_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      trialData = newTrial
    } else {
      // Update last accessed time
      const { data: updatedTrial, error: updateError } = await supabaseClient
        .from('device_trials')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('fingerprint_id', fingerprintId)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      trialData = updatedTrial
    }

    const response: TrialStatusResponse = {
      chatMessages: trialData.chat_messages_used,
      voiceNotes: trialData.voice_notes_used,
      isTrialExceeded: trialData.is_trial_exceeded
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in trial-status function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})