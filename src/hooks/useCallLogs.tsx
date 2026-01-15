import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEffect } from 'react';
import { Database } from '@/integrations/supabase/types';

type CallLog = Database['public']['Tables']['call_logs']['Row'];
type CallLogUpdate = Database['public']['Tables']['call_logs']['Update'];
type CallOutcome = Database['public']['Enums']['call_outcome'];

export const useCallLogs = (filters?: { outcome?: string; limit?: number }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['call_logs', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let queryBuilder = supabase
        .from('call_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filters?.outcome && filters.outcome !== 'all') {
        queryBuilder = queryBuilder.eq('outcome', filters.outcome as CallOutcome);
      }

      if (filters?.limit) {
        queryBuilder = queryBuilder.limit(filters.limit);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      return data as CallLog[];
    },
    enabled: !!user?.id,
  });

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('call_logs_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_logs',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['call_logs', user.id] });
          queryClient.invalidateQueries({ queryKey: ['usage', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return query;
};

export const useUpdateCallLog = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: CallLogUpdate }) => {
      const { data, error } = await supabase
        .from('call_logs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call_logs', user?.id] });
    },
  });
};
