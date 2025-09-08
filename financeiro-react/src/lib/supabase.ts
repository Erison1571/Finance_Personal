import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          color: string;
          kind: 'Despesa' | 'Receita';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          kind: 'Despesa' | 'Receita';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          kind?: 'Despesa' | 'Receita';
          created_at?: string;
          updated_at?: string;
        };
      };
      types: {
        Row: {
          id: string;
          name: string;
          category_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          kind: 'Despesa';
          category_id: string;
          type_id: string;
          value: number;
          date_prevista: string;
          date_efetiva?: string;
          obs?: string;
          is_mensal?: boolean;
          series_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kind?: 'Despesa';
          category_id: string;
          type_id: string;
          value: number;
          date_prevista: string;
          date_efetiva?: string;
          obs?: string;
          is_mensal?: boolean;
          series_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kind?: 'Despesa';
          category_id?: string;
          type_id?: string;
          value?: number;
          date_prevista?: string;
          date_efetiva?: string;
          obs?: string;
          is_mensal?: boolean;
          series_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      incomes: {
        Row: {
          id: string;
          kind: 'Receita';
          category_id: string;
          type_id: string;
          value: number;
          date_prevista: string;
          date_efetiva?: string;
          obs?: string;
          is_mensal?: boolean;
          series_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kind?: 'Receita';
          category_id: string;
          type_id: string;
          value: number;
          date_prevista: string;
          date_efetiva?: string;
          obs?: string;
          is_mensal?: boolean;
          series_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kind?: 'Receita';
          category_id?: string;
          type_id?: string;
          value?: number;
          date_prevista?: string;
          date_efetiva?: string;
          obs?: string;
          is_mensal?: boolean;
          series_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
