import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ASSISTANT_TEMPLATES = {
  real_estate: {
    name: 'Real Estate AI Receptionist',
    firstMessage: "Hello! Thank you for calling. I'm your AI assistant for property inquiries. How can I help you today?",
    systemPrompt: `You are a professional real estate AI receptionist. Your goals are to:
1. Greet callers warmly and professionally
2. Understand their property needs (buying, selling, renting, viewing)
3. Collect their name, phone number, and email
4. Schedule property viewings or callbacks with the agent
5. Answer basic questions about available properties
6. Always be helpful, patient, and professional
Always collect: caller's full name, phone number, and what they're looking for.`,
  },
  beauty_aesthetics: {
    name: 'Beauty Salon AI Receptionist',
    firstMessage: "Hi there! Thank you for calling. I'm here to help you book appointments and answer questions. How can I assist you today?",
    systemPrompt: `You are a friendly beauty salon AI receptionist. Your goals are to:
1. Greet callers warmly
2. Help them book appointments for services (hair, nails, facials, etc.)
3. Collect their name, phone number, and preferred appointment time
4. Provide information about services and pricing if known
5. Handle rescheduling and cancellation requests
6. Be friendly, upbeat, and professional
Always collect: caller's full name, phone number, service needed, and preferred time.`,
  },
  dental: {
    name: 'Dental Clinic AI Receptionist',
    firstMessage: "Hello, thank you for calling the dental clinic. How may I help you today?",
    systemPrompt: `You are a professional dental clinic AI receptionist. Your goals are to:
1. Greet patients professionally and warmly
2. Help schedule dental appointments (checkups, cleanings, emergencies)
3. Collect patient name, phone number, and reason for visit
4. Triage urgent dental issues appropriately
5. Provide basic information about services
6. Be calm, reassuring, and professional
For dental emergencies, collect details and assure them someone will call back urgently.
Always collect: patient's full name, phone number, and reason for appointment.`,
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const vapiApiKey = Deno.env.get('VAPI_API_KEY');
    if (!vapiApiKey) {
      throw new Error('VAPI_API_KEY not configured');
    }

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { vertical, agentName, greetingMessage } = await req.json();

    // Get template for vertical
    const template = ASSISTANT_TEMPLATES[vertical as keyof typeof ASSISTANT_TEMPLATES];
    if (!template) {
      throw new Error('Invalid vertical. Must be: real_estate, beauty_aesthetics, or dental');
    }

    console.log('Creating Vapi assistant for user:', user.id, 'vertical:', vertical);

    // Create assistant in Vapi
    const assistantResponse = await fetch('https://api.vapi.ai/assistant', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vapiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: agentName || template.name,
        firstMessage: greetingMessage || template.firstMessage,
        model: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          messages: [{
            role: 'system',
            content: template.systemPrompt
          }],
          temperature: 0.7,
        },
        voice: {
          provider: 'vapi',
          voiceId: 'Elliot',
        },
        serverUrl: `${supabaseUrl}/functions/v1/handle-vapi-webhook`,
        endCallFunctionEnabled: true,
        recordingEnabled: true,
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en',
        },
        silenceTimeoutSeconds: 30,
        maxDurationSeconds: 600,
        backgroundSound: 'office',
        backchannelingEnabled: true,
        backgroundDenoisingEnabled: true,
      }),
    });

    if (!assistantResponse.ok) {
      const errorText = await assistantResponse.text();
      console.error('Vapi assistant creation failed:', errorText);
      throw new Error(`Failed to create assistant: ${errorText}`);
    }

    const assistant = await assistantResponse.json();
    console.log('Created Vapi assistant:', assistant.id);

    // Buy phone number from Vapi
    const phoneResponse = await fetch('https://api.vapi.ai/phone-number', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vapiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId: assistant.id,
        provider: 'twilio',
        numberDesiredAreaCode: '415',
      }),
    });

    let phoneNumber = null;

    if (phoneResponse.ok) {
      const phoneData = await phoneResponse.json();
      phoneNumber = phoneData.number || phoneData.phoneNumber;
      console.log('Provisioned phone number:', phoneNumber);
    } else {
      const phoneError = await phoneResponse.text();
      console.error('Phone provisioning failed:', phoneError);
      // Continue without phone - user can add later
    }

    // Save to database
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user already has an agent
    const { data: existingAgent } = await adminSupabase
      .from('agents')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    const agentData = {
      user_id: user.id,
      vapi_assistant_id: assistant.id,
      phone_number: phoneNumber,
      vertical: vertical,
      agent_name: agentName || template.name,
      greeting_message: greetingMessage || template.firstMessage,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    let dbResult;
    if (existingAgent) {
      dbResult = await adminSupabase
        .from('agents')
        .update(agentData)
        .eq('id', existingAgent.id)
        .select()
        .single();
    } else {
      dbResult = await adminSupabase
        .from('agents')
        .insert(agentData)
        .select()
        .single();
    }

    if (dbResult.error) {
      console.error('Database error:', dbResult.error);
    }

    // Update profile onboarding status
    await adminSupabase
      .from('profiles')
      .update({ 
        onboarding_completed: true,
        onboarding_step: 3
      })
      .eq('id', user.id);

    return new Response(JSON.stringify({
      success: true,
      assistantId: assistant.id,
      phoneNumber: phoneNumber,
      agentName: agentData.agent_name,
      message: phoneNumber 
        ? 'Your AI receptionist is live! Call the number to test it.'
        : 'Assistant created. Phone number pending - please contact support.',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error creating Vapi assistant:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
