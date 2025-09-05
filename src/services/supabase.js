import { createClient } from '@supabase/supabase-js'
import { API_CONFIG } from '../config/api.js'

// Initialize Supabase client
export const supabase = createClient(
  API_CONFIG.supabase.url || 'https://placeholder.supabase.co',
  API_CONFIG.supabase.anonKey || 'placeholder-key'
)

// Database schema types for TypeScript-like documentation
export const DATABASE_SCHEMA = {
  users: {
    user_id: 'uuid',
    email: 'text',
    password_hash: 'text',
    subscription_status: 'text', // 'free' | 'premium'
    preferred_state: 'text',
    created_at: 'timestamp'
  },
  state_laws: {
    state_name: 'text',
    rights_summary: 'text',
    script_guidance_english: 'jsonb',
    script_guidance_spanish: 'jsonb',
    common_pitfalls: 'text[]'
  },
  incident_reports: {
    report_id: 'uuid',
    user_id: 'uuid',
    timestamp: 'timestamp',
    location: 'jsonb',
    notes: 'text',
    recording_url: 'text',
    shared_at: 'timestamp'
  }
}

// Auth helpers
export const authHelpers = {
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const dbHelpers = {
  // User operations
  createUserProfile: async (userId, profileData) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        user_id: userId,
        ...profileData
      }])
    return { data, error }
  },

  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
    return { data, error }
  },

  // State laws operations
  getStateLaws: async (stateName) => {
    const { data, error } = await supabase
      .from('state_laws')
      .select('*')
      .eq('state_name', stateName)
      .single()
    return { data, error }
  },

  getAllStates: async () => {
    const { data, error } = await supabase
      .from('state_laws')
      .select('state_name')
      .order('state_name')
    return { data, error }
  },

  // Incident reports operations
  createIncidentReport: async (reportData) => {
    const { data, error } = await supabase
      .from('incident_reports')
      .insert([reportData])
    return { data, error }
  },

  getUserIncidentReports: async (userId) => {
    const { data, error } = await supabase
      .from('incident_reports')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
    return { data, error }
  },

  updateIncidentReport: async (reportId, updates) => {
    const { data, error } = await supabase
      .from('incident_reports')
      .update(updates)
      .eq('report_id', reportId)
    return { data, error }
  },

  deleteIncidentReport: async (reportId) => {
    const { data, error } = await supabase
      .from('incident_reports')
      .delete()
      .eq('report_id', reportId)
    return { data, error }
  }
}
