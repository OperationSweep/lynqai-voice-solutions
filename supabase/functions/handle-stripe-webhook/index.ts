import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

// Stripe config with price -> tier mapping
const STRIPE_CONFIG = {
  prices: {
    'price_1SpqGEAYzPmLnFINRiENSURP': { tier: 'starter', included_minutes: 200 },
    'price_1SpqGNAYzPmLnFINVFpvXaf2': { tier: 'professional', included_minutes: 600 },
    'price_1SpqGWAYzPmLnFINiaQJGdlm': { tier: 'growth', included_minutes: 1500 },
  },
  overage_rate: 0.35,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (stripeWebhookSecret && signature) {
      try {
        event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // For testing without signature verification
      event = JSON.parse(body);
    }

    console.log('Received Stripe event:', event.type);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);

        if (session.mode !== 'subscription') {
          console.log('Not a subscription checkout, skipping');
          break;
        }

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const userId = session.client_reference_id;

        if (!userId) {
          console.error('No client_reference_id in session');
          break;
        }

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;
        const config = STRIPE_CONFIG.prices[priceId as keyof typeof STRIPE_CONFIG.prices];

        if (!config) {
          console.error('Unknown price ID:', priceId);
          break;
        }

        // Update profile with subscription info
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            subscription_id: subscriptionId,
            subscription_tier: config.tier,
            subscription_status: 'active',
            included_minutes: config.included_minutes,
            overage_rate: STRIPE_CONFIG.overage_rate,
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating profile:', updateError);
        } else {
          console.log('Profile updated for user:', userId);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        console.log('Invoice paid for customer:', customerId);

        // Keep subscription active
        const { error } = await supabase
          .from('profiles')
          .update({ subscription_status: 'active' })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error updating subscription status:', error);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        console.log('Invoice payment failed for customer:', customerId);

        // Set subscription to past_due
        const { error } = await supabase
          .from('profiles')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error updating subscription status:', error);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        console.log('Subscription deleted for customer:', customerId);

        // Set subscription to canceled
        const { error } = await supabase
          .from('profiles')
          .update({ 
            subscription_status: 'canceled',
            subscription_id: null,
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error updating subscription status:', error);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        console.log('Subscription updated for customer:', customerId);

        // Get new tier from price
        const priceId = subscription.items.data[0]?.price.id;
        const config = STRIPE_CONFIG.prices[priceId as keyof typeof STRIPE_CONFIG.prices];

        if (config) {
          let status: 'active' | 'inactive' | 'past_due' | 'canceled' = 'active';
          if (subscription.status === 'past_due') status = 'past_due';
          if (subscription.status === 'canceled') status = 'canceled';
          if (subscription.status === 'unpaid') status = 'past_due';

          const { error } = await supabase
            .from('profiles')
            .update({ 
              subscription_tier: config.tier,
              subscription_status: status,
              included_minutes: config.included_minutes,
            })
            .eq('stripe_customer_id', customerId);

          if (error) {
            console.error('Error updating subscription:', error);
          }
        }
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
