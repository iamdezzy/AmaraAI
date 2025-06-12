import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

interface UpdateTrialUsageRequest {
  fingerprintId: string
  chatMessages: number
  voiceNotes: number
}

interface UpdateTrialUsageResponse {
  isTrialExceeded: boolean
}

const TRIAL_LIMITS = {
  chatMessages: 3,
  voiceNotes: 1
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

    // Parse request body
    const requestBody: UpdateTrialUsageRequest = await req.json()
    const { fingerprintId, chatMessages, voiceNotes } = requestBody

    if (!fingerprintId || typeof chatMessages !== 'number' || typeof voiceNotes !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid request body. fingerprintId, chatMessages, and voiceNotes are required.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate usage counts are non-negative
    if (chatMessages < 0 || voiceNotes < 0) {
      return new Response(
        JSON.stringify({ error: 'Usage counts must be non-negative' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if trial limits are exceeded
    const isTrialExceeded = chatMessages > TRIAL_LIMITS.chatMessages || voiceNotes > TRIAL_LIMITS.voiceNotes

    // Update device trial record
    const { data: updatedTrial, error: updateError } = await supabaseClient
      .from('device_trials')
      .update({
        chat_messages_used: chatMessages,
        voice_notes_used: voiceNotes,
        is_trial_exceeded: isTrialExceeded,
        last_accessed_at: new Date().toISOString()
      })
      .eq('fingerprint_id', fingerprintId)
      .select()
      .single()

    if (updateError) {
      // If record doesn't exist, create it
      if (updateError.code === 'PGRST116') {
        const { data: newTrial, error: insertError } = await supabaseClient
          .from('device_trials')
          .insert({
            fingerprint_id: fingerprintId,
            chat_messages_used: chatMessages,
            voice_notes_used: voiceNotes,
            is_trial_exceeded: isTrialExceeded,
            last_accessed_at: new Date().toISOString()
          })
          .select()
          .single()

        if (insertError) {
          throw insertError
        }
      } else {
        throw updateError
      }
    }

    const response: UpdateTrialUsageResponse = {
      isTrialExceeded
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in update-trial-usage function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})