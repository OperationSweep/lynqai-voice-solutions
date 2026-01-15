-- Create enums for the application
CREATE TYPE public.subscription_tier AS ENUM ('starter', 'professional', 'growth');
CREATE TYPE public.subscription_status AS ENUM ('active', 'inactive', 'past_due', 'canceled');
CREATE TYPE public.vertical_type AS ENUM ('real_estate', 'beauty_aesthetics', 'dental');
CREATE TYPE public.call_outcome AS ENUM (
  'appointment_booked', 
  'lead_qualified', 
  'information_provided', 
  'callback_scheduled', 
  'missed', 
  'voicemail', 
  'transferred', 
  'other'
);

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  business_name TEXT,
  business_address TEXT,
  business_phone TEXT,
  stripe_customer_id TEXT UNIQUE,
  subscription_tier public.subscription_tier DEFAULT 'starter',
  subscription_status public.subscription_status DEFAULT 'inactive',
  subscription_id TEXT,
  included_minutes INTEGER DEFAULT 200,
  overage_rate DECIMAL(5,2) DEFAULT 0.35,
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ============================================
-- AGENTS TABLE
-- ============================================
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_name TEXT DEFAULT 'AI Receptionist',
  vertical public.vertical_type,
  phone_number TEXT UNIQUE,
  vapi_assistant_id TEXT UNIQUE,
  open_time TIME DEFAULT '09:00',
  close_time TIME DEFAULT '17:00',
  open_weekends BOOLEAN DEFAULT false,
  timezone TEXT DEFAULT 'America/New_York',
  greeting_message TEXT,
  after_hours_message TEXT,
  collect_caller_info BOOLEAN DEFAULT true,
  send_sms_confirmation BOOLEAN DEFAULT true,
  emergency_transfer_number TEXT,
  calendar_link TEXT,
  calendar_provider TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own agents" 
  ON public.agents FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agents" 
  ON public.agents FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" 
  ON public.agents FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents" 
  ON public.agents FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- CALL_LOGS TABLE
-- ============================================
CREATE TABLE public.call_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vapi_call_id TEXT UNIQUE,
  caller_name TEXT,
  caller_phone TEXT,
  caller_email TEXT,
  call_start TIMESTAMP WITH TIME ZONE NOT NULL,
  call_end TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  outcome public.call_outcome,
  outcome_notes TEXT,
  transcript TEXT,
  recording_url TEXT,
  summary TEXT,
  extracted_data JSONB DEFAULT '{}',
  appointment_time TIMESTAMP WITH TIME ZONE,
  appointment_confirmed BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own call logs" 
  ON public.call_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own call logs" 
  ON public.call_logs FOR UPDATE 
  USING (auth.uid() = user_id);

-- ============================================
-- USAGE_TRACKING TABLE
-- ============================================
CREATE TABLE public.usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  total_calls INTEGER DEFAULT 0,
  total_minutes DECIMAL(10,2) DEFAULT 0,
  included_minutes_used DECIMAL(10,2) DEFAULT 0,
  overage_minutes DECIMAL(10,2) DEFAULT 0,
  overage_charges DECIMAL(10,2) DEFAULT 0,
  appointments_booked INTEGER DEFAULT 0,
  leads_qualified INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, billing_period_start)
);

ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage" 
  ON public.usage_tracking FOR SELECT 
  USING (auth.uid() = user_id);

-- ============================================
-- INTEGRATIONS TABLE
-- ============================================
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, provider)
);

ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own integrations" 
  ON public.integrations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integrations" 
  ON public.integrations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations" 
  ON public.integrations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations" 
  ON public.integrations FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at on all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON public.usage_tracking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- AUTO-UPDATE USAGE ON NEW CALL LOG
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_call_log()
RETURNS TRIGGER AS $$
DECLARE
  billing_start DATE;
  billing_end DATE;
  user_included_minutes INTEGER;
  user_overage_rate DECIMAL;
  current_total_minutes DECIMAL;
  new_call_minutes DECIMAL;
  new_included_used DECIMAL;
  new_overage DECIMAL;
  new_overage_charges DECIMAL;
BEGIN
  -- Get current billing period (start of current month)
  billing_start := date_trunc('month', CURRENT_DATE)::DATE;
  billing_end := (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  
  -- Get user's included minutes and overage rate
  SELECT included_minutes, overage_rate 
  INTO user_included_minutes, user_overage_rate
  FROM public.profiles 
  WHERE id = NEW.user_id;
  
  -- Default values if not found
  user_included_minutes := COALESCE(user_included_minutes, 200);
  user_overage_rate := COALESCE(user_overage_rate, 0.35);
  
  -- Calculate call minutes
  new_call_minutes := CEIL(COALESCE(NEW.duration_seconds, 0)::DECIMAL / 60);
  
  -- Insert or update usage_tracking
  INSERT INTO public.usage_tracking (
    user_id, 
    billing_period_start, 
    billing_period_end,
    total_calls,
    total_minutes,
    included_minutes_used,
    overage_minutes,
    overage_charges,
    appointments_booked,
    leads_qualified
  )
  VALUES (
    NEW.user_id,
    billing_start,
    billing_end,
    1,
    new_call_minutes,
    LEAST(new_call_minutes, user_included_minutes),
    GREATEST(0, new_call_minutes - user_included_minutes),
    GREATEST(0, (new_call_minutes - user_included_minutes) * user_overage_rate),
    CASE WHEN NEW.outcome = 'appointment_booked' THEN 1 ELSE 0 END,
    CASE WHEN NEW.outcome = 'lead_qualified' THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, billing_period_start) DO UPDATE SET
    total_calls = usage_tracking.total_calls + 1,
    total_minutes = usage_tracking.total_minutes + new_call_minutes,
    included_minutes_used = LEAST(usage_tracking.total_minutes + new_call_minutes, user_included_minutes),
    overage_minutes = GREATEST(0, usage_tracking.total_minutes + new_call_minutes - user_included_minutes),
    overage_charges = GREATEST(0, (usage_tracking.total_minutes + new_call_minutes - user_included_minutes) * user_overage_rate),
    appointments_booked = usage_tracking.appointments_booked + CASE WHEN NEW.outcome = 'appointment_booked' THEN 1 ELSE 0 END,
    leads_qualified = usage_tracking.leads_qualified + CASE WHEN NEW.outcome = 'lead_qualified' THEN 1 ELSE 0 END,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_call_log_inserted
  AFTER INSERT ON public.call_logs
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_call_log();

-- ============================================
-- ENABLE REALTIME FOR CALL LOGS
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.call_logs;