import React from 'react'
import { NavLink } from 'react-router-dom'
import { X, Shield, FileText, Mic, BookOpen, Home, Crown } from 'lucide-react'
import { useUser } from '../context/UserContext'

const Sidebar = ({ onClose }) => {
  const { subscriptionStatus } = useUser()

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Your Rights', icon: Shield, path: '/rights' },
    { name: 'State Laws', icon: FileText, path: '/state-laws' },
    { name: 'Record Incident', icon: Mic, path: '/recording' },
    { name: 'Best Practices', icon: BookOpen, path: '/guides' },
  ]

  return (
    <div className="flex flex-col h-full bg-dark-surface border-r border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-xl font-bold text-white">KnowYourRights AI</h1>
          <p className="text-sm text-gray-400 mt-1">Legal clarity in your pocket</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-primary text-white'
                  : 'text-gray-300 hover:text-white hover:bg-dark-card'
              }`
            }
            onClick={onClose}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Subscription Status */}
      <div className="p-4">
        <div className="bg-dark-card rounded-lg p-4">
          <div className="flex items-center">
            <Crown className={`h-5 w-5 mr-2 ${subscriptionStatus === 'premium' ? 'text-yellow-400' : 'text-gray-400'}`} />
            <span className="text-sm font-medium text-white">
              {subscriptionStatus === 'premium' ? 'Premium' : 'Free Plan'}
            </span>
          </div>
          {subscriptionStatus === 'free' && (
            <button className="w-full mt-3 btn-primary text-sm py-2">
              Upgrade to Premium
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar