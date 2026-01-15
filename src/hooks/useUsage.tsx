import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Database } from '@/integrations/supabase/types';

type UsageTracking = Database['public']['Tables']['usage_tracking']['Row'];

export const useUsage = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['usage', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      // Get current billing period (start of current month)
      const now = new Date();
      const billingStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('billing_period_start', billingStart)
        .maybeSingle();

      if (error) throw error;
      
      // Return defaults if no usage record exists
      if (!data) {
        return {
          total_calls: 0,
          total_minutes: 0,
          included_minutes_used: 0,
          overage_minutes: 0,
          overage_charges: 0,
          appointments_booked: 0,
          leads_qualified: 0,
        } as Partial<UsageTracking>;
      }
      
      return data as UsageTracking;
    },
    enabled: !!user?.id,
  });
};
