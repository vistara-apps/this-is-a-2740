// API Configuration
export const API_CONFIG = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    baseUrl: 'https://api.openai.com/v1',
  },
  pinata: {
    apiKey: import.meta.env.VITE_PINATA_API_KEY,
    secretKey: import.meta.env.VITE_PINATA_SECRET_API_KEY,
    baseUrl: 'https://api.pinata.cloud',
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'KnowYourRights AI',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  }
}

// Validate required environment variables
export const validateConfig = () => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ]
  
  const missing = required.filter(key => !import.meta.env[key])
  
  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing)
    return false
  }
  
  return true
}
