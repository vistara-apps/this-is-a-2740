import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Shield, FileText, Mic, BookOpen } from 'lucide-react'

const MobileNav = () => {
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Rights', icon: Shield, path: '/rights' },
    { name: 'Laws', icon: FileText, path: '/state-laws' },
    { name: 'Record', icon: Mic, path: '/recording' },
    { name: 'Guides', icon: BookOpen, path: '/guides' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-gray-700 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-purple-primary'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default MobileNav