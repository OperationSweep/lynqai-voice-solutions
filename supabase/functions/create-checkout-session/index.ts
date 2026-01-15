import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Stripe pricing configuration
const STRIPE_CONFIG = {
  products: {
    starter: {
      product_id: 'prod_TnR8QBpeaPrMv5',
      price_id: 'price_1SpqGEAYzPmLnFINRiENSURP',
      amount: 97,
      included_minutes: 200
    },
    professional: {
      product_id: 'prod_TnR8XVZK4NySOE',
      price_id: 'price_1SpqGNAYzPmLnFINVFpvXaf2',
      amount: 297,
      included_minutes: 600
    },
    growth: {
      product_id: 'prod_TnR88svazsAGlH',
      price_id: 'price_1SpqGWAYzPmLnFINiaQJGdlm',
      amount: 597,
      included_minutes: 1500
    }
  },
  overage_rate: 0.35
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Get the user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { tier, successUrl, cancelUrl } = await req.json();

    if (!tier || !['starter', 'professional', 'growth'].includes(tier)) {
      return new Response(
        JSON.stringify({ error: 'Invalid tier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const product = STRIPE_CONFIG.products[tier as keyof typeof STRIPE_CONFIG.products];

    // Check if user already has a Stripe customer
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    // Create or get Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || profile?.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: 'subscription',
      line_items: [
        {
          price: product.price_id,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.get('origin')}/dashboard?checkout=success`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/pricing?checkout=canceled`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          tier: tier,
        },
      },
    });

    console.log('Created checkout session:', session.id, 'for user:', user.id);

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
