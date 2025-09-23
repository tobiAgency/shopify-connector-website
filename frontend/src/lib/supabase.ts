import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wzigrfhacakwysrqnohf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aWdyZmhhY2Frd3lzcnFub2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NjA3MTMsImV4cCI6MjA3NDIzNjcxM30.GbhS2EQwktEwpSotjR8UrtOEIj6q53BoopmCb66FB5g'

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
