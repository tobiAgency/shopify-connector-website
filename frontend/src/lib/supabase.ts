import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Course {
  id: number
  title: string
  description: string
  price: number
  image_url: string
  category: string
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  author: string
  published_at: string
  created_at: string
  updated_at: string
}

export interface Resource {
  id: number
  title: string
  description: string
  file_url: string
  category: string
  created_at: string
  updated_at: string
}
