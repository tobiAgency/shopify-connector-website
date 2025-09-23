import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lgjmpmacuyfauwztwkuj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnam1wbWFjdXlmYXV3enR3a3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDUxNDMsImV4cCI6MjA2ODg4MTE0M30.Ej0g0MOfcaM2Hd5GO8LsowkZT04BUeP2ptLMThTN2-I'

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
