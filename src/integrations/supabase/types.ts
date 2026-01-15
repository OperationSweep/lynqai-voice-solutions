export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          after_hours_message: string | null
          agent_name: string | null
          calendar_link: string | null
          calendar_provider: string | null
          close_time: string | null
          collect_caller_info: boolean | null
          created_at: string
          emergency_transfer_number: string | null
          greeting_message: string | null
          id: string
          is_active: boolean | null
          open_time: string | null
          open_weekends: boolean | null
          phone_number: string | null
          send_sms_confirmation: boolean | null
          timezone: string | null
          updated_at: string
          user_id: string
          vapi_assistant_id: string | null
          vertical: Database["public"]["Enums"]["vertical_type"] | null
        }
        Insert: {
          after_hours_message?: string | null
          agent_name?: string | null
          calendar_link?: string | null
          calendar_provider?: string | null
          close_time?: string | null
          collect_caller_info?: boolean | null
          created_at?: string
          emergency_transfer_number?: string | null
          greeting_message?: string | null
          id?: string
          is_active?: boolean | null
          open_time?: string | null
          open_weekends?: boolean | null
          phone_number?: string | null
          send_sms_confirmation?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          vapi_assistant_id?: string | null
          vertical?: Database["public"]["Enums"]["vertical_type"] | null
        }
        Update: {
          after_hours_message?: string | null
          agent_name?: string | null
          calendar_link?: string | null
          calendar_provider?: string | null
          close_time?: string | null
          collect_caller_info?: boolean | null
          created_at?: string
          emergency_transfer_number?: string | null
          greeting_message?: string | null
          id?: string
          is_active?: boolean | null
          open_time?: string | null
          open_weekends?: boolean | null
          phone_number?: string | null
          send_sms_confirmation?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          vapi_assistant_id?: string | null
          vertical?: Database["public"]["Enums"]["vertical_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      call_logs: {
        Row: {
          agent_id: string
          appointment_confirmed: boolean | null
          appointment_time: string | null
          call_end: string | null
          call_start: string
          caller_email: string | null
          caller_name: string | null
          caller_phone: string | null
          created_at: string
          duration_seconds: number | null
          extracted_data: Json | null
          id: string
          is_read: boolean | null
          is_starred: boolean | null
          outcome: Database["public"]["Enums"]["call_outcome"] | null
          outcome_notes: string | null
          recording_url: string | null
          summary: string | null
          transcript: string | null
          user_id: string
          vapi_call_id: string | null
        }
        Insert: {
          agent_id: string
          appointment_confirmed?: boolean | null
          appointment_time?: string | null
          call_end?: string | null
          call_start: string
          caller_email?: string | null
          caller_name?: string | null
          caller_phone?: string | null
          created_at?: string
          duration_seconds?: number | null
          extracted_data?: Json | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          outcome?: Database["public"]["Enums"]["call_outcome"] | null
          outcome_notes?: string | null
          recording_url?: string | null
          summary?: string | null
          transcript?: string | null
          user_id: string
          vapi_call_id?: string | null
        }
        Update: {
          agent_id?: string
          appointment_confirmed?: boolean | null
          appointment_time?: string | null
          call_end?: string | null
          call_start?: string
          caller_email?: string | null
          caller_name?: string | null
          caller_phone?: string | null
          created_at?: string
          duration_seconds?: number | null
          extracted_data?: Json | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          outcome?: Database["public"]["Enums"]["call_outcome"] | null
          outcome_notes?: string | null
          recording_url?: string | null
          summary?: string | null
          transcript?: string | null
          user_id?: string
          vapi_call_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          access_token: string | null
          config: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          provider: string
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_address: string | null
          business_name: string | null
          business_phone: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          included_minutes: number | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          overage_rate: number | null
          phone: string | null
          stripe_customer_id: string | null
          subscription_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string
        }
        Insert: {
          business_address?: string | null
          business_name?: string | null
          business_phone?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          included_minutes?: number | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          overage_rate?: number | null
          phone?: string | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
        }
        Update: {
          business_address?: string | null
          business_name?: string | null
          business_phone?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          included_minutes?: number | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          overage_rate?: number | null
          phone?: string | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
        }
        Relationships: []
      }
      usage_tracking: {
        Row: {
          appointments_booked: number | null
          billing_period_end: string
          billing_period_start: string
          created_at: string
          id: string
          included_minutes_used: number | null
          leads_qualified: number | null
          overage_charges: number | null
          overage_minutes: number | null
          total_calls: number | null
          total_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointments_booked?: number | null
          billing_period_end: string
          billing_period_start: string
          created_at?: string
          id?: string
          included_minutes_used?: number | null
          leads_qualified?: number | null
          overage_charges?: number | null
          overage_minutes?: number | null
          total_calls?: number | null
          total_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointments_booked?: number | null
          billing_period_end?: string
          billing_period_start?: string
          created_at?: string
          id?: string
          included_minutes_used?: number | null
          leads_qualified?: number | null
          overage_charges?: number | null
          overage_minutes?: number | null
          total_calls?: number | null
          total_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      call_outcome:
        | "appointment_booked"
        | "lead_qualified"
        | "information_provided"
        | "callback_scheduled"
        | "missed"
        | "voicemail"
        | "transferred"
        | "other"
      subscription_status: "active" | "inactive" | "past_due" | "canceled"
      subscription_tier: "starter" | "professional" | "growth"
      vertical_type: "real_estate" | "beauty_aesthetics" | "dental"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      call_outcome: [
        "appointment_booked",
        "lead_qualified",
        "information_provided",
        "callback_scheduled",
        "missed",
        "voicemail",
        "transferred",
        "other",
      ],
      subscription_status: ["active", "inactive", "past_due", "canceled"],
      subscription_tier: ["starter", "professional", "growth"],
      vertical_type: ["real_estate", "beauty_aesthetics", "dental"],
    },
  },
} as const
