import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VapiCallPayload {
  type: string;
  call: {
    id: string;
    assistantId?: string;
    phoneNumber?: { number: string };
    customer?: { number: string; name?: string };
    startedAt: string;
    endedAt?: string;
    duration?: number;
    transcript?: string;
    recordingUrl?: string;
    summary?: string;
    analysis?: {
      successEvaluation?: string;
      structuredData?: Record<string, unknown>;
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: VapiCallPayload = await req.json();
    console.log('Received Vapi webhook:', JSON.stringify(payload, null, 2));

    // Only process end-of-call reports
    if (payload.type !== 'end-of-call-report') {
      console.log(`Ignoring webhook type: ${payload.type}`);
      return new Response(JSON.stringify({ success: true, message: 'Ignored non-call-end event' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const call = payload.call;
    
    // Find agent by vapi_assistant_id or phone_number
    let agent = null;
    
    if (call.assistantId) {
      const { data: agentByAssistant } = await supabase
        .from('agents')
        .select('id, user_id')
        .eq('vapi_assistant_id', call.assistantId)
        .maybeSingle();
      agent = agentByAssistant;
    }
    
    if (!agent && call.phoneNumber?.number) {
      const { data: agentByPhone } = await supabase
        .from('agents')
        .select('id, user_id')
        .eq('phone_number', call.phoneNumber.number)
        .maybeSingle();
      agent = agentByPhone;
    }

    if (!agent) {
      console.error('No agent found for assistant:', call.assistantId, 'or phone:', call.phoneNumber?.number);
      return new Response(
        JSON.stringify({ success: false, error: 'Agent not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine call outcome from analysis or default
    let outcome = 'other';
    if (call.analysis?.successEvaluation) {
      const evaluation = call.analysis.successEvaluation.toLowerCase();
      if (evaluation.includes('appointment') || evaluation.includes('booked')) {
        outcome = 'appointment_booked';
      } else if (evaluation.includes('lead') || evaluation.includes('qualified')) {
        outcome = 'lead_qualified';
      } else if (evaluation.includes('information')) {
        outcome = 'information_provided';
      } else if (evaluation.includes('callback')) {
        outcome = 'callback_scheduled';
      }
    }

    // Insert call log
    const { data: callLog, error: insertError } = await supabase
      .from('call_logs')
      .insert({
        agent_id: agent.id,
        user_id: agent.user_id,
        vapi_call_id: call.id,
        caller_name: call.customer?.name || null,
        caller_phone: call.customer?.number || null,
        call_start: call.startedAt,
        call_end: call.endedAt || null,
        duration_seconds: call.duration || 0,
        outcome: outcome,
        transcript: call.transcript || null,
        recording_url: call.recordingUrl || null,
        summary: call.summary || null,
        extracted_data: call.analysis?.structuredData || {},
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting call log:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Call log created:', callLog.id);

    // Usage tracking is updated automatically by the trigger

    return new Response(
      JSON.stringify({ success: true, callLogId: callLog.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
