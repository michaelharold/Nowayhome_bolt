import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          home_country: string
          movie_genre: string
          wishlist_destinations: string[]
          favorite_foods: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          home_country: string
          movie_genre: string
          wishlist_destinations: string[]
          favorite_foods: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          home_country?: string
          movie_genre?: string
          wishlist_destinations?: string[]
          favorite_foods?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          booking_type: 'outbound' | 'return' | 'movie'
          from_location: string | null
          to_location: string | null
          departure_date: string | null
          return_date: string | null
          movie_title: string | null
          movie_genre: string | null
          movie_date: string | null
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          booking_type: 'outbound' | 'return' | 'movie'
          from_location?: string | null
          to_location?: string | null
          departure_date?: string | null
          return_date?: string | null
          movie_title?: string | null
          movie_genre?: string | null
          movie_date?: string | null
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          booking_type?: 'outbound' | 'return' | 'movie'
          from_location?: string | null
          to_location?: string | null
          departure_date?: string | null
          return_date?: string | null
          movie_title?: string | null
          movie_genre?: string | null
          movie_date?: string | null
          price?: number
          created_at?: string
        }
      }
    }
  }
}