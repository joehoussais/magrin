import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          name: string
          emoji: string
          weight: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          emoji: string
          weight: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          emoji?: string
          weight?: number
          created_at?: string
        }
      }
      people: {
        Row: {
          id: string
          name: string
          team_id: string | null
          emoji: string | null
          bio: string | null
          ratings: any
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          team_id?: string | null
          emoji?: string | null
          bio?: string | null
          ratings?: any
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          team_id?: string | null
          emoji?: string | null
          bio?: string | null
          ratings?: any
          created_at?: string
        }
      }
      scores: {
        Row: {
          id: string
          team_id: string
          event_id: string
          points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_id: string
          event_id: string
          points: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          event_id?: string
          points?: number
          created_at?: string
          updated_at?: string
        }
      }
      map_markers: {
        Row: {
          id: string
          name: string
          emoji: string | null
          type: string | null
          description: string | null
          x: number
          y: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          emoji?: string | null
          type?: string | null
          description?: string | null
          x: number
          y: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          emoji?: string | null
          type?: string | null
          description?: string | null
          x?: number
          y?: number
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          name: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          text?: string
          created_at?: string
        }
      }

      app_settings: {
        Row: {
          id: string
          key: string
          value: any
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          value: any
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: any
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          role: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          name?: string
          created_at?: string
        }
      }
    }
  }
}
