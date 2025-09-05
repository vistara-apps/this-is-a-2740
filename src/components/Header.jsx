import React from 'react'
import { Menu, Bell, User } from 'lucide-react'
import { useUser } from '../context/UserContext'

const Header = ({ onMenuClick }) => {
  const { user, selectedState } = useUser()

  return (
    <header className="bg-dark-surface border-b border-gray-700 lg:border-none">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-card transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo for mobile */}
          <div className="lg:hidden">
            <h1 className="text-xl font-bold text-white">KnowYourRights AI</h1>
          </div>

          {/* State selector and user actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <span className="text-sm text-gray-400">Current State:</span>
              <span className="ml-2 text-white font-medium">{selectedState}</span>
            </div>
            
            <button className="p-2 rounded-full bg-dark-card text-gray-400 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              {user && (
                <span className="hidden sm:block text-white text-sm">{user.email}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header