/**
 * Supabase Database Type Definitions
 * 
 * Bu dosya Supabase CLI ile otomatik olarak generate edilebilir:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/database.types.ts
 * 
 * Şu an boş bir şablon olarak bırakıyoruz.
 * Tablolarını oluşturduktan sonra güncelleyeceğiz.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Örnek tablo tanımı:
      // profiles: {
      //   Row: {
      //     id: string;
      //     email: string;
      //     full_name: string | null;
      //     avatar_url: string | null;
      //     created_at: string;
      //     updated_at: string;
      //   };
      //   Insert: {
      //     id: string;
      //     email: string;
      //     full_name?: string | null;
      //     avatar_url?: string | null;
      //     created_at?: string;
      //     updated_at?: string;
      //   };
      //   Update: {
      //     id?: string;
      //     email?: string;
      //     full_name?: string | null;
      //     avatar_url?: string | null;
      //     created_at?: string;
      //     updated_at?: string;
      //   };
      //   Relationships: [];
      // };
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: unknown[];
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
        Relationships: unknown[];
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      [key: string]: string;
    };
    CompositeTypes: {
      [key: string]: unknown;
    };
  };
}

// Helper type'lar - Tablolardan kolay tip çıkarma
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
