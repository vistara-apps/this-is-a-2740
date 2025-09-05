import React, { createContext, useContext, useState, useEffect } from 'react'
import { authHelpers, dbHelpers } from '../services/supabase.js'
import { stripeService } from '../services/stripe.js'
import { validateConfig } from '../config/api.js'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [selectedState, setSelectedState] = useState('California')
  const [subscriptionStatus, setSubscriptionStatus] = useState('free') // 'free' or 'premium'
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  // Initialize user session
  useEffect(() => {
    initializeUser()
    
    // Set up auth state listener
    const { data: { subscription } } = authHelpers.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await handleUserSignIn(session.user)
      } else if (event === 'SIGNED_OUT') {
        handleUserSignOut()
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const initializeUser = async () => {
    try {
      // Check if APIs are configured
      const isConfigValid = validateConfig()
      
      if (isConfigValid) {
        // Try to get current user from Supabase
        const { user: currentUser } = await authHelpers.getCurrentUser()
        if (currentUser) {
          await handleUserSignIn(currentUser)
        } else {
          // Fallback to localStorage for demo
          loadUserFromLocalStorage()
        }
      } else {
        // Fallback to localStorage if APIs not configured
        loadUserFromLocalStorage()
      }
    } catch (error) {
      console.error('Failed to initialize user:', error)
      loadUserFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  const loadUserFromLocalStorage = () => {
    const savedUser = localStorage.getItem('user')
    const savedSubscription = localStorage.getItem('subscription_status')
    const savedState = localStorage.getItem('selected_state')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    if (savedSubscription) {
      setSubscriptionStatus(savedSubscription)
    }
    if (savedState) {
      setSelectedState(savedState)
    }
  }

  const handleUserSignIn = async (supabaseUser) => {
    try {
      setUser(supabaseUser)
      
      // Get or create user profile
      const { data: userProfile, error } = await dbHelpers.getUserProfile(supabaseUser.id)
      
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const newProfile = {
          email: supabaseUser.email,
          subscription_status: 'free',
          preferred_state: 'California',
          created_at: new Date().toISOString()
        }
        
        await dbHelpers.createUserProfile(supabaseUser.id, newProfile)
        setProfile(newProfile)
        setSubscriptionStatus('free')
        setSelectedState('California')
      } else if (userProfile) {
        setProfile(userProfile)
        setSubscriptionStatus(userProfile.subscription_status || 'free')
        setSelectedState(userProfile.preferred_state || 'California')
      }
      
      // Save to localStorage as backup
      localStorage.setItem('user', JSON.stringify(supabaseUser))
      localStorage.setItem('subscription_status', userProfile?.subscription_status || 'free')
      localStorage.setItem('selected_state', userProfile?.preferred_state || 'California')
    } catch (error) {
      console.error('Error handling user sign in:', error)
    }
  }

  const handleUserSignOut = () => {
    setUser(null)
    setProfile(null)
    setSubscriptionStatus('free')
    setSelectedState('California')
    localStorage.removeItem('user')
    localStorage.removeItem('subscription_status')
    localStorage.removeItem('selected_state')
  }

  const login = async (email, password) => {
    try {
      const { data, error } = await authHelpers.signIn(email, password)
      if (error) throw error
      
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: error.message }
    }
  }

  const signup = async (email, password, userData = {}) => {
    try {
      const { data, error } = await authHelpers.signUp(email, password, userData)
      if (error) throw error
      
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Signup failed:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await authHelpers.signOut()
      handleUserSignOut()
      return { success: true }
    } catch (error) {
      console.error('Logout failed:', error)
      // Still clear local state even if API call fails
      handleUserSignOut()
      return { success: false, error: error.message }
    }
  }

  const updateSelectedState = async (newState) => {
    setSelectedState(newState)
    localStorage.setItem('selected_state', newState)
    
    // Update in database if user is authenticated
    if (user?.id) {
      try {
        await dbHelpers.updateUserProfile(user.id, { preferred_state: newState })
      } catch (error) {
        console.error('Failed to update preferred state:', error)
      }
    }
  }

  const updateSubscriptionStatus = async (newStatus) => {
    setSubscriptionStatus(newStatus)
    localStorage.setItem('subscription_status', newStatus)
    
    // Update in database if user is authenticated
    if (user?.id) {
      try {
        await dbHelpers.updateUserProfile(user.id, { subscription_status: newStatus })
      } catch (error) {
        console.error('Failed to update subscription status:', error)
      }
    }
  }

  const upgradeSubscription = async () => {
    try {
      const result = await stripeService.simulateUpgrade(user?.id)
      if (result.success) {
        await updateSubscriptionStatus('premium')
      }
      return result
    } catch (error) {
      console.error('Subscription upgrade failed:', error)
      return { success: false, error: error.message }
    }
  }

  const isFeatureAvailable = (feature) => {
    return stripeService.isFeatureAvailable(feature, subscriptionStatus)
  }

  const value = {
    user,
    profile,
    loading,
    selectedState,
    subscriptionStatus,
    login,
    signup,
    logout,
    setSelectedState: updateSelectedState,
    setSubscriptionStatus: updateSubscriptionStatus,
    upgradeSubscription,
    isFeatureAvailable
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
