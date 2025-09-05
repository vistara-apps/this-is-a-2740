import { loadStripe } from '@stripe/stripe-js'
import { API_CONFIG } from '../config/api.js'

// Initialize Stripe
let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(API_CONFIG.stripe.publishableKey)
  }
  return stripePromise
}

// Stripe service for subscription management
class StripeService {
  constructor() {
    this.stripe = null
    this.init()
  }

  async init() {
    try {
      this.stripe = await getStripe()
    } catch (error) {
      console.error('Failed to initialize Stripe:', error)
    }
  }

  // Create checkout session for subscription
  async createCheckoutSession(priceId, userId, successUrl, cancelUrl) {
    try {
      // In a real app, this would call your backend API
      // For now, we'll simulate the process
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl,
          cancelUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const session = await response.json()
      
      // Redirect to Stripe Checkout
      const result = await this.stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return { success: true }
    } catch (error) {
      console.error('Checkout session creation failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Create customer portal session
  async createPortalSession(customerId, returnUrl) {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const session = await response.json()
      
      // Redirect to customer portal
      window.location.href = session.url
      
      return { success: true }
    } catch (error) {
      console.error('Portal session creation failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Get subscription status
  async getSubscriptionStatus(userId) {
    try {
      const response = await fetch(`/api/subscription-status/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to get subscription status')
      }

      const data = await response.json()
      return {
        success: true,
        status: data.status,
        currentPeriodEnd: data.currentPeriodEnd,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd
      }
    } catch (error) {
      console.error('Failed to get subscription status:', error)
      return { success: false, error: error.message }
    }
  }

  // Subscription plans configuration
  getSubscriptionPlans() {
    return {
      free: {
        name: 'Free',
        price: 0,
        priceId: null,
        features: [
          'Basic rights information',
          'Standard scripts',
          'Limited state coverage',
          'Basic recording (local storage)'
        ],
        limitations: [
          'No AI-generated scripts',
          'No cloud storage',
          'No premium state guides',
          'No incident sharing'
        ]
      },
      premium: {
        name: 'Premium',
        price: 4.99,
        priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
        features: [
          'All free features',
          'AI-generated custom scripts',
          'All 50 states coverage',
          'Cloud storage via IPFS',
          'Incident sharing',
          'Spanish translations',
          'Priority support',
          'Advanced legal summaries'
        ],
        limitations: []
      }
    }
  }

  // Check if feature is available for user's subscription
  isFeatureAvailable(feature, subscriptionStatus) {
    const premiumFeatures = [
      'ai-scripts',
      'cloud-storage',
      'incident-sharing',
      'all-states',
      'spanish-translation',
      'advanced-summaries'
    ]

    if (subscriptionStatus === 'premium') {
      return true
    }

    return !premiumFeatures.includes(feature)
  }

  // Simulate subscription upgrade (for demo purposes)
  async simulateUpgrade(userId) {
    try {
      // In a real app, this would process the payment
      // For demo, we'll just update the user's status
      localStorage.setItem('subscription_status', 'premium')
      localStorage.setItem('subscription_upgraded_at', new Date().toISOString())
      
      return {
        success: true,
        message: 'Successfully upgraded to Premium!'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get upgrade URL for demo
  getUpgradeUrl() {
    return '/upgrade'
  }

  // Format price for display
  formatPrice(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }
}

export const stripeService = new StripeService()
