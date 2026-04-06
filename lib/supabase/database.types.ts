export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      goals: {
        Row: {
          color_theme: string | null
          id: string
          progress_percentage: number | null
          title: string
          user_id: string
        }
        Insert: {
          color_theme?: string | null
          id?: string
          progress_percentage?: number | null
          title: string
          user_id: string
        }
        Update: {
          color_theme?: string | null
          id?: string
          progress_percentage?: number | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
      routines: {
        Row: {
          color_theme: string | null
          description: string | null
          difficulty: string | null
          duration_mins: number | null
          exercises: Json | null
          frequency_days: number | null
          goal: string | null
          id: string
          is_featured: boolean | null
          tags: string[] | null
          title: string
          user_id: string | null
        }
        Insert: {
          color_theme?: string | null
          description?: string | null
          difficulty?: string | null
          duration_mins?: number | null
          exercises?: Json | null
          frequency_days?: number | null
          goal?: string | null
          id?: string
          is_featured?: boolean | null
          tags?: string[] | null
          title: string
          user_id?: string | null
        }
        Update: {
          color_theme?: string | null
          description?: string | null
          difficulty?: string | null
          duration_mins?: number | null
          exercises?: Json | null
          frequency_days?: number | null
          goal?: string | null
          id?: string
          is_featured?: boolean | null
          tags?: string[] | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          active_heart_rate_bpm: number | null
          daily_streak: number | null
          energy_expenditure_kcal: number | null
          updated_at: string | null
          user_id: string
          weekly_output_volume_lbs: Json | null
        }
        Insert: {
          active_heart_rate_bpm?: number | null
          daily_streak?: number | null
          energy_expenditure_kcal?: number | null
          updated_at?: string | null
          user_id: string
          weekly_output_volume_lbs?: Json | null
        }
        Update: {
          active_heart_rate_bpm?: number | null
          daily_streak?: number | null
          energy_expenditure_kcal?: number | null
          updated_at?: string | null
          user_id?: string
          weekly_output_volume_lbs?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof (DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never
