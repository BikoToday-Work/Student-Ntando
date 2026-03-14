import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_user_id: string | null;
          email: string;
          name: string;
          role: string;
          country: string;
          timezone: string;
          avatar: string | null;
          mfa_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      competitions: {
        Row: {
          id: string;
          name: string;
          season: string;
          status: string;
          start_date: string;
          end_date: string;
          participating_nations: number;
          total_teams: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['competitions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['competitions']['Insert']>;
      };
      teams: {
        Row: {
          id: string;
          name: string;
          country: string;
          flag: string;
          played: number;
          won: number;
          drawn: number;
          lost: number;
          goals_for: number;
          goals_against: number;
          points: number;
          form: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['teams']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['teams']['Insert']>;
      };
      matches: {
        Row: {
          id: string;
          competition: string;
          round: string;
          home_team: string;
          away_team: string;
          home_flag: string;
          away_flag: string;
          home_score: number | null;
          away_score: number | null;
          status: string;
          kickoff_utc: string;
          venue: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['matches']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['matches']['Insert']>;
      };
      referees: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          country: string;
          flag: string;
          grade: string;
          matches_officiated: number;
          rating: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['referees']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['referees']['Insert']>;
      };
      players: {
        Row: {
          id: string;
          name: string;
          team: string;
          country: string;
          flag: string;
          position: string;
          age: number;
          goals: number;
          assists: number;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['players']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['players']['Insert']>;
      };
      disciplinary_cases: {
        Row: {
          id: string;
          case_number: string;
          player_name: string;
          team: string;
          incident: string;
          severity: string;
          status: string;
          match_id: string | null;
          reported_date: string;
          resolution_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['disciplinary_cases']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['disciplinary_cases']['Insert']>;
      };
      secretariat_tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          assigned_to: string;
          priority: string;
          status: string;
          due_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['secretariat_tasks']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['secretariat_tasks']['Insert']>;
      };
      referee_assignments: {
        Row: {
          id: string;
          match_id: string;
          referee_id: string;
          assignment_status: string;
          assigned_at: string;
          responded_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['referee_assignments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['referee_assignments']['Insert']>;
      };
      match_reports: {
        Row: {
          id: string;
          match_id: string;
          referee_id: string;
          report_status: string;
          match_summary: string | null;
          incidents: string | null;
          yellow_cards: number;
          red_cards: number;
          penalties: number;
          injuries: string | null;
          additional_notes: string | null;
          submitted_at: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['match_reports']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['match_reports']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          action: string;
          module: string;
          details: string;
          ip_address: string;
          timestamp_utc: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
      };
    };
  };
};
