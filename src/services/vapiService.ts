import { supabase } from '@/integrations/supabase/client';

export type VerticalType = 'real_estate' | 'beauty_aesthetics' | 'dental';

interface CreateAssistantParams {
  vertical: VerticalType;
  agentName?: string;
  greetingMessage?: string;
}

interface CreateAssistantResponse {
  success: boolean;
  assistantId?: string;
  phoneNumber?: string;
  agentName?: string;
  message?: string;
  error?: string;
}

export const vapiService = {
  async createAssistant(params: CreateAssistantParams): Promise<CreateAssistantResponse> {
    const { data, error } = await supabase.functions.invoke('create-vapi-assistant', {
      body: params,
    });

    if (error) {
      console.error('Error creating assistant:', error);
      return { success: false, error: error.message };
    }

    return data;
  },

  async getAgent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching agent:', error);
      return null;
    }

    return data;
  },
};
