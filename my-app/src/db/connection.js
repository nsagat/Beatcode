// src/lib/connection.js or src/connection.js

import { createClient } from '@supabase/supabase-js'

// Get these from your Supabase project settings
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Optional: Helper function to test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('users') // Replace with your actual table name
      .select('*')
      .limit(1)
    
    if (error) throw error
    
    console.log('✅ Supabase connection successful!')
    console.log('Sample data:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    return { success: false, error: error.message }
  }
}